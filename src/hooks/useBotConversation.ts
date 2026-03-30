"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { createRequest, CreateRequestDto } from "@/store/slices/buyerRequestsSlice";
import { getApiClient } from "@/lib/apiClient";

// ── Step enum ──────────────────────────────────────────────────────────────────

export enum BotStep {
  IDLE = "IDLE",
  GREETING = "GREETING",
  // Product request flow
  COLLECT_NAME = "COLLECT_NAME",
  COLLECT_EMAIL = "COLLECT_EMAIL",
  COLLECT_PRODUCT_NAME = "COLLECT_PRODUCT_NAME",
  COLLECT_QUANTITY = "COLLECT_QUANTITY",
  COLLECT_UNIT = "COLLECT_UNIT",
  COLLECT_DATE_NEEDED = "COLLECT_DATE_NEEDED",
  COLLECT_BUDGET = "COLLECT_BUDGET",
  COLLECT_DESCRIPTION = "COLLECT_DESCRIPTION",
  CONFIRM_REQUEST = "CONFIRM_REQUEST",
  SUBMITTING = "SUBMITTING",
  REQUEST_SUBMITTED = "REQUEST_SUBMITTED",
  REQUEST_FAILED = "REQUEST_FAILED",
  // Country interest flow
  COLLECT_COUNTRY = "COLLECT_COUNTRY",
  COLLECT_COUNTRY_EMAIL = "COLLECT_COUNTRY_EMAIL",
  COUNTRY_SUBMITTING = "COUNTRY_SUBMITTING",
  COUNTRY_SUBMITTED = "COUNTRY_SUBMITTED",
  // General
  DISMISSED = "DISMISSED",
}

// ── Message types ──────────────────────────────────────────────────────────────

export type MessageSender = "bot" | "user";

export interface QuickReply {
  label: string;
  value: string;
}

export interface BotMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  quickReplies?: QuickReply[];
  requestSummary?: RequestDraft;
  isTyping?: boolean;
  submittedRequestNumber?: string;
}

export interface RequestDraft {
  guest_name?: string;
  guest_email?: string;
  product_name: string;
  quantity: number;
  unit_of_measurement: string;
  date_needed?: string;
  budget_min?: number;
  budget_max?: number;
  description?: string;
  // Country interest
  country?: string;
  country_email?: string;
}

// ── Session storage ────────────────────────────────────────────────────────────

const STORAGE_KEY = "procur_bot_v3";
const VISITED_KEY = "procur_bot_seen";

interface PersistedState {
  isOpen: boolean;
  step: BotStep;
  messages: BotMessage[];
  draft: Partial<RequestDraft>;
}

function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function persistState(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

let msgId = 0;
function makeId(): string {
  return `msg_${Date.now()}_${++msgId}`;
}

const UNIT_OPTIONS: QuickReply[] = [
  { label: "lbs", value: "lbs" },
  { label: "kg", value: "kg" },
  { label: "units", value: "units" },
  { label: "bundles", value: "bundles" },
  { label: "cases", value: "cases" },
  { label: "bags", value: "bags" },
  { label: "gallons", value: "gallons" },
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeGreetingMessage(name: string): BotMessage {
  const greeting = name
    ? `Hi ${name}! Can't find what you're looking for? I can help you submit a request and our team will source it for you.`
    : `Hi there! Can't find what you're looking for? I can help you submit a request and our team will source it for you.`;

  return {
    id: makeId(),
    sender: "bot",
    text: greeting,
    timestamp: Date.now(),
    quickReplies: [
      { label: "Yes, help me", value: "yes" },
      { label: "Bring Procur to my country", value: "country" },
      { label: "Just browsing", value: "dismiss" },
    ],
  };
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useBotConversation() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = !!user?.id;

  // All state starts empty/false to match SSR
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<BotStep>(BotStep.IDLE);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [draft, setDraft] = useState<Partial<RequestDraft>>({});
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage after first client render
  const didHydrate = useRef(false);
  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    const persisted = loadPersistedState();
    if (persisted) {
      setIsOpen(persisted.isOpen);
      setStep(persisted.step);
      setMessages(persisted.messages);
      setDraft(persisted.draft);
    }
    setHydrated(true);
  }, []);

  // Auto-open for first-time visitors (after hydration)
  const didAutoOpen = useRef(false);
  useEffect(() => {
    if (!hydrated || didAutoOpen.current) return;
    didAutoOpen.current = true;
    // If there's already persisted state, user interacted this session
    if (loadPersistedState()) return;
    const seen = localStorage.getItem(VISITED_KEY);
    if (!seen) {
      localStorage.setItem(VISITED_KEY, "1");
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hydrated]);

  // ── THE SINGLE GREETING PATH ─────────────────────────────────────────────────
  // When the window opens and there are no messages yet, add the greeting.
  // This is the ONLY place a greeting is ever created.
  const didGreet = useRef(false);
  useEffect(() => {
    if (!hydrated) return;
    if (!isOpen) return;
    if (messages.length > 0) return;
    if (didGreet.current) return;
    didGreet.current = true;

    const firstName = isLoggedIn && user?.fullname ? user.fullname.split(" ")[0] : "";
    const greetMsg = makeGreetingMessage(firstName);
    setMessages([greetMsg]);
    setStep(BotStep.GREETING);
  }, [hydrated, isOpen, messages.length, isLoggedIn, user]);

  // Debounced persist (only after hydration)
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      persistState({ isOpen, step, messages, draft });
    }, 400);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [hydrated, isOpen, step, messages, draft]);

  // ── Add message helpers ──────────────────────────────────────────────────────

  const addBotMessage = useCallback(
    (text: string, extras?: Partial<BotMessage>) => {
      const msg: BotMessage = {
        id: makeId(),
        sender: "bot",
        text,
        timestamp: Date.now(),
        ...extras,
      };
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    []
  );

  const addUserMessage = useCallback((text: string) => {
    const msg: BotMessage = {
      id: makeId(),
      sender: "user",
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const botReply = useCallback(
    (text: string, extras?: Partial<BotMessage>, delayMs = 600) => {
      const typingId = makeId();
      setMessages((prev) => [
        ...prev,
        { id: typingId, sender: "bot", text: "", timestamp: Date.now(), isTyping: true },
      ]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== typingId));
        addBotMessage(text, extras);
      }, delayMs);
    },
    [addBotMessage]
  );

  // ── Toggle open/close ────────────────────────────────────────────────────────

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // ── Transition to next collection step ───────────────────────────────────────

  const goToStep = useCallback(
    (nextStep: BotStep) => {
      setStep(nextStep);

      switch (nextStep) {
        case BotStep.COLLECT_NAME:
          botReply("Great! Let's get started. What's your name?");
          break;
        case BotStep.COLLECT_EMAIL:
          botReply("And what's your email so we can get back to you?");
          break;
        case BotStep.COLLECT_PRODUCT_NAME:
          botReply(
            isLoggedIn
              ? "Great! What product are you looking for?"
              : "Perfect! Now, what product are you looking for?"
          );
          break;
        case BotStep.COLLECT_QUANTITY:
          botReply("How much do you need?");
          break;
        case BotStep.COLLECT_UNIT:
          botReply("What unit of measurement?", {
            quickReplies: UNIT_OPTIONS,
          });
          break;
        case BotStep.COLLECT_DATE_NEEDED:
          botReply("When do you need it by?", {
            quickReplies: [
              { label: "ASAP", value: "ASAP" },
              { label: "Skip", value: "__skip__" },
            ],
          });
          break;
        case BotStep.COLLECT_BUDGET:
          botReply("Do you have a budget range? (e.g. 100-500)", {
            quickReplies: [{ label: "Skip", value: "__skip__" }],
          });
          break;
        case BotStep.COLLECT_DESCRIPTION:
          botReply("Any other details you'd like to add?", {
            quickReplies: [{ label: "Skip", value: "__skip__" }],
          });
          break;
        case BotStep.CONFIRM_REQUEST:
          botReply("Here's a summary of your request. Ready to submit?", {
            requestSummary: draft as RequestDraft,
            quickReplies: [
              { label: "Submit", value: "submit" },
              { label: "Cancel", value: "cancel" },
            ],
          });
          break;
        // Country interest flow
        case BotStep.COLLECT_COUNTRY:
          botReply("We'd love to expand! What country are you in?");
          break;
        case BotStep.COLLECT_COUNTRY_EMAIL:
          botReply("Great! What's your email so we can notify you when we launch there?");
          break;
        default:
          break;
      }
    },
    [botReply, draft, isLoggedIn]
  );

  // ── Submit request ───────────────────────────────────────────────────────────

  const submitRequest = useCallback(async () => {
    setStep(BotStep.SUBMITTING);

    try {
      if (isLoggedIn) {
        const requestDto: CreateRequestDto = {
          product_name: draft.product_name!,
          quantity: draft.quantity!,
          unit_of_measurement: draft.unit_of_measurement!,
          date_needed: draft.date_needed,
          budget_range:
            draft.budget_min != null && draft.budget_max != null
              ? { min: draft.budget_min, max: draft.budget_max, currency: "XCD" }
              : undefined,
          description: draft.description,
        };
        const result = await dispatch(createRequest(requestDto)).unwrap();
        setStep(BotStep.REQUEST_SUBMITTED);
        botReply(
          `Your request has been submitted! Our team will review it and get back to you soon.`,
          {
            submittedRequestNumber: result?.request_number,
            quickReplies: [
              { label: "New request", value: "restart" },
              { label: "Close", value: "close" },
            ],
          }
        );
      } else {
        const apiClient = getApiClient(() => null);
        const payload = {
          product_name: draft.product_name,
          quantity: draft.quantity,
          unit_of_measurement: draft.unit_of_measurement,
          date_needed: draft.date_needed,
          budget_range:
            draft.budget_min != null && draft.budget_max != null
              ? { min: draft.budget_min, max: draft.budget_max, currency: "XCD" }
              : undefined,
          description: draft.description,
          guest_name: draft.guest_name,
          guest_email: draft.guest_email,
        };
        const response = await apiClient.post("/marketplace/requests", payload);
        setStep(BotStep.REQUEST_SUBMITTED);
        botReply(
          `Your request has been submitted! We'll reach out to ${draft.guest_email} once we've found what you need.`,
          {
            submittedRequestNumber: response.data?.request_number,
            quickReplies: [
              { label: "New request", value: "restart" },
              { label: "Close", value: "close" },
            ],
          }
        );
      }
    } catch {
      setStep(BotStep.REQUEST_FAILED);
      botReply("Sorry, something went wrong submitting your request. Would you like to try again?", {
        quickReplies: [
          { label: "Try again", value: "submit" },
          { label: "Cancel", value: "cancel" },
        ],
      });
    }
  }, [isLoggedIn, draft, dispatch, botReply]);

  // ── Submit country interest ─────────────────────────────────────────────────

  const submitCountryInterest = useCallback(
    async (country: string, email: string) => {
      setStep(BotStep.COUNTRY_SUBMITTING);
      try {
        const apiClient = getApiClient(() => null);
        await apiClient.post("/marketplace/country-interest", { country, email });
        setStep(BotStep.COUNTRY_SUBMITTED);
        botReply(
          `Thank you! We've noted your interest in bringing Procur to ${country}. We'll notify ${email} when we expand there.`,
          {
            quickReplies: [
              { label: "Submit a request", value: "restart" },
              { label: "Close", value: "close" },
            ],
          }
        );
      } catch {
        setStep(BotStep.COUNTRY_SUBMITTED);
        botReply(
          `Thank you for your interest in bringing Procur to ${country}! We'll keep you posted.`,
          {
            quickReplies: [
              { label: "Submit a request", value: "restart" },
              { label: "Close", value: "close" },
            ],
          }
        );
      }
    },
    [botReply]
  );

  // ── Core input processing (no user message added) ─────────────────────────

  const processInput = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      switch (step) {
        case BotStep.GREETING: {
          const lower = trimmed.toLowerCase();
          if (lower === "country" || lower.includes("country")) {
            goToStep(BotStep.COLLECT_COUNTRY);
          } else if (lower.includes("yes") || lower.includes("help") || lower.includes("sure") || lower.includes("ok")) {
            goToStep(isLoggedIn ? BotStep.COLLECT_PRODUCT_NAME : BotStep.COLLECT_NAME);
          } else {
            setStep(BotStep.DISMISSED);
            botReply("No problem! I'm here if you need me. Just tap the button anytime.");
          }
          break;
        }

        case BotStep.COLLECT_NAME:
          if (trimmed.length < 2) {
            botReply("Please enter your name so we know who to follow up with.");
            break;
          }
          setDraft((d) => ({ ...d, guest_name: trimmed }));
          goToStep(BotStep.COLLECT_EMAIL);
          break;

        case BotStep.COLLECT_EMAIL:
          if (!isValidEmail(trimmed)) {
            botReply("That doesn't look like a valid email. Could you try again?");
            break;
          }
          setDraft((d) => ({ ...d, guest_email: trimmed }));
          goToStep(BotStep.COLLECT_PRODUCT_NAME);
          break;

        case BotStep.COLLECT_PRODUCT_NAME:
          if (trimmed.length < 2) {
            botReply("Could you give me a bit more detail about what you're looking for?");
            break;
          }
          setDraft((d) => ({ ...d, product_name: trimmed }));
          goToStep(BotStep.COLLECT_QUANTITY);
          break;

        case BotStep.COLLECT_QUANTITY: {
          const qty = parseFloat(trimmed.replace(/[^0-9.]/g, ""));
          if (isNaN(qty) || qty <= 0) {
            botReply("Please enter a valid quantity (e.g. 50, 100).");
            break;
          }
          setDraft((d) => ({ ...d, quantity: qty }));
          goToStep(BotStep.COLLECT_UNIT);
          break;
        }

        case BotStep.COLLECT_UNIT:
          setDraft((d) => ({ ...d, unit_of_measurement: trimmed }));
          goToStep(BotStep.COLLECT_DATE_NEEDED);
          break;

        case BotStep.COLLECT_DATE_NEEDED:
          if (trimmed === "__skip__") {
            goToStep(BotStep.COLLECT_BUDGET);
          } else {
            setDraft((d) => ({ ...d, date_needed: trimmed }));
            goToStep(BotStep.COLLECT_BUDGET);
          }
          break;

        case BotStep.COLLECT_BUDGET: {
          if (trimmed === "__skip__") {
            goToStep(BotStep.COLLECT_DESCRIPTION);
            break;
          }
          const nums = trimmed.replace(/[$,]/g, "").match(/(\d+(?:\.\d+)?)/g);
          if (nums && nums.length >= 2) {
            setDraft((d) => ({ ...d, budget_min: parseFloat(nums[0]), budget_max: parseFloat(nums[1]) }));
          } else if (nums && nums.length === 1) {
            const val = parseFloat(nums[0]);
            setDraft((d) => ({ ...d, budget_min: val, budget_max: val }));
          }
          goToStep(BotStep.COLLECT_DESCRIPTION);
          break;
        }

        case BotStep.COLLECT_DESCRIPTION:
          if (trimmed !== "__skip__") {
            setDraft((d) => ({ ...d, description: trimmed }));
          }
          goToStep(BotStep.CONFIRM_REQUEST);
          break;

        case BotStep.CONFIRM_REQUEST:
        case BotStep.REQUEST_FAILED: {
          const lower = trimmed.toLowerCase();
          if (lower === "submit" || lower.includes("yes") || lower.includes("confirm")) {
            submitRequest();
          } else if (lower === "cancel" || lower.includes("no")) {
            setStep(BotStep.DISMISSED);
            botReply("No worries! Your request has been cancelled. I'm here if you change your mind.");
          }
          break;
        }

        case BotStep.REQUEST_SUBMITTED:
        case BotStep.COUNTRY_SUBMITTED: {
          const lower = trimmed.toLowerCase();
          if (lower === "restart" || lower.includes("new") || lower.includes("another")) {
            setMessages([]);
            setDraft({});
            didGreet.current = false;
            setStep(BotStep.IDLE);
          } else if (lower === "close") {
            setIsOpen(false);
          }
          break;
        }

        // ── Country interest flow ──────────────────────────────────────
        case BotStep.COLLECT_COUNTRY:
          if (trimmed.length < 2) {
            botReply("Please enter your country name.");
            break;
          }
          setDraft((d) => ({ ...d, country: trimmed }));
          if (isLoggedIn) {
            // Already have email from auth
            submitCountryInterest(trimmed, user?.email || "");
          } else {
            goToStep(BotStep.COLLECT_COUNTRY_EMAIL);
          }
          break;

        case BotStep.COLLECT_COUNTRY_EMAIL:
          if (!isValidEmail(trimmed)) {
            botReply("That doesn't look like a valid email. Could you try again?");
            break;
          }
          setDraft((d) => ({ ...d, country_email: trimmed }));
          submitCountryInterest(draft.country || "", trimmed);
          break;

        default:
          break;
      }
    },
    [step, isLoggedIn, user, draft, goToStep, botReply, submitRequest, submitCountryInterest]
  );

  // ── Send message (typed input): shows user message + processes ──────────────

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      addUserMessage(trimmed);
      processInput(trimmed);
    },
    [addUserMessage, processInput]
  );

  // ── Handle quick reply taps ──────────────────────────────────────────────────

  const handleQuickReply = useCallback(
    (reply: QuickReply) => {
      // Show the label in chat (user-friendly), process the value for logic
      addUserMessage(reply.label);
      processInput(reply.value);
    },
    [addUserMessage, processInput]
  );

  return {
    hydrated,
    isOpen,
    toggleOpen,
    step,
    messages,
    draft,
    isLoggedIn,
    sendMessage,
    handleQuickReply,
  };
}

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import axios from "axios";
import type { RootState } from "..";

export type AuthUser = {
  id: string;
  email: string;
  fullname: string;
  profileImg?: string;
  role: string;
  accountType: string;
  emailVerified: boolean;
  organizationId?: string | null;
  organizationName?: string | null;
  organizationRole?: string | null;
};

export type OrganizationMembership = {
  id: string;
  name: string;
  accountType: string; // 'buyer' | 'seller' | 'government'
  role: string;
  isActive: boolean;
};

export type AuthState = {
  accessToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  refreshToken: string | null;
  user: AuthUser | null;
  organizations: OrganizationMembership[];
  organizationsStatus: "idle" | "loading" | "succeeded" | "failed";
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  refreshToken: null,
  user: null,
  organizations: [],
  organizationsStatus: "idle",
  status: "idle",
  error: null,
};

// Shared auth response shape returned by all sign-in endpoints
type AuthResponsePayload = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  user: AuthUser;
};

type SigninPayload = { email: string; password: string };
type SignupPayload = {
  email: string;
  password: string;
  fullname: string;
  accountType: string; // 'buyer' | 'seller' etc.
  phoneNumber?: string;
  country: string;
  businessType?: string;
  businessName?: string;
  website?: string;
  captchaToken: string;
};

function getClient() {
  return getApiClient(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { accessToken?: string };
      return parsed.accessToken ?? null;
    } catch {
      return null;
    }
  });
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const msg = (error.response?.data as any)?.message; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  if (typeof error === "object" && error !== null) {
    const maybeMsg = (error as { message?: unknown }).message;
    if (typeof maybeMsg === "string") return maybeMsg;
  }
  return fallback;
}

/** Decode a JWT and check if it is expired without verifying signature. */
function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return false; // unparseable — let the server decide
  }
}

/** Persist auth state to localStorage. */
function saveToStorage(state: AuthState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "auth",
    JSON.stringify({
      accessToken: state.accessToken,
      tokenType: state.tokenType,
      expiresIn: state.expiresIn,
      refreshToken: state.refreshToken,
      user: state.user,
    })
  );
}

// ==================== Async Thunks ====================

export const signin = createAsyncThunk(
  "auth/signin",
  async (payload: SigninPayload, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/signin", payload);
      return data as AuthResponsePayload;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to sign in"));
    }
  }
);

export const devSignin = createAsyncThunk(
  "auth/devSignin",
  async (
    payload: { accountType: "seller" | "buyer" | "government" },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/dev-signin", payload);
      return data as AuthResponsePayload;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to dev sign in"));
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/signup", payload);
      // Backend returns message + email; verify flow handles auth
      return data as { message: string; email: string };
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to sign up"));
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (payload: { token: string }, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/verify", payload);
      // data.auth contains tokens and user
      return data.auth as AuthResponsePayload;
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to verify email")
      );
    }
  }
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email: string, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post(`/auth/resend-verification`, null, {
        params: { email },
      });
      return data as { message: string };
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to resend verification")
      );
    }
  }
);

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (
    payload: { phoneNumber: string; channel?: "whatsapp" | "email" },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/otp/request", payload);
      return data as { message: string };
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to send code"));
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    payload: { phoneNumber: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/otp/verify", payload);
      return data as AuthResponsePayload;
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Invalid or expired code")
      );
    }
  }
);

// ==================== Multi-org / role-toggle thunks ====================

/** Load every org the current user belongs to. Backs the mode-switcher pill. */
export const fetchMyOrganizations = createAsyncThunk(
  "auth/fetchMyOrganizations",
  async (_, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/auth/organizations");
      return (data?.organizations || []) as OrganizationMembership[];
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to load organizations")
      );
    }
  }
);

/** Switch the active org. Backend re-mints tokens scoped to the new org. */
export const switchOrganization = createAsyncThunk(
  "auth/switchOrganization",
  async (organizationId: string, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/switch-organization", {
        organizationId,
      });
      return data as AuthResponsePayload;
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to switch organization")
      );
    }
  }
);

type BecomeRolePayload = {
  businessName: string;
  businessType?: string;
  countryId?: string;
};

/** Create a seller org for an existing user and switch into it. */
export const becomeSeller = createAsyncThunk(
  "auth/becomeSeller",
  async (payload: BecomeRolePayload, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post(
        "/auth/onboarding/become-seller",
        payload
      );
      return data as AuthResponsePayload;
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to start selling")
      );
    }
  }
);

/** Create a buyer org for an existing user and switch into it. */
export const becomeBuyer = createAsyncThunk(
  "auth/becomeBuyer",
  async (payload: BecomeRolePayload, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post(
        "/auth/onboarding/become-buyer",
        payload
      );
      return data as AuthResponsePayload;
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to start buying")
      );
    }
  }
);

/** Silently exchange a refresh token for a new access token + rotated refresh token. */
export const refreshTokenAsync = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.refreshToken) return rejectWithValue("No refresh token");
      const client = getApiClient(() => null); // no auth header needed for this call
      const { data } = await client.post("/auth/refresh", {
        refreshToken: auth.refreshToken,
      });
      return data as AuthResponsePayload;
    } catch {
      return rejectWithValue("Refresh failed");
    }
  }
);

// ==================== Slice ====================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signout(state) {
      state.accessToken = null;
      state.tokenType = null;
      state.expiresIn = null;
      state.refreshToken = null;
      state.user = null;
      state.organizations = [];
      state.organizationsStatus = "idle";
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    },
    hydrateFromStorage(state) {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("auth");
      if (!raw) return;
      try {
        const saved = JSON.parse(raw) as Partial<AuthState>;
        // If the access token is expired AND there's no refresh token, clear auth entirely
        if (
          saved.accessToken &&
          isJwtExpired(saved.accessToken) &&
          !saved.refreshToken
        ) {
          localStorage.removeItem("auth");
          return;
        }
        state.accessToken = saved.accessToken ?? null;
        state.tokenType = saved.tokenType ?? null;
        state.expiresIn = saved.expiresIn ?? null;
        state.refreshToken = saved.refreshToken ?? null;
        state.user = saved.user ?? null;
      } catch {
        // ignore malformed storage
      }
    },
    setAuthState(
      state,
      action: PayloadAction<{
        accessToken: string;
        tokenType: string;
        expiresIn: number | null;
        refreshToken?: string;
        user: AuthUser;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.tokenType = action.payload.tokenType;
      state.expiresIn = action.payload.expiresIn;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      state.user = action.payload.user;
      state.status = "succeeded";
      state.error = null;
      saveToStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder
      // ── signin ──────────────────────────────────────────────────────────────
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action: PayloadAction<AuthResponsePayload>) => {
        state.status = "succeeded";
        state.error = null;
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        saveToStorage(state);
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to sign in";
      })

      // ── devSignin ───────────────────────────────────────────────────────────
      .addCase(devSignin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(devSignin.fulfilled, (state, action: PayloadAction<AuthResponsePayload>) => {
        state.status = "succeeded";
        state.error = null;
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        saveToStorage(state);
      })
      .addCase(devSignin.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to dev sign in";
      })

      // ── signup ──────────────────────────────────────────────────────────────
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to sign up";
      })

      // ── verifyEmail ─────────────────────────────────────────────────────────
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<AuthResponsePayload>) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        saveToStorage(state);
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to verify email";
      })

      // ── resendVerification ──────────────────────────────────────────────────
      .addCase(resendVerification.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to resend verification";
      })

      // ── requestOtp ──────────────────────────────────────────────────────────
      .addCase(requestOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to send code";
      })

      // ── verifyOtp ───────────────────────────────────────────────────────────
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<AuthResponsePayload>) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        saveToStorage(state);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Invalid or expired code";
      })

      // ── refreshTokenAsync ───────────────────────────────────────────────────
      .addCase(refreshTokenAsync.fulfilled, (state, action: PayloadAction<AuthResponsePayload>) => {
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.status = "succeeded";
        saveToStorage(state);
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        // Refresh failed silently — the interceptor in apiClient handles redirect
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.status = "idle";
      })

      // ── fetchMyOrganizations ────────────────────────────────────────────────
      .addCase(fetchMyOrganizations.pending, (state) => {
        state.organizationsStatus = "loading";
      })
      .addCase(fetchMyOrganizations.fulfilled, (state, action) => {
        state.organizationsStatus = "succeeded";
        state.organizations = action.payload;
      })
      .addCase(fetchMyOrganizations.rejected, (state) => {
        state.organizationsStatus = "failed";
      })

      // ── switchOrganization / becomeSeller / becomeBuyer ─────────────────────
      // All three rotate tokens and update the active user payload; we collapse
      // their fulfilled handlers into one shape since the response is identical.
      .addCase(switchOrganization.fulfilled, (state, action: PayloadAction<AuthResponsePayload>) => {
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        // Recompute isActive flags locally so the UI reflects the switch before the next
        // fetchMyOrganizations call (otherwise the old pill stays highlighted).
        const newActiveId = action.payload.user.organizationId;
        state.organizations = state.organizations.map((o) => ({
          ...o,
          isActive: o.id === newActiveId,
        }));
        saveToStorage(state);
      })
      .addCase(becomeSeller.fulfilled, (state, action: PayloadAction<AuthResponsePayload>) => {
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        // New org is now active; old organizations list is stale until next fetch — flag
        // its status so the UI knows to reload it.
        state.organizationsStatus = "idle";
        saveToStorage(state);
      })
      .addCase(becomeBuyer.fulfilled, (state, action: PayloadAction<AuthResponsePayload>) => {
        state.accessToken = action.payload.accessToken;
        state.tokenType = action.payload.tokenType;
        state.expiresIn = action.payload.expiresIn;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.organizationsStatus = "idle";
        saveToStorage(state);
      });
  },
});

export const { signout, hydrateFromStorage, setAuthState } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.accessToken;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectMyOrganizations = (state: RootState) =>
  state.auth.organizations;
export const selectOrganizationsStatus = (state: RootState) =>
  state.auth.organizationsStatus;

export default authSlice.reducer;

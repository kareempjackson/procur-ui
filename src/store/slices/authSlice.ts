import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import axios from "axios";
import type { RootState } from "..";

export type AuthUser = {
  id: string;
  email: string;
  fullname: string;
  role: string;
  accountType: string;
  emailVerified: boolean;
  organizationId?: string | null;
  organizationName?: string | null;
  organizationRole?: string | null;
};

export type AuthState = {
  accessToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  user: AuthUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  user: null,
  status: "idle",
  error: null,
};

type SigninPayload = { email: string; password: string };
type SignupPayload = {
  email: string;
  password: string;
  fullname: string;
  accountType: string; // 'buyer' | 'seller' etc.
  phoneNumber?: string;
  country?: string;
  businessType?: string;
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

export const signin = createAsyncThunk(
  "auth/signin",
  async (payload: SigninPayload, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/signin", payload);
      return data as {
        accessToken: string;
        tokenType: string;
        expiresIn: number;
        user: AuthUser;
      };
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to sign in"));
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.post("/auth/signup", payload);
      // Backend returns message + email; we keep state idle and let verify flow handle auth
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
      return data.auth as {
        accessToken: string;
        tokenType: string;
        expiresIn: number;
        user: AuthUser;
      };
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signout(state) {
      state.accessToken = null;
      state.tokenType = null;
      state.expiresIn = null;
      state.user = null;
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
        state.accessToken = saved.accessToken ?? null;
        state.tokenType = saved.tokenType ?? null;
        state.expiresIn = saved.expiresIn ?? null;
        state.user = saved.user ?? null;
      } catch {
        // ignore
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        signin.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string;
            tokenType: string;
            expiresIn: number;
            user: AuthUser;
          }>
        ) => {
          state.status = "succeeded";
          state.error = null;
          state.accessToken = action.payload.accessToken;
          state.tokenType = action.payload.tokenType;
          state.expiresIn = action.payload.expiresIn;
          state.user = action.payload.user;
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "auth",
              JSON.stringify({
                accessToken: state.accessToken,
                tokenType: state.tokenType,
                expiresIn: state.expiresIn,
                user: state.user,
              })
            );
          }
        }
      )
      .addCase(signin.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to sign in";
      })
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
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        verifyEmail.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string;
            tokenType: string;
            expiresIn: number;
            user: AuthUser;
          }>
        ) => {
          state.status = "succeeded";
          state.accessToken = action.payload.accessToken;
          state.tokenType = action.payload.tokenType;
          state.expiresIn = action.payload.expiresIn;
          state.user = action.payload.user;
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "auth",
              JSON.stringify({
                accessToken: state.accessToken,
                tokenType: state.tokenType,
                expiresIn: state.expiresIn,
                user: state.user,
              })
            );
          }
        }
      )
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to verify email";
      })
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
      });
  },
});

export const { signout, hydrateFromStorage } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.accessToken;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

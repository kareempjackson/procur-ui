import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import axios from "axios";

// Helper function to extract error messages
function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string | string[] })
      ?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  if (typeof error === "object" && error !== null) {
    const maybeMsg = (error as { message?: unknown }).message;
    if (typeof maybeMsg === "string") return maybeMsg;
  }
  return fallback;
}

// Interfaces
export interface UserProfile {
  id: string;
  email: string;
  fullname?: string;
  phone_number?: string;
  avatarUrl?: string | null;
  role?: string;
  emailVerified: boolean;
  organization?: {
    id: string;
    name: string;
    businessName?: string;
    businessType?: string;
    logoUrl?: string;
    farmersIdUrl?: string;
    farmersIdPath?: string;
    farmersIdVerified?: boolean;
    farmVerified?: boolean;
    accountType: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    website?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  // User-level fields
  fullname?: string;
  phone?: string;

  // Organization-level fields
  businessName?: string;
  name?: string;
  businessType?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  description?: string;
  taxId?: string;
  registrationNumber?: string;

  // Document / media fields
  farmersIdPath?: string;
  farmersIdUrl?: string;
  avatarPath?: string;
  logoPath?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
  newProductAlerts: boolean;
  marketingEmails: boolean;
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  addedDate: string;
}

interface ProfileState {
  profile: UserProfile | null;
  preferences: NotificationPreferences | null;
  organizationMembers: OrganizationMember[];
  status: "idle" | "loading" | "succeeded" | "failed";
  preferencesStatus: "idle" | "loading" | "succeeded" | "failed";
  membersStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  preferences: null,
  organizationMembers: [],
  status: "idle",
  preferencesStatus: "idle",
  membersStatus: "idle",
  error: null,
};

// ==================== ASYNC THUNKS ====================

// Fetch user profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const { data } = await client.get("/users/profile");
      return data as UserProfile;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch profile")
      );
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (updateData: UpdateProfileDto, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      // First apply the update
      await client.patch("/users/profile", updateData);
      // Then fetch the fresh profile so the slice shape always matches getProfile
      const { data } = await client.get("/users/profile");
      return data as UserProfile;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to update profile")
      );
    }
  }
);

// Fetch notification preferences
export const fetchPreferences = createAsyncThunk(
  "profile/fetchPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const { data } = await client.get("/users/preferences");
      return data as NotificationPreferences;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch preferences")
      );
    }
  }
);

// Update notification preferences
export const updatePreferences = createAsyncThunk(
  "profile/updatePreferences",
  async (
    preferences: Partial<NotificationPreferences>,
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient();
      const { data } = await client.patch("/users/preferences", preferences);
      return data as NotificationPreferences;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to update preferences")
      );
    }
  }
);

// Fetch organization members
export const fetchOrganizationMembers = createAsyncThunk(
  "profile/fetchOrganizationMembers",
  async (_, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const { data } = await client.get("/organizations/members");
      return data as OrganizationMember[];
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch organization members")
      );
    }
  }
);

// Invite organization member
export const inviteOrganizationMember = createAsyncThunk(
  "profile/inviteOrganizationMember",
  async (
    memberData: { email: string; name: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient();
      const { data } = await client.post(
        "/organizations/members/invite",
        memberData
      );
      return data as OrganizationMember;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to invite member")
      );
    }
  }
);

// Remove organization member
export const removeOrganizationMember = createAsyncThunk(
  "profile/removeOrganizationMember",
  async (memberId: string, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      await client.delete(`/organizations/members/${memberId}`);
      return memberId;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to remove member")
      );
    }
  }
);

// ==================== SLICE ====================

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLocalPreferences: (
      state,
      action: PayloadAction<Partial<NotificationPreferences>>
    ) => {
      if (state.preferences) {
        state.preferences = { ...state.preferences, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch Preferences
      .addCase(fetchPreferences.pending, (state) => {
        state.preferencesStatus = "loading";
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.preferencesStatus = "succeeded";
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.preferencesStatus = "failed";
        state.error = action.payload as string;
      })

      // Update Preferences
      .addCase(updatePreferences.pending, (state) => {
        state.preferencesStatus = "loading";
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferencesStatus = "succeeded";
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.preferencesStatus = "failed";
        state.error = action.payload as string;
      })

      // Fetch Organization Members
      .addCase(fetchOrganizationMembers.pending, (state) => {
        state.membersStatus = "loading";
      })
      .addCase(fetchOrganizationMembers.fulfilled, (state, action) => {
        state.membersStatus = "succeeded";
        state.organizationMembers = action.payload;
      })
      .addCase(fetchOrganizationMembers.rejected, (state, action) => {
        state.membersStatus = "failed";
        state.error = action.payload as string;
      })

      // Invite Organization Member
      .addCase(inviteOrganizationMember.pending, (state) => {
        state.membersStatus = "loading";
      })
      .addCase(inviteOrganizationMember.fulfilled, (state, action) => {
        state.membersStatus = "succeeded";
        state.organizationMembers.push(action.payload);
      })
      .addCase(inviteOrganizationMember.rejected, (state, action) => {
        state.membersStatus = "failed";
        state.error = action.payload as string;
      })

      // Remove Organization Member
      .addCase(removeOrganizationMember.pending, (state) => {
        state.membersStatus = "loading";
      })
      .addCase(removeOrganizationMember.fulfilled, (state, action) => {
        state.membersStatus = "succeeded";
        state.organizationMembers = state.organizationMembers.filter(
          (member) => member.id !== action.payload
        );
      })
      .addCase(removeOrganizationMember.rejected, (state, action) => {
        state.membersStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateLocalPreferences } = profileSlice.actions;
export default profileSlice.reducer;

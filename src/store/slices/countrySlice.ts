import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import type { RootState } from "..";

export interface Country {
  code: string;
  name: string;
  country_code: string;
  currency: string;
  timezone: string;
  is_active: boolean;
  config: Record<string, unknown>;
}

interface CountryState {
  code: string | null;
  name: string | null;
  currency: string;
  countries: Country[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CountryState = {
  code: null,
  name: null,
  currency: "XCD",
  countries: [],
  status: "idle",
};

export const fetchActiveCountries = createAsyncThunk(
  "country/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const client = getApiClient(() => null);
      const { data } = await client.get("/countries");
      return data.countries as Country[];
    } catch (err) {
      return rejectWithValue("Failed to fetch countries");
    }
  },
);

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<{ code: string; name: string; currency: string }>) {
      state.code = action.payload.code;
      state.name = action.payload.name;
      state.currency = action.payload.currency;
    },
    setCountryFromCode(state, action: PayloadAction<string>) {
      const country = state.countries.find((c) => c.code === action.payload);
      if (country) {
        state.code = country.code;
        state.name = country.name;
        state.currency = country.currency;
      } else {
        state.code = action.payload;
      }
    },
    clearCountry(state) {
      state.code = null;
      state.name = null;
      state.currency = "XCD";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveCountries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActiveCountries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.countries = action.payload;
        if (state.code && !state.name) {
          const match = action.payload.find((c) => c.code === state.code);
          if (match) {
            state.name = match.name;
            state.currency = match.currency;
          }
        }
      })
      .addCase(fetchActiveCountries.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setCountry, setCountryFromCode, clearCountry } = countrySlice.actions;

export const selectCountry = (state: RootState) => state.country;
export const selectCountryCode = (state: RootState) => state.country.code;
export const selectCountries = (state: RootState) => state.country.countries;

export default countrySlice.reducer;

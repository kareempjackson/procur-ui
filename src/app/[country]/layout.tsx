"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchActiveCountries,
  setCountryFromCode,
  selectCountry,
} from "@/store/slices/countrySlice";

export default function CountryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { countries, status } = useAppSelector(selectCountry);
  const countryCode = params.country as string;

  // Fetch active countries on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchActiveCountries());
    }
  }, [dispatch, status]);

  // Set country context from route param
  useEffect(() => {
    if (countryCode) {
      dispatch(setCountryFromCode(countryCode));
    }
  }, [dispatch, countryCode]);

  // Validate country code once countries are loaded
  useEffect(() => {
    if (status === "succeeded" && countries.length > 0 && countryCode) {
      const valid = countries.some((i) => i.code === countryCode);
      if (!valid) {
        router.replace("/");
      }
    }
  }, [status, countries, countryCode, router]);

  return <>{children}</>;
}

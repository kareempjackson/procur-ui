"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchFarmProfile,
  upsertFarmProfile,
  Certification,
} from "@/store/slices/farmSlice";
import { fetchActiveCountries, selectCountries } from "@/store/slices/countrySlice";

export default function FarmProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { profile, loading } = useAppSelector((s) => s.farm);
  const availableCountries = useAppSelector(selectCountries);

  useEffect(() => { dispatch(fetchActiveCountries()); }, [dispatch]);

  const [parish, setParish] = useState("");
  const [country, setCountry] = useState("GD");
  const [gpsLat, setGpsLat] = useState("");
  const [gpsLng, setGpsLng] = useState("");
  const [acreage, setAcreage] = useState("");
  const [crops, setCrops] = useState("");
  const [certs, setCerts] = useState<Certification[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    if (!profile) dispatch(fetchFarmProfile(accessToken));
  }, [accessToken, dispatch, profile]);

  useEffect(() => {
    if (!profile) return;
    setParish(profile.parish ?? "");
    setCountry(profile.country ?? "GD");
    setGpsLat(profile.gps_lat?.toString() ?? "");
    setGpsLng(profile.gps_lng?.toString() ?? "");
    setAcreage(profile.total_acreage?.toString() ?? "");
    setCrops(profile.primary_crops?.join(", ") ?? "");
    setCerts(profile.certifications ?? []);
  }, [profile]);

  const addCert = () =>
    setCerts([...certs, { type: "", certifier: "", number: "", issued: "", expires: "" }]);

  const updateCert = (i: number, field: keyof Certification, value: string) => {
    const updated = [...certs];
    updated[i] = { ...updated[i], [field]: value };
    setCerts(updated);
  };

  const removeCert = (i: number) => setCerts(certs.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setError("");

    const parsedCrops = crops
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    const result = await dispatch(
      upsertFarmProfile({
        accessToken,
        payload: {
          parish: parish || undefined,
          country: country || "GD",
          gps_lat: gpsLat ? parseFloat(gpsLat) : undefined,
          gps_lng: gpsLng ? parseFloat(gpsLng) : undefined,
          total_acreage: acreage ? parseFloat(acreage) : undefined,
          primary_crops: parsedCrops.length ? parsedCrops : undefined,
          certifications: certs,
        },
      })
    );

    if (upsertFarmProfile.fulfilled.match(result)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError((result.payload as string) ?? "Failed to save");
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--primary-background)]">
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/seller/farm"
          className="inline-flex items-center text-sm text-[color:var(--secondary-muted-edge)] hover:underline mb-6"
        >
          ← Back to Farm
        </Link>

        <h1 className="text-xl font-bold text-[color:var(--secondary-black)] mb-6">
          Farm Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[color:var(--secondary-black)] uppercase tracking-wide">
              Location
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                  Parish / District
                </label>
                <input
                  type="text"
                  value={parish}
                  onChange={(e) => setParish(e.target.value)}
                  placeholder="e.g. St. Andrew"
                  className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                />
              </div>
              <div>
                <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                >
                  {availableCountries.map((c) => (
                    <option key={c.code} value={c.country_code}>{c.name}</option>
                  ))}
                  {country && !availableCountries.some((c) => c.country_code === country) && (
                    <option value={country}>{country}</option>
                  )}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                  GPS Latitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={gpsLat}
                  onChange={(e) => setGpsLat(e.target.value)}
                  placeholder="12.1165"
                  className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                />
              </div>
              <div>
                <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                  GPS Longitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={gpsLng}
                  onChange={(e) => setGpsLng(e.target.value)}
                  placeholder="-61.679"
                  className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                />
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[color:var(--secondary-black)] uppercase tracking-wide">
              Farm Details
            </h2>
            <div>
              <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                Total Acreage
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={acreage}
                onChange={(e) => setAcreage(e.target.value)}
                placeholder="e.g. 12.5"
                className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
              />
            </div>
            <div>
              <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                Primary Crops{" "}
                <span className="font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={crops}
                onChange={(e) => setCrops(e.target.value)}
                placeholder="e.g. plantain, bok choi, pumpkin"
                className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[color:var(--secondary-black)] uppercase tracking-wide">
                Certifications
              </h2>
              <button
                type="button"
                onClick={addCert}
                className="inline-flex items-center gap-1 text-xs text-[color:var(--primary-accent2)] hover:underline"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            {certs.length === 0 && (
              <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                No certifications added yet.
              </p>
            )}

            {certs.map((cert, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-3 rounded-lg border border-[color:var(--secondary-soft-highlight)] p-3 relative"
              >
                <button
                  type="button"
                  onClick={() => removeCert(i)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
                <div>
                  <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                    Type *
                  </label>
                  <input
                    type="text"
                    value={cert.type}
                    onChange={(e) => updateCert(i, "type", e.target.value)}
                    placeholder="e.g. organic"
                    className="w-full rounded border border-[color:var(--secondary-soft-highlight)] px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[color:var(--primary-accent2)]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                    Certifier
                  </label>
                  <input
                    type="text"
                    value={cert.certifier ?? ""}
                    onChange={(e) => updateCert(i, "certifier", e.target.value)}
                    placeholder="e.g. USDA"
                    className="w-full rounded border border-[color:var(--secondary-soft-highlight)] px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[color:var(--primary-accent2)]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={cert.issued ?? ""}
                    onChange={(e) => updateCert(i, "issued", e.target.value)}
                    className="w-full rounded border border-[color:var(--secondary-soft-highlight)] px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[color:var(--primary-accent2)]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={cert.expires ?? ""}
                    onChange={(e) => updateCert(i, "expires", e.target.value)}
                    className="w-full rounded border border-[color:var(--secondary-soft-highlight)] px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[color:var(--primary-accent2)]/30"
                  />
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-600 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              {error}
            </p>
          )}

          {saved && (
            <p className="text-sm text-green-700 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
              Farm profile saved.
            </p>
          )}

          <button
            type="submit"
            disabled={loading.profile}
            className="w-full py-3 rounded-full bg-[color:var(--primary-accent2)] text-white font-medium hover:bg-[color:var(--primary-accent3)] disabled:opacity-50 transition-colors"
          >
            {loading.profile ? "Saving…" : "Save Farm Profile"}
          </button>
        </form>
      </main>
    </div>
  );
}

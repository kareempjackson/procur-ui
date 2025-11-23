"use client";

import Link from "next/link";
import { useAppSelector } from "@/store";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

export default function SellerVerificationChecklist() {
  const profile = useAppSelector((s) => s.profile.profile);
  const sellerHome = useAppSelector((s) => s.sellerHome);

  const org = profile?.organization;
  const latestFarmVisit = sellerHome.data?.latest_farm_visit_request;

  const hasBusinessDetails = Boolean(
    org && (org.businessName || org.name) && org.address && org.country
  );

  const hasFarmersId = Boolean(org?.farmersIdUrl || org?.farmersIdPath);

  const hasFarmVisit = Boolean(latestFarmVisit);

  const items = [
    {
      id: "business",
      label: "Business details completed",
      description:
        "Add your business name, address, and country in Seller → Business.",
      href: "/seller/business",
      done: hasBusinessDetails,
    },
    {
      id: "farmerId",
      label: "Farmer ID uploaded",
      description:
        "Upload a clear photo of your Farmer ID in the Compliance section of Business Settings.",
      href: "/seller/business",
      done: hasFarmersId,
    },
    {
      id: "farmVisit",
      label: "Farm visit requested",
      description:
        "Request an on-site farm visit from your Seller dashboard so our team can verify your fields.",
      href: "/seller",
      done: hasFarmVisit,
    },
  ];

  return (
    <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <h3 className="font-semibold text-amber-900">
        Steps to finish seller verification
      </h3>
      <p className="mt-1 text-xs text-amber-800">
        Once these are complete and reviewed by an admin, you&apos;ll be able to
        manage inventory and orders.
      </p>
      <ol className="mt-3 space-y-2 text-xs">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-amber-100/60 transition-colors"
          >
            <span className="mt-0.5">
              {item.done ? (
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              ) : (
                <ExclamationCircleIcon className="h-4 w-4 text-amber-500" />
              )}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-medium">
                  {item.label}
                  {item.done ? " — Completed" : " — Action needed"}
                </span>
              </div>
              <p className="mt-0.5 text-amber-900/90">{item.description}</p>
              <Link
                href={item.href}
                className="mt-0.5 inline-flex items-center text-[11px] font-medium text-amber-900 underline underline-offset-2 hover:text-amber-800"
              >
                Go to{" "}
                {item.href === "/seller"
                  ? "Seller dashboard"
                  : "Business Settings"}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

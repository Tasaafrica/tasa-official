"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserRecord } from "../lib/user-types";

const plans = [
  { id: "free", name: "Free", price: "$0/mo", desc: "Basic access" },
  { id: "pro", name: "Pro", price: "$12/mo", desc: "Everything you need" },
];

export default function BillingClient({
  clientID,
  user,
}: {
  clientID: string;
  user?: UserRecord | null;
}) {
  const [current, setCurrent] = useState("free");
  const label = user?.name || clientID;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Billing
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage subscription and payment for{" "}
          <span className="font-medium text-slate-900">{label}</span>.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Plan</h2>
              <p className="mt-1 text-sm text-slate-600">
                Choose the plan that fits your needs.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Demo
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {plans.map((plan) => {
              const isCurrent = current === plan.id;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    setCurrent(plan.id);
                    alert(`Subscribed to ${plan.name} (demo)`);
                  }}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left shadow-sm transition",
                    "border-slate-200 bg-white hover:bg-slate-50",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/15",
                    isCurrent && "border-teal-200 bg-teal-50/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {plan.name}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {plan.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {plan.price}
                      </p>
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-800">
                          <Check className="h-3.5 w-3.5" /> Current
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          Select
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Payment method
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Add or update your payment method.
          </p>

          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-900">
              No payment method on file
            </p>
            <p className="mt-1 text-sm text-slate-600">
              This is a demo screen, so nothing is stored.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("Open payment modal (demo)")}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/15"
          >
            Manage payment
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Note: This page is a UI demo — buttons trigger alerts for now.
      </p>
    </section>
  );
}

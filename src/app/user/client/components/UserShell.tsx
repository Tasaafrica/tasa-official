"use client";

import { CircleCheck, CircleX, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { UserRecord } from "../lib/user-types";
import Sidebar from "./Sidebar";

type Props = {
  clientID: string;
  user?: UserRecord | null;
  userError?: string | null;
  children: React.ReactNode;
};

export default function UserShell({
  clientID,
  user,
  userError,
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const title = user?.name?.trim() || clientID;

  useEffect(() => {
    if (!sidebarOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="flex min-h-dvh">
        <Sidebar
          clientID={clientID}
          user={user}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
            <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/15 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="Avatar"
                        fill
                        sizes="36px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-teal-700">
                        {title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {user?.email ? (
                        <span className="truncate">{user.email}</span>
                      ) : null}
                      {user?.isEmailVerified === true ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 font-medium text-teal-800">
                          <CircleCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      ) : user?.isEmailVerified === false ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-800">
                          <CircleX className="h-3.5 w-3.5" />
                          Unverified
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                  <Link
                    href={`/user/${clientID}/profile`}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Profile
                  </Link>
                  <span className="h-4 w-px bg-slate-200" />
                  <Link
                    href={`/user/${clientID}/billing`}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Billing
                  </Link>
                  <span className="h-4 w-px bg-slate-200" />
                  <Link
                    href={`/user/${clientID}/messages`}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Messages
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {userError ? (
            <div className="border-b border-amber-200 bg-amber-50">
              <div className="px-4 py-3 text-sm text-amber-900 sm:px-6">
                Failed to load user data:{" "}
                <span className="font-medium">{userError}</span>
              </div>
            </div>
          ) : null}

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

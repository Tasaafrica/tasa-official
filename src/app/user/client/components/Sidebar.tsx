"use client";

import {
  CreditCard,
  LayoutDashboard,
  MessagesSquare,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { UserRecord } from "../lib/user-types";

type Props = {
  clientID: string;
  user?: UserRecord | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

function SidebarInner({
  clientID,
  user,
  onNavigate,
}: {
  clientID: string;
  user?: UserRecord | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const nav: NavItem[] = useMemo(
    () => [
      {
        key: "home",
        label: "Overview",
        href: `/user/${clientID}`,
        icon: LayoutDashboard,
      },
      {
        key: "profile",
        label: "Profile",
        href: `/user/${clientID}/profile`,
        icon: UserRound,
      },
      {
        key: "billing",
        label: "Billing",
        href: `/user/${clientID}/billing`,
        icon: CreditCard,
      },
      {
        key: "messages",
        label: "Messages",
        href: `/user/${clientID}/messages`,
        icon: MessagesSquare,
      },
    ],
    [clientID],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-3 border-b border-slate-200 px-4">
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
              {(user?.name?.trim() || clientID).charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user?.name?.trim() || "Account"}
          </p>
          <p className="truncate text-xs text-slate-500">
            {user?.email || clientID}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="User navigation">
        {nav.map((n) => {
          const isActive = pathname === n.href;
          const Icon = n.icon;

          return (
            <Link
              key={n.key}
              href={n.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                isActive && "bg-teal-50 text-teal-800 hover:bg-teal-50",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 text-slate-500 transition-colors",
                  isActive && "text-teal-700",
                )}
              />
              <span className="truncate">{n.label}</span>
              {isActive ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-600" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">Tip</p>
          <p className="mt-1 text-xs text-slate-600">
            Keep your profile updated to get better matches.
          </p>
          <Link
            href={`/user/${clientID}/profile`}
            onClick={onNavigate}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Update profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ clientID, user, open, onOpenChange }: Props) {
  const pathname = usePathname();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = isControlled ? (open as boolean) : internalOpen;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (!isControlled) setInternalOpen(next);
  };

  useEffect(() => {
    if (!pathname) return;
    onOpenChange?.(false);
    if (!isControlled) setInternalOpen(false);
  }, [pathname, isControlled, onOpenChange]);

  return (
    <>
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white md:flex">
        <SidebarInner clientID={clientID} user={user} />
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/30"
          />

          <div
            className="absolute left-0 top-0 flex h-full w-[18rem] flex-col bg-white shadow-2xl"
            role="dialog"
            aria-label="Navigation panel"
          >
            <div className="flex h-14 items-center justify-end border-b border-slate-200 px-2">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarInner
              clientID={clientID}
              user={user}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

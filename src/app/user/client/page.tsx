import {
  BadgeCheck,
  CircleOff,
  CreditCard,
  MapPin,
  MessagesSquare,
  Star,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { unwrapParams } from "./lib/unwrapParams";
import { getUserRecord } from "./lib/user";

export default async function UserHome({
  params,
}: {
  params: { clientID: string } | Promise<{ clientID: string }>;
}) {
  const { clientID } = unwrapParams(params);
  const { user, error } = await getUserRecord(clientID);

  if (!user) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Overview</h1>
          <p className="mt-1 text-sm text-slate-600">
            {error || "Unable to load this account."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/user/${clientID}/profile`}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Go to profile
            </Link>
            <Link
              href={`/user/${clientID}/billing`}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
            >
              Billing
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const joined =
    user.createdAt && !Number.isNaN(Date.parse(user.createdAt))
      ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
          new Date(user.createdAt),
        )
      : "—";

  return (
    <section className="space-y-6">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {user.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-900">{user.email}</span>
              {user.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {user.location}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user.isActive === true ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <BadgeCheck className="h-4 w-4" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <CircleOff className="h-4 w-4" />
                Inactive
              </span>
            )}
            {user.isEmailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <BadgeCheck className="h-4 w-4" />
                Email verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <CircleOff className="h-4 w-4" />
                Email unverified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Rating</p>
          <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Star className="h-5 w-5 text-amber-500" />
            {typeof user.rating === "number" ? user.rating.toFixed(1) : "—"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Based on recent reviews.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Skills</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {user.skills?.length || 0}
          </p>
          <p className="mt-1 text-sm text-slate-600">Listed on your profile.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Member since</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{joined}</p>
          <p className="mt-1 text-sm text-slate-600">
            Role:{" "}
            <span className="font-medium text-slate-900">
              {user.role || "—"}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">About</h2>
          <p className="mt-1 text-sm text-slate-600">
            {user.bio?.trim() || "No bio yet."}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Mobile</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {user.mobile || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">WhatsApp</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {user.whatsapp || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Quick actions
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Keep your profile complete and up to date.
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href={`/user/${clientID}/profile`}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">Edit profile</p>
                <p className="mt-0.5 text-sm text-slate-600">
                  Update bio, location, and contact details.
                </p>
              </div>
              <UserRound className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
            </Link>

            <Link
              href={`/user/${clientID}/billing`}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">Billing</p>
                <p className="mt-0.5 text-sm text-slate-600">
                  View your plan and payment method.
                </p>
              </div>
              <CreditCard className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
            </Link>

            <Link
              href={`/user/${clientID}/messages`}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">Messages</p>
                <p className="mt-0.5 text-sm text-slate-600">
                  Check your inbox and replies.
                </p>
              </div>
              <MessagesSquare className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Skills</h2>
        <p className="mt-1 text-sm text-slate-600">
          Skills currently attached to this profile.
        </p>

        {user.skills?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {user.skills.map((s) => (
              <span
                key={s._id}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800"
              >
                {s.name}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-900">
              No skills added yet
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Add skills to help others understand what you do.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

import { Inbox, Search } from "lucide-react";
import { unwrapParams } from "../lib/unwrapParams";
import { getUserRecord } from "../lib/user";

export default async function MessagesPage({
  params,
}: {
  params: { clientID: string } | Promise<{ clientID: string }>;
}) {
  const { clientID } = unwrapParams(params);
  const { user, error } = await getUserRecord(clientID);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Messages
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Inbox for{" "}
          <span className="font-medium text-slate-900">
            {user?.name || clientID}
          </span>
          .
        </p>
        {error ? (
          <p className="mt-2 text-sm text-amber-700">
            Unable to load user details:{" "}
            <span className="font-medium">{error}</span>
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search messages (coming soon)"
              disabled
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            disabled
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-600"
          >
            New message
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Inbox className="h-6 w-6 text-slate-500" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-900">
            Your inbox is empty
          </p>
          <p className="mt-1 text-sm text-slate-600">
            When you receive messages, they’ll show up here.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Camera, RotateCcw, Save } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { UserRecord } from "../lib/user-types";

type Props = {
  clientID: string;
  user?: UserRecord | null;
  error?: string | null;
};

export default function ProfileClient({ clientID, user, error }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [localImage, setLocalImage] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const displayName = useMemo(() => {
    return name.trim() || user?.name?.trim() || clientID;
  }, [name, user?.name, clientID]);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setCompany(user.company || "");
    setMobile(user.mobile || "");
    setWhatsapp(user.whatsapp || "");
    setCountry(user.country || "");
    setState(user.state || "");
    setCity(user.city || "");
    setBio(user.bio || "");
  }, [user]);

  useEffect(() => {
    return () => {
      if (localImage) URL.revokeObjectURL(localImage);
    };
  }, [localImage]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function resetToUser() {
    setStatus(null);
    setLocalImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");
    setCompany(user.company || "");
    setMobile(user.mobile || "");
    setWhatsapp(user.whatsapp || "");
    setCountry(user.country || "");
    setState(user.state || "");
    setCity(user.city || "");
    setBio(user.bio || "");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch(`/api/users/${clientID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          mobile,
          whatsapp,
          country,
          state,
          city,
          bio,
        }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus(
          (payload && (payload.error || payload.message)) ||
            "Failed to save profile",
        );
        return;
      }

      setStatus("Saved");
    } catch {
      setStatus("Network error while saving");
    } finally {
      setSaving(false);
    }
  }

  const imageSrc = localImage || user?.profileImage || null;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage personal details for{" "}
          <span className="font-medium text-slate-900">{displayName}</span>.
        </p>
        {error ? (
          <p className="mt-2 text-sm text-amber-700">
            Unable to load user details:{" "}
            <span className="font-medium">{error}</span>
          </p>
        ) : null}
      </div>

      <form onSubmit={save} className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Public profile
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            This information may be shown on your profile page.
          </p>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Avatar"
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xl font-semibold text-teal-700">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/25 to-transparent p-2 text-[11px] font-medium text-white">
                Photo
              </div>
            </div>

            <div className="flex-1">
              <label
                htmlFor="profilePhoto"
                className="block text-sm font-medium text-slate-900"
              >
                Upload photo
              </label>
              <p className="mt-1 text-sm text-slate-600">
                JPG/PNG up to a few MB is best.
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={onFile}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                />
                <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <Camera className="h-4 w-4" /> Optional
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Details</h2>
          <p className="mt-1 text-sm text-slate-600">
            Keep this accurate for account and billing communication.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-900"
              >
                Full name
              </label>
              <input
                id="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-900"
              >
                Email
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-slate-900"
              >
                Mobile
              </label>
              <input
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+234..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium text-slate-900"
              >
                WhatsApp
              </label>
              <input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+234..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-medium text-slate-900"
              >
                Company
              </label>
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-slate-900"
              >
                Country
              </label>
              <input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-slate-900"
              >
                State
              </label>
              <input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-slate-900"
              >
                City
              </label>
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-slate-900"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
              <p className="mt-2 text-xs text-slate-500">
                Keep it short — highlight what you do and who you help.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving || !user}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/15"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              onClick={resetToUser}
              disabled={!user}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/15"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            {status ? (
              <p className="text-sm text-slate-600 sm:ml-auto">{status}</p>
            ) : null}
          </div>
        </div>
      </form>
    </section>
  );
}

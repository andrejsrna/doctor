"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPaperPlane, FaVial } from "react-icons/fa";

type Preview = {
  month: string;
  label: string;
  releases: { slug: string; artist: string | null; title: string; type: string; date: string }[];
  mixes: { slug: string; title: string; date: string }[];
  defaults: { subject: string; intro: string; preheader: string };
  audience: number;
  alreadySent: { sentAt: string; sentCount: number } | null;
};

/** Last 12 months, newest first; the previous month is preselected (send on the 1st). */
function monthOptions() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    return {
      key: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }) + (i === 0 ? " (in progress)" : ""),
    };
  });
}

const input = "w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500";

export default function MonthlyNewsletterPage() {
  const months = useMemo(monthOptions, []);
  const [month, setMonth] = useState(months[1].key);
  const [data, setData] = useState<Preview | null>(null);
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [intro, setIntro] = useState("");
  const [featured, setFeatured] = useState("");
  const [testEmails, setTestEmails] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState<"test" | "all" | null>(null);
  const [frameKey, setFrameKey] = useState(0);

  const load = useCallback(async (m: string) => {
    setData(null);
    const res = await fetch(`/api/admin/newsletter/monthly?month=${m}`, { cache: "no-store" });
    if (!res.ok) return toast.error("Failed to load the month");
    const json: Preview = await res.json();
    setData(json);
    setSubject(json.defaults.subject);
    setPreheader(json.defaults.preheader);
    setIntro(json.defaults.intro);
    setFeatured(json.releases[0]?.slug || "");
    setConfirm("");
  }, []);

  useEffect(() => {
    load(month);
  }, [month, load]);

  const previewSrc = useMemo(() => {
    const q = new URLSearchParams({ month, format: "html", intro, preheader, featured });
    return `/api/admin/newsletter/monthly?${q.toString()}`;
    // frameKey re-renders the preview on demand instead of on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, frameKey, featured]);

  const send = async (mode: "test" | "all") => {
    if (mode === "all" && !window.confirm(`Send "${subject}" to ${data?.audience} active subscribers?`)) return;
    setBusy(mode);
    try {
      const res = await fetch("/api/admin/newsletter/monthly", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          month, subject, intro, preheader, featuredSlug: featured, mode, confirm,
          testEmails: testEmails.split(/[\s,;]+/).filter(Boolean),
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || (json.failed || []).join("\n") || "Send failed");
      if (mode === "test") toast.success(`Test sent to ${json.sent} address${json.sent === 1 ? "" : "es"}`);
      else {
        toast.success(`Sending to ${json.queued} subscribers…`);
        load(month);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Send failed");
    } finally {
      setBusy(null);
    }
  };

  const empty = data && data.releases.length === 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <a href="/admin/newsletter" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-2">
            <FaArrowLeft className="h-3 w-3" /> Newsletter
          </a>
          <h1 className="text-2xl font-bold text-white">Monthly releases newsletter</h1>
          <p className="text-sm text-gray-400">Releases and DJ mixes published in the chosen month go in automatically. Edit the copy, send a test, then send to everyone.</p>
        </div>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${input} w-auto`}>
          {months.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-5">
          {!data ? <p className="text-gray-400">Loading…</p> : (
            <>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300">
                <p><b className="text-white">{data.releases.length}</b> releases · <b className="text-white">{data.mixes.length}</b> mixes in {data.label}</p>
                <p><b className="text-white">{data.audience}</b> active subscribers</p>
                {data.alreadySent && <p className="mt-2 text-amber-300">Already sent on {data.alreadySent.sentAt.slice(0, 10)} ({data.alreadySent.sentCount} delivered).</p>}
                {empty && <p className="mt-2 text-amber-300">Nothing was released this month — pick another month.</p>}
              </div>

              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wider text-gray-400">Subject</span>
                <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} />
              </label>
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wider text-gray-400">Inbox preview text</span>
                <input className={input} value={preheader} onChange={(e) => setPreheader(e.target.value)} />
              </label>
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wider text-gray-400">Featured release</span>
                <select className={input} value={featured} onChange={(e) => setFeatured(e.target.value)}>
                  {data.releases.map((r) => <option key={r.slug} value={r.slug}>{r.artist ? `${r.artist} – ` : ""}{r.title} ({r.type})</option>)}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wider text-gray-400">Intro — {"{name}"} becomes the subscriber&apos;s name, blank line = new paragraph</span>
                <textarea className={`${input} min-h-[140px]`} value={intro} onChange={(e) => setIntro(e.target.value)} />
              </label>
              <button onClick={() => setFrameKey((k) => k + 1)} className="text-sm text-purple-300 hover:text-white">↻ Refresh preview</button>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
                <p className="text-sm font-semibold text-white">1. Send a test</p>
                <input className={input} placeholder="you@example.com, colleague@example.com" value={testEmails} onChange={(e) => setTestEmails(e.target.value)} />
                <button disabled={!!busy || !!empty} onClick={() => send("test")} className="flex items-center gap-2 rounded-lg bg-blue-900/50 px-4 py-2 text-sm text-blue-200 hover:bg-blue-900/70 disabled:opacity-40">
                  <FaVial className="h-3 w-3" /> {busy === "test" ? "Sending…" : "Send test"}
                </button>
              </div>

              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 space-y-3">
                <p className="text-sm font-semibold text-white">2. Send to all {data.audience} active subscribers</p>
                <input className={input} placeholder={`Type ${data.month} to confirm`} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                <button disabled={!!busy || !!empty || confirm !== data.month || !!data.alreadySent} onClick={() => send("all")} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40">
                  <FaPaperPlane className="h-3 w-3" /> {busy === "all" ? "Queuing…" : "Send newsletter"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden bg-black">
          <iframe key={previewSrc} src={previewSrc} title="Newsletter preview" className="w-full h-[1400px] bg-black" />
        </div>
      </div>
    </div>
  );
}

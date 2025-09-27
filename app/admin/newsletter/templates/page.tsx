import Link from "next/link";
import { NEWSLETTER_TEMPLATE_OPTIONS } from "../../../components/admin/newsletter/constants/templates";
import type { ReactNode } from "react";

const SAMPLE_MERGE_FIELDS: Record<string, string> = {
  name: "Jade",
  email: "jade@dnbdoctor.com",
  artist: "The Upbeats",
  track: "Laser Vision",
  category: "VIP Subscribers",
};

function renderTemplateBody(body: string): ReactNode {
  const replaced = Object.entries(SAMPLE_MERGE_FIELDS).reduce((acc, [key, value]) => {
    const pattern = new RegExp(`{${key}}`, "gi");
    return acc.replace(pattern, value);
  }, body);

  const trimmed = replaced.trim();
  const containsHtml = /<[^>]+>/.test(trimmed);

  if (containsHtml) {
    return (
      <div
        className="newsletter-html-preview space-y-3 text-sm text-gray-200 [&_a]:text-purple-200 [&_a]:hover:text-green-300 [&_p]:m-0"
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }

  return trimmed.split("\n").map((line, index) => (
    <p key={`line-${index}`} className="text-sm text-gray-200">
      {line || <span className="opacity-60">&nbsp;</span>}
    </p>
  ));
}

export default function NewsletterTemplatesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Newsletter Templates</h1>
          <p className="text-sm text-gray-400">
            Preview the built-in templates and see how merge fields render for subscribers.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/newsletter"
            className="rounded-lg bg-gray-900/60 px-4 py-2 text-gray-300 transition hover:bg-gray-900/80"
          >
            Back to newsletter
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {NEWSLETTER_TEMPLATE_OPTIONS.map((template) => (
          <article
            key={template.id}
            className="flex flex-col gap-4 rounded-2xl border border-purple-500/30 bg-black/70 p-5 shadow-xl"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">{template.name}</h2>
              <p className="text-sm text-gray-400">{template.description}</p>
            </div>

            <div className="space-y-1 rounded-lg border border-purple-500/20 bg-black/60 p-4 text-sm text-gray-200">
              <p className="font-medium text-purple-200">Subject</p>
              <div className="space-y-1">{renderTemplateBody(template.subject)}</div>
              <p className="pt-3 text-xs uppercase tracking-wide text-gray-500">Preview line</p>
              <div className="space-y-1">{renderTemplateBody(template.preview)}</div>
            </div>

            <div className="grow space-y-3 rounded-lg border border-green-500/20 bg-black/50 p-4">
              <p className="text-xs uppercase tracking-wide text-green-300">Email body</p>
              <div className="space-y-2 leading-relaxed">
                {renderTemplateBody(template.body)}
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Merge fields supported: <code>{"{name}"}</code>, <code>{"{email}"}</code>, <code>{"{artist}"}</code>, <code>{"{track}"}</code>, <code>{"{category}"}</code>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

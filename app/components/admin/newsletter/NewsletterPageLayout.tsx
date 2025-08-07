"use client";

interface NewsletterPageLayoutProps {
  children: React.ReactNode;
}

export default function NewsletterPageLayout({ children }: NewsletterPageLayoutProps) {
  return (
    <div className="space-y-8">
      {children}
    </div>
  );
}

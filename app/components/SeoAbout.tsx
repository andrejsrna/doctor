import type { ReactNode } from 'react'
import styles from './seoAbout.module.css'

export type FaqItem = { question: string; answer: string }

export const faqLd = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
})

/** Server-rendered "about this list" block (intro prose + FAQ) for catalogue pages like /music and /artists. */
export default function SeoAbout({ id, title, children, faq }: { id: string; title: ReactNode; children: ReactNode; faq: FaqItem[] }) {
  return (
    <section className={styles.about} aria-labelledby={id}>
      <div className={styles.prose}>
        <h2 id={id} className={styles.h2}>
          {title}
        </h2>
        {children}
      </div>
      <div className={styles.faq}>
        <p className={styles.label}>FAQ</p>
        {faq.map((f, i) => (
          <details key={f.question} open={i === 0}>
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

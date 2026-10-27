'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <section className="py-32 px-4 relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-purple max-w-none"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-12 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-center">
            Terms & Conditions
          </h1>

          <div className="space-y-8">
            <section>
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing and using DnB Doctor&apos;s website and services, you agree to be bound by these 
                Terms and Conditions. If you disagree with any part of these terms, you may not access 
                our services.
              </p>
            </section>

            <section>
              <h2>2. Intellectual Property</h2>
              <p>
                All content published and made available on our site is the property of DnB Doctor and 
                our licensors. This includes, but is not limited to:
              </p>
              <ul>
                <li>Musical compositions</li>
                <li>Sound recordings</li>
                <li>Images and graphics</li>
                <li>Website design</li>
                <li>Logos and trademarks</li>
              </ul>
            </section>

            <section>
              <h2>3. Demo Submissions</h2>
              <p>
                When submitting demos to DnB Doctor, you agree that:
              </p>
              <ul>
                <li>You own or have the rights to all submitted material</li>
                <li>The material is original and unreleased</li>
                <li>You grant us the right to review and evaluate your submission</li>
                <li>We are not obligated to provide feedback or accept any submission</li>
                <li>We will maintain the confidentiality of your submission</li>
              </ul>
            </section>

            <section>
              <h2>4. User Responsibilities</h2>
              <p>
                When using our services, you agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not violate any applicable laws or regulations</li>
                <li>Not infringe on intellectual property rights</li>
                <li>Not distribute malicious code or content</li>
              </ul>
            </section>

            <section>
              <h2>5. Newsletter and Communications</h2>
              <p>
                By subscribing to our newsletter, you agree to receive periodic emails from us. You can 
                unsubscribe at any time. We will handle your information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2>6. Shop &amp; Merch Orders</h2>
              <p>
                From time to time we offer physical products (merch) through our website. These items are typically
                produced and fulfilled via a print-on-demand partner after purchase.
              </p>
              <ul>
                <li>
                  <strong>Production:</strong> production starts after your order is placed and paid. Production and shipping
                  times vary by product and destination.
                </li>
                <li>
                  <strong>Shipping:</strong> we ship to the address provided at checkout. Please double-check your details
                  before completing payment.
                </li>
                <li>
                  <strong>Returns &amp; issues:</strong> because items are made to order, we may not accept returns for
                  change-of-mind or incorrect sizing. If your item arrives damaged, defective, or incorrect, contact us and
                  we’ll work with you on a replacement or refund where applicable.
                </li>
                <li>
                  <strong>Cancellations:</strong> if production has not started yet, we may be able to cancel or adjust the
                  order. Once production begins, changes may not be possible.
                </li>
                <li>
                  <strong>Payments:</strong> payments are processed securely by Stripe. We do not store full card details on
                  our servers.
                </li>
              </ul>
              <p>
                For order-related help, contact us via the{' '}
                <a href="/contact" className="text-purple-500 hover:text-purple-400">
                  contact page
                </a>
                .
              </p>
            </section>

            <section id="digital-products" className="scroll-mt-32">
              <h2>6a. Digital Products (Sample Packs &amp; Tracks)</h2>
              <p>
                Digital products on this website are sold by <strong>Andrej Srna</strong>, Sokolská 11, 811 04 Bratislava,
                Slovakia, as a private individual (contact:{' '}
                <a href="mailto:dnbdoctor1@gmail.com" className="text-purple-500 hover:text-purple-400">dnbdoctor1@gmail.com</a>).
                The seller is not a VAT payer; prices shown are final.
              </p>
              <ul>
                <li>
                  <strong>Payment &amp; delivery:</strong> payment is made by card through Stripe. After a successful payment you
                  receive a download link by email; your purchases also stay available in{' '}
                  <a href="/account" className="text-purple-500 hover:text-purple-400">My account</a> (sign in with the email
                  used at checkout). A sales receipt (invoice) is issued and emailed automatically.
                </li>
                <li>
                  <strong>Right of withdrawal:</strong> before payment you expressly agree that delivery of the digital content
                  starts immediately and acknowledge that you thereby lose the 14-day right of withdrawal once the download is
                  made available.
                </li>
                <li>
                  <strong>Sample licence:</strong> sounds from our sample packs are licensed to you royalty-free for use in your
                  own music productions, including commercially released tracks, remixes, DJ sets and video soundtracks. You may
                  not resell, share, upload or redistribute the samples on their own or as part of another sample pack, library,
                  preset bank or similar product. The licence is personal and non-transferable.
                </li>
                <li>
                  <strong>Tracks:</strong> purchased tracks are for personal listening and DJ use. Any other use requires a separate
                  licence.
                </li>
                <li>
                  <strong>Problems with your download:</strong> if a file is damaged, incomplete or does not match its description,
                  email{' '}
                  <a href="mailto:dnbdoctor1@gmail.com" className="text-purple-500 hover:text-purple-400">dnbdoctor1@gmail.com</a>{' '}
                  with your order number. We will fix it, provide a replacement or refund you.
                </li>
              </ul>
            </section>

            <section>
              <h2>7. Content Usage</h2>
              <p>
                You may not use our content for any commercial purpose without obtaining a license from us. 
                This includes, but is not limited to:
              </p>
              <ul>
                <li>Reproduction of music</li>
                <li>Distribution of content</li>
                <li>Public performance</li>
                <li>Creation of derivative works</li>
              </ul>
            </section>

            <section>
              <h2>8. Limitation of Liability</h2>
              <p>
                DnB Doctor shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages resulting from your use or inability to use our services.
              </p>
            </section>

            <section>
              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes by posting the new terms on this site.
              </p>
            </section>

            <section>
              <h2>10. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the European Union, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2>11. Contact Information</h2>
              <p>
                For any questions about these Terms & Conditions, please contact us at:{' '}
                <a href="mailto:legal@dnbdoctor.com" className="text-purple-500 hover:text-purple-400">
                  legal@dnbdoctor.com
                </a>
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-400 text-center mt-12">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 

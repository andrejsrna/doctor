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
              <h2>6. Content Usage</h2>
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
              <h2>7. Limitation of Liability</h2>
              <p>
                DnB Doctor shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages resulting from your use or inability to use our services.
              </p>
            </section>

            <section>
              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes by posting the new terms on this site.
              </p>
            </section>

            <section>
              <h2>9. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the European Union, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2>10. Contact Information</h2>
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
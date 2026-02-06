'use client'

import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
  return (
    <section className="py-32 px-4 relative min-h-screen overflow-hidden">
      {/* Background Image */}
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
            Privacy Policy
          </h1>

          <div className="space-y-8">
            <section>
              <h2>Introduction</h2>
              <p>
                At DnB Doctor, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, and protect your personal information when you use our website and services.
              </p>
            </section>

            <section>
              <h2>Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul>
                <li>Email addresses for newsletter subscriptions</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2>How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Send you our newsletter and updates about new releases</li>
                <li>Improve our website and services</li>
                <li>Communicate with you about your account</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2>Newsletter Subscription</h2>
              <p>
                When you subscribe to our newsletter, we collect your email address to send you updates 
                about new releases, exclusive content, and special announcements. You can unsubscribe 
                at any time using the unsubscribe link in our emails or through our website.
              </p>
            </section>

            <section>
              <h2>Data Protection</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2>Third-Party Services</h2>
              <p>
                We use trusted third-party services for:
              </p>
              <ul>
                <li>Email newsletter management</li>
                <li>Website analytics</li>
                <li>Payment processing</li>
              </ul>
              <p>
                These services may collect and process your data according to their own privacy policies.
              </p>
            </section>

            <section>
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Withdraw your consent at any time</li>
                <li>Object to processing of your information</li>
              </ul>
            </section>

            <section>
              <h2>Cookies</h2>
              <p>
                We use cookies and similar technologies for essential functionality, analytics, and marketing (e.g., measuring performance and showing relevant ads). 
                You can manage your preferences anytime via the &quot;Cookie Settings&quot; link in the footer, or through your browser preferences.
              </p>
            </section>

            <section>
              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the effective date.
              </p>
            </section>

            <section>
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <a href="mailto:privacy@dnbdoctor.com" className="text-purple-500 hover:text-purple-400">
                  privacy@dnbdoctor.com
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

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown, FaMusic, FaHeadphones, FaQuestion, FaDownload, FaBoxOpen, FaCog } from 'react-icons/fa'

interface FAQItem {
  question: string
  answer: string
  icon: React.ElementType
}

const faqData: FAQItem[] = [
  {
    question: "What's included in your neurofunk sample packs?",
    answer: "Our neurofunk sample packs include rolling basslines, complex drum loops, atmospheric pads, industrial textures, and one-shot samples. Each pack features high-quality, professionally produced sounds designed specifically for neurofunk drum and bass production.",
    icon: FaBoxOpen
  },
  {
    question: "What file formats are the samples available in?",
    answer: "All samples are provided in WAV format at 44.1kHz/24-bit for maximum quality. Drum loops are also included as individual hits, and bass samples come with both processed and raw versions for maximum flexibility in your productions.",
    icon: FaDownload
  },
  {
    question: "Are the samples royalty-free for commercial use?",
    answer: "Yes, all our neurofunk samples are 100% royalty-free and cleared for commercial use. You can use them in your tracks, releases, and commercial projects without any additional licensing fees or restrictions.",
    icon: FaQuestion
  },
  {
    question: "How do I integrate these samples into my DAW?",
    answer: "Simply drag and drop the WAV files into your DAW's browser or sampler. For drum loops, you can slice them to MIDI for easy manipulation. Bass samples work great in samplers like Kontakt, or you can use them directly in your tracks.",
    icon: FaCog
  },
  {
    question: "What BPM are the drum loops designed for?",
    answer: "Our neurofunk drum loops are typically designed for 170-175 BPM, which is the standard tempo for drum and bass. However, they can be easily time-stretched to fit other tempos in your DAW without losing quality.",
    icon: FaMusic
  },
  {
    question: "Do you offer custom sample pack requests?",
    answer: "Yes, we do offer custom sample pack creation for established producers and labels. Contact us with your specific requirements, and we can create tailored neurofunk samples to match your unique sound and production style.",
    icon: FaQuestion
  },
  {
    question: "How often do you release new sample packs?",
    answer: "We release new neurofunk sample packs monthly, featuring fresh sounds and innovative production techniques. Subscribe to our newsletter to get notified about new releases and exclusive previews.",
    icon: FaBoxOpen
  },
  {
    question: "Can I use these samples in other genres besides neurofunk?",
    answer: "Absolutely! While designed for neurofunk, our samples work great in other drum and bass subgenres, dubstep, and even experimental electronic music. The rolling basslines and complex drums can add unique character to any production.",
    icon: FaMusic
  },
  {
    question: "What makes your neurofunk samples different from others?",
    answer: "Our samples are crafted by professional neurofunk producers who understand the genre's technical requirements. We focus on authentic rolling basslines, precise drum programming, and dark atmospheric elements that capture the true essence of neurofunk.",
    icon: FaHeadphones
  },
  {
    question: "Do you provide tutorials on how to use the samples?",
    answer: "Yes, we offer video tutorials and production guides showing how to effectively use our neurofunk samples. These cover techniques like layering, processing, and creating the signature rolling basslines that define the genre.",
    icon: FaCog
  },
  {
    question: "Are there any restrictions on sample usage?",
    answer: "No restrictions! You can use our samples in unlimited projects, commercial releases, and even resell them as part of your own sample packs. The only restriction is that you cannot redistribute our samples as-is.",
    icon: FaDownload
  },
  {
    question: "How do I get the best results from your neurofunk samples?",
    answer: "For optimal results, layer multiple bass samples to create depth, use sidechain compression to create space, and experiment with different processing chains. Our samples are designed to work together, so try combining elements from different packs.",
    icon: FaHeadphones
  },
  {
    question: "Do you offer bundle deals on multiple sample packs?",
    answer: "Yes, we offer discounted bundles when you purchase multiple neurofunk sample packs together. These bundles are perfect for producers building their sound library and often include exclusive bonus content not available individually.",
    icon: FaBoxOpen
  },
  {
    question: "What's your return policy for sample packs?",
    answer: "Due to the digital nature of our products, we don't offer refunds on sample packs. However, we provide detailed previews and demos so you can hear exactly what you're getting before purchase. If you have any issues, we're happy to help troubleshoot.",
    icon: FaQuestion
  },
  {
    question: "How do I stay updated with new sample pack releases?",
    answer: "Follow our social media channels, subscribe to our newsletter, and check our sample packs page regularly. We also send exclusive previews to subscribers and offer early access to new releases for our community members.",
    icon: FaMusic
  }
]

export default function SamplePacksFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sample Pack <span className="text-purple-500">FAQ</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about our neurofunk sample packs
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/50 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/40 transition-colors duration-300"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between group"
                whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span className="text-white font-medium group-hover:text-purple-300 transition-colors">
                    {item.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-purple-400 group-hover:text-purple-300 transition-colors"
                >
                  <FaChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <div className="border-t border-purple-500/20 pt-4">
                        <p className="text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            Still have questions about our sample packs? We&apos;re here to help!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
            >
              <FaQuestion className="w-4 h-4" />
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 
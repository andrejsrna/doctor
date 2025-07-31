'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown, FaMusic, FaHeadphones, FaQuestion } from 'react-icons/fa'

interface FAQItem {
  question: string
  answer: string
  icon: React.ElementType
}

const faqData: FAQItem[] = [
  {
    question: "What is Neurofunk Drum & Bass?",
    answer: "Neurofunk is a subgenre of drum and bass that emerged in the late 1990s. It's characterized by its dark, technical sound with complex drum patterns, rolling basslines, and atmospheric elements. The genre combines the energy of drum and bass with futuristic, sci-fi inspired soundscapes.",
    icon: FaMusic
  },
  {
    question: "How is Neurofunk different from other DnB styles?",
    answer: "Neurofunk distinguishes itself through its emphasis on technical precision, dark atmospheres, and complex sound design. Unlike jump-up or liquid DnB, neurofunk focuses on rolling basslines, intricate drum programming, and industrial/mechanical sound elements that create a more cerebral listening experience.",
    icon: FaHeadphones
  },
  {
    question: "What BPM is typical for Neurofunk?",
    answer: "Neurofunk typically operates at 170-175 BPM, which is the standard tempo for drum and bass. However, what sets neurofunk apart is not the tempo but the complex rhythmic patterns and the way the drums and bass interact to create rolling, hypnotic grooves.",
    icon: FaMusic
  },
  {
    question: "Can I submit my Neurofunk tracks to DnB Doctor?",
    answer: "Absolutely! We're always looking for fresh neurofunk talent. You can submit your tracks through our demo submission page. We're particularly interested in tracks that push the boundaries of the genre while maintaining the dark, technical aesthetic that defines neurofunk.",
    icon: FaQuestion
  },
  {
    question: "What equipment do I need to produce Neurofunk?",
    answer: "You'll need a DAW (Digital Audio Workstation), quality headphones or monitors, and software synthesizers. Key elements include a good drum machine or sampler, bass synthesizers, and effects like reverb, delay, and distortion. Many producers use Serum, Massive, or FM8 for bass sounds.",
    icon: FaHeadphones
  },
  {
    question: "How can I stay updated with the latest Neurofunk releases?",
    answer: "Follow our social media channels, subscribe to our newsletter, and check our latest releases page regularly. We also curate playlists on Spotify and YouTube featuring the best neurofunk tracks from our roster and the wider scene.",
    icon: FaMusic
  },
  {
    question: "Who are the pioneers of Neurofunk?",
    answer: "Neurofunk was pioneered by artists like Ed Rush & Optical, Matrix, and Dom & Roland in the late 1990s. These producers introduced the dark, technical approach that would define the genre. Other key figures include Noisia, Phace, and Mefjus who have pushed the boundaries further.",
    icon: FaMusic
  },
  {
    question: "What makes a good Neurofunk track?",
    answer: "A great neurofunk track combines technical precision with dark atmosphere. Key elements include rolling, complex drum patterns, deep, modulated basslines, atmospheric pads, and industrial sound design. The track should have a hypnotic, rolling quality that keeps listeners engaged.",
    icon: FaHeadphones
  },
  {
    question: "How do I mix Neurofunk properly?",
    answer: "Neurofunk mixing requires attention to detail. Focus on tight, punchy drums with clear separation between kick and snare. The bass should be deep and rolling without overwhelming the mix. Use sidechain compression to create space, and ensure atmospheric elements don't clash with the rhythm section.",
    icon: FaMusic
  },
  {
    question: "What are the best plugins for Neurofunk production?",
    answer: "Essential plugins include Serum or Massive for bass synthesis, Kontakt for drum programming, and effects like Valhalla Room for reverb, FabFilter Pro-Q for EQ, and OTT for multiband compression. Many producers also use FM8 for metallic bass sounds and Trash 2 for distortion.",
    icon: FaHeadphones
  },
  {
    question: "How do I create rolling basslines?",
    answer: "Rolling basslines are created through careful modulation and automation. Start with a simple bass sound, then add LFO modulation to the filter cutoff and pitch. Use automation to create movement, and layer multiple bass sounds for depth. The key is maintaining the rolling, hypnotic quality.",
    icon: FaMusic
  },
  {
    question: "What's the difference between Neurofunk and Techstep?",
    answer: "While both are dark, technical subgenres of drum and bass, Techstep emerged earlier and is more industrial and mechanical. Neurofunk evolved from Techstep but incorporates more atmospheric elements, complex sound design, and rolling basslines. Neurofunk is generally more musical and less harsh.",
    icon: FaHeadphones
  },
  {
    question: "How do I get my Neurofunk tracks signed?",
    answer: "Focus on production quality and unique sound design. Research labels that release neurofunk, follow their submission guidelines, and ensure your tracks match their style. Build relationships in the scene, attend events, and network with other producers. Quality and persistence are key.",
    icon: FaQuestion
  },
  {
    question: "What are the current trends in Neurofunk?",
    answer: "Modern neurofunk incorporates elements from other electronic genres, with producers experimenting with halftime sections, trap influences, and more melodic elements. There's also a trend toward more complex sound design and atmospheric elements while maintaining the dark, technical aesthetic.",
    icon: FaMusic
  },
  {
    question: "How do I master Neurofunk tracks?",
    answer: "Neurofunk mastering requires careful attention to dynamics and frequency balance. Use multiband compression to control the low end, ensure the kick and bass don't clash, and maintain headroom for the club. Reference tracks from established neurofunk labels to match the genre's standards.",
    icon: FaHeadphones
  }
]

export default function FAQ() {
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
            Frequently Asked <span className="text-purple-500">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about neurofunk drum and bass
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
            Still have questions? We're here to help!
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
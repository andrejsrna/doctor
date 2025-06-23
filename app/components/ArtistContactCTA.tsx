'use client'

import { motion } from 'framer-motion'
import { FaEnvelope, FaArrowRight, FaUserMd, FaPaperPlane } from 'react-icons/fa'
import Button from './Button'

interface ArtistContactCTAProps {
  artistName: string
}

export default function ArtistContactCTA({ artistName }: ArtistContactCTAProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          
          {/* Content */}
          <div className="relative p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full 
              bg-purple-500/20 mb-6">
              <FaEnvelope className="w-8 h-8 text-purple-500" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
              Interested in Working with {artistName}?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get in touch with us to discuss collaboration opportunities, booking inquiries, 
              or any questions you might have.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full sm:w-auto"
              >
                <Button
                  href="/contact"
                  variant="infected"
                  size="lg"
                  className="w-full sm:w-auto group"
                >
                  <FaUserMd className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
                  <span>Contact Us</span>
                  <FaArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full sm:w-auto"
              >
                <a 
                  href={`mailto:booking@dnbdoctor.com?subject=Inquiry about ${encodeURIComponent(artistName)}`}
                  className="block"
                >
                  <Button
                    variant="decayed"
                    size="lg"
                    className="w-full sm:w-auto group"
                  >
                    <FaPaperPlane className="w-5 h-5 mr-2 transform group-hover:rotate-45 group-hover:translate-x-1 transition-all duration-300" />
                    <span>Send Email</span>
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
} 
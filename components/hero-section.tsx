"use client"

import { ShinyButton } from "@/components/ui/shiny-button"
import { ArrowRight, Smartphone, Globe, HeartHandshake } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 overflow-hidden bg-white">
      {/* Grid Background with Alpha Mask */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(59 130 246 / 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(59 130 246 / 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Mission & Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 font-display leading-tight">
              Education shouldn't depend on internet bars.
            </h1>
            <p className="text-xl sm:text-2xl text-blue-400 font-medium mb-4">
              Capture attendance anywhere and turn it into real pathways for student growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <ShinyButton className="text-base px-8 py-6 text-lg font-medium">
              Download App for Teachers
              <ArrowRight className="ml-2 h-5 w-5" />
            </ShinyButton>
            <ShinyButton variant="secondary" className="text-base px-8 py-6 text-lg font-medium">
              <HeartHandshake className="mr-2 h-5 w-5" />
              Support the Mission
            </ShinyButton>
          </div>
        </motion.div>

        {/* Right Column - Real App Mockup (Teacher Marking Attendance) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 overflow-hidden">
          </div>
        </motion.div>
      </div>
    </section>
  )
}
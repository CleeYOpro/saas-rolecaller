"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

const videos = [
  { id: "5nCz1Ro6bnM", label: "Demo 1" },
  { id: "kpJLKlCN-EY", label: "Demo 2" },
  { id: "J3b_9kQrWJg", label: "Demo 3" },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-balance font-display">
            See How It Works
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            A quick, real look at RoleCaller in action. No signal required.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-full max-w-[300px] bg-gradient-to-br from-gray-900 to-gray-950 rounded-[2rem] p-2.5 shadow-2xl border border-gray-800">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[1.4rem] bg-black">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?modestbranding=1&rel=0&playsinline=1`}
                    title={`RoleCaller ${video.label}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground mt-4 font-display">
                {video.label}
              </span>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-10 mt-20">
        <p className="text-center text-sm text-muted-foreground">
          © 2026 RoleCaller. Built for FMPB with ❤️
        </p>
      </footer>
    </div>
  )
}

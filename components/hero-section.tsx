"use client"

import { ShinyButton } from "@/components/ui/shiny-button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 overflow-hidden">
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
        {/* Left Column - Content */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 font-display">
            The fastest way to finance SaaS and hardware
          </h1>

          <p className="text-lg text-muted-foreground text-balance mb-8 leading-relaxed max-w-xl">
            Choose Capchase as your financing partner to close deals faster and increase your earnings. Approve your
            buyer, configure your offer, and win your deal in minutes.
          </p>

          <ShinyButton className="text-base px-8">
            Book a call
            <ArrowRight className="ml-2 h-4 w-4" />
          </ShinyButton>
        </motion.div>

        {/* Right Column - Chat Interface Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="space-y-4">
            {/* Buyer Message */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-muted-foreground">Buyer</span>
              <div className="bg-card border border-border rounded-2xl px-6 py-4 max-w-md shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-foreground">Hey, can I pay monthly for this contract?</p>
                </div>
              </div>
            </div>

            {/* Vendor Message */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-muted-foreground">Vendor</span>
              <div className="bg-primary text-primary-foreground rounded-2xl px-6 py-4 max-w-md shadow-sm">
                <p className="text-sm">Sure, here's the proposal: capchase.com/73d6</p>
              </div>
            </div>

            {/* Capchase Message 1 */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-muted-foreground">Capchase</span>
              <div className="bg-card border border-border rounded-2xl px-6 py-4 max-w-md shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-accent-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <p className="text-sm text-foreground">Catalog AI accepted proposal</p>
                </div>
              </div>
            </div>

            {/* Capchase Message 2 */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-muted-foreground">Capchase</span>
              <div className="bg-card border border-border rounded-2xl px-6 py-4 max-w-md shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-accent-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <p className="text-sm text-foreground">Catalog AI completed payment link</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

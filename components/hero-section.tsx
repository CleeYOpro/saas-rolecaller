"use client"

import { ShinyButton } from "@/components/ui/shiny-button"
import { ArrowRight, Play, WifiOff, Check, Clock } from "lucide-react"
import { motion } from "framer-motion"

const students = [
  { name: "Amara O.", status: "present" },
  { name: "Ben K.", status: "present" },
  { name: "Chloe M.", status: "absent" },
  { name: "Dev S.", status: "present" },
  { name: "Ella R.", status: "present" },
  { name: "Finn T.", status: "present" },
]

const statusConfig = {
  present: { label: "P", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  absent: { label: "A", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  late: { label: "L", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
}

export function HeroSection() {
  return (
    <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 overflow-hidden bg-white">
      {/* Grid Background with Alpha Mask */}
      <div className="absolute inset-0 pointer-events-none">
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
        {/* Left Column – Utility-first copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Offline badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full"
          >
            <WifiOff className="h-3.5 w-3.5" />
            Works 100% offline
          </motion.div>

          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 font-display leading-tight">
              Take attendance.{" "}
              <span className="text-blue-500">Even without&nbsp;WiFi.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 font-medium mb-4 max-w-md">
              Mark attendance offline and sync when you&apos;re back online.
            </p>
          </div>

          {/* Three proof points */}


          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <ShinyButton variant="primary" className="text-base px-8 py-6 text-lg font-medium">
              Download for Teachers
              <ArrowRight className="ml-2 h-5 w-5" />
            </ShinyButton>
            <ShinyButton variant="secondary" className="text-base px-8 py-6 text-lg font-medium">
              <Play className="mr-2 h-4 w-4 fill-current" />
              See How It Works
            </ShinyButton>
          </div>
        </motion.div>

        {/* Right Column – App Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-6 shadow-2xl border border-gray-800 overflow-hidden">

            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

            {/* Mockup header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Class 3 · Kerwa</p>
                <h2 className="text-white font-bold text-lg leading-tight">Attendance</h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full font-medium">
                <WifiOff className="h-3 w-3" />
                Offline
              </div>
            </div>

            {/* Student list */}
            <div className="space-y-2.5">
              {students.map((student, i) => {
                const cfg = statusConfig[student.status as keyof typeof statusConfig]
                return (
                  <motion.div
                    key={student.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.07 }}
                    className="flex items-center justify-between bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {student.name[0]}
                      </div>
                      <span className="text-gray-200 text-sm font-medium">{student.name}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-5 flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-4"
            >
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Saved locally · will sync on reconnect
              </div>
              <span className="text-emerald-400 font-medium">5 / 6 marked</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
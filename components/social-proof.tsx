"use client"

import { motion } from "framer-motion"
import { MapPin, Users, HeartHandshake } from "lucide-react"

export function SocialProof() {
  const impact = [
    {
      icon: MapPin, number: "64+", label: "remote & tribal schools"
    },
    { icon: Users, number: "4200+", label: "children tracked daily" },
    { icon: HeartHandshake, number: "18", label: "states across India" },
  ]

  return (
    <section className="border-y border-border/30 bg-gray-100 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left side — quiet trust statement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left max-w-md"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Serving the most forgotten classrooms of India
              <br />
              <span className="text-lg text-muted-foreground leading-relaxed">
                and beyond!
              </span>
            </p>
          </motion.div>

          {/* Right side — minimal numbers */}
          <div className="flex items-center gap-16 md:gap-20 flex-wrap justify-center lg:justify-end">
            {impact.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center lg:items-start gap-2"
              >
                <div className="flex items-baseline gap-2">
                  <item.icon className="w-5 h-5 text-blue-400/70 mt-1" />
                  <span className="text-4xl font-light tracking-tight text-foreground">
                    {item.number}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
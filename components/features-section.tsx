"use client"

import { Card } from "@/components/ui/card"
import { Smartphone, Heart, Users } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function FeaturesSection() {
  const features = [
    {
      icon: Smartphone,
      title: "Works Without Internet",
      description:
        "Take attendance even with zero signal. Data is stored securely on the device and automatically syncs once connection returns.",
      image: "https://dz2cdn1.dzone.com/storage/temp/13837795-no-internet.png",
      alt: "Teacher using a mobile app in a rural classroom",
      schoolname: "",
    },
    {
      icon: Heart,
      title: "Free & Open Access",
      description:
        "Completely free for partner schools. Data can be easily accesible via director login and can be downloaded as Excel files.",
      image: "/WhatsApp Image 2026-02-02 at 9.57.09 PM.jpeg",
      alt: "Students in school uniforms smiling in classroom",
      schoolname: "Data stored in ",
    },
    {
      icon: Users,
      title: "Attendance You Can Trust",
      description:
        "Track daily attendance with accuracy and generate simple records. Know who’s present, who’s absent, and spot patterns early.",
      image: "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*uXyYDqJXSTpmbcAumJJGFQ.jpeg",
      alt: "Students raising hands in classroom",
      schoolname: "",
    },
  ]

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32" id="features">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-balance font-display">
          Features
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group"
            >
              <Card className="overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={f.image}
                    alt={f.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Icon overlay */}
                  <div className="absolute bottom-4 left-4 w-14 h-14 rounded-full bg-primary/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-foreground font-display">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {f.description}
                    </p>
                  </div>

                  {/* Subtle FMPB tag */}
                  <p className="text-xs text-blue-400/70 mt-6 italic">
                    {f.schoolname}
                  </p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
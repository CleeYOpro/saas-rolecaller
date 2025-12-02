"use client"

import { Card } from "@/components/ui/card"
import { Smartphone, Heart, Users } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function FeaturesSection() {
  const features = [
    {
      icon: Smartphone,
      title: "100% Offline",
      description: "Teachers mark attendance deep in forests and hills — no internet ever needed.",
      image: "https://images.unsplash.com/photo-1588075592446-4f8e7c22f2ec?w=800&q=80&fit=crop", // Tribal teacher using phone in remote classroom
      alt: "Adivasi teacher using mobile app in a remote village school",
      schoolname: "In partnership with Friends Missionary Prayer Band",
    },
    {
      icon: Heart,
      title: "Free Forever",
      description: "Open source and completely free for all mission schools. Built with love, sustained by community.",
      image: "https://images.pexels.com/photos/8198050/pexels-photo-8198050.jpeg?w=800&q=80", // Smiling tribal children in uniform, natural light
      alt: "Tribal children smiling in school — hope restored",
      schoolname: "In partnership with Friends Missionary Prayer Band",
    },
    {
      icon: Users,
      title: "Every Child Seen",
      description: "Quietly tracks attendance so no student is forgotten — giving hope where paper failed.",
      image: "https://images.unsplash.com/photo-1594737626040-2b7e9eac9c3e?w=800&q=80&fit=crop", // Group of tribal students raising hands in class
      alt: "Every child now counted and cared for",
      schoolname: "In partnership with Friends Missionary Prayer Band",
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
          Built for the Real India
        </h2>
        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
          No marketing hype. Just tools that work where children need them most.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
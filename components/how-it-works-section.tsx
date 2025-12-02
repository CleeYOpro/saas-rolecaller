"use client"

import { motion } from "framer-motion"
import { Smartphone, Cloud, BarChart3 } from "lucide-react"
import { Card } from "@/components/ui/card"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Smartphone,
      title: "Works Offline",
      description: "Teachers mark attendance on a simple phone app — even in villages with no signal. Data is saved instantly on the device.",
      visual: (
        <div className="h-[280px] flex items-center justify-center">
          <div className="bg-muted/50 border-2 border-dashed border-border rounded-xl w-full h-full flex items-center justify-center text-muted-foreground/70">
            <div className="text-center space-y-2">
              <Smartphone className="w-12 h-12 mx-auto" />
              <p className="text-sm">Teacher marking attendance (offline)</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Cloud,
      title: "Syncs When Possible",
      description: "When the teacher reaches an area with internet, the app quietly uploads all saved data in the background.",
      visual: (
        <div className="h-[280px] flex items-center justify-center">
          <div className="bg-muted/50 border-2 border-dashed border-border rounded-xl w-full h-full flex items-center justify-center text-muted-foreground/70">
            <div className="text-center space-y-2">
              <Cloud className="w-12 h-12 mx-auto" />
              <p className="text-sm">Sync in progress (8 pending)</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: "Data Becomes Insight",
      description: "Administrators see real-time attendance patterns and can support children at risk of dropping out.",
      visual: (
        <div className="h-[280px] flex items-center justify-center">
          <div className="bg-muted/50 border-2 border-dashed border-border rounded-xl w-full h-full flex items-center justify-center text-muted-foreground/70">
            <div className="text-center space-y-2">
              <BarChart3 className="w-12 h-12 mx-auto" />
              <p className="text-sm">Dashboard showing attendance trends</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="border-y border-border/30 bg-gray-100 dark:bg-gray-900 py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, reliable, built for the realities of rural India
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-6">{step.visual}</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display">{step.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
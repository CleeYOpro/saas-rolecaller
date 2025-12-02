"use client"

import { Card } from "@/components/ui/card"
import { Zap, Shield, BarChart3, Workflow, Globe, Lock } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with edge computing and global CDN. Your users get instant responses every time.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights and detailed reports to track performance and make data-driven decisions.",
    },
    {
      icon: Workflow,
      title: "Seamless Integration",
      description: "Connect with your favorite tools through our extensive API and pre-built integrations.",
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Deploy worldwide with automatic scaling and 99.9% uptime guarantee.",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data stays yours. We never sell or share your information with third parties.",
    },
  ]

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32" id="features">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-balance font-display">
          Everything you need to succeed
        </h2>
        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
          Powerful features designed to help you build, ship, and scale your products faster than ever before.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors h-full">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-display">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

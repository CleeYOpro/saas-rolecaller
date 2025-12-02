"use client"

import { motion } from "framer-motion"
import { CreditCard, TrendingUp, Zap, Brain, Activity, CheckCircle2, ArrowUpRight, BarChart3 } from "lucide-react"
import { Card } from "@/components/ui/card"

export function HowItWorksSection() {
  const steps = [
    {
      icon: CreditCard,
      title: "Connect Your Tools",
      description:
        "Integrate with your existing workflow in minutes. Our platform seamlessly connects with the tools you already use every day.",
      visual: (
        <div className="h-[280px] flex items-center justify-center">
          <Card className="w-full p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Enterprise Plan</p>
                    <p className="text-sm text-muted-foreground">Premium Access</p>
                  </div>
                </div>
                <p className="font-bold text-lg">$45,000</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm">Monthly</span>
                  <span className="text-sm font-medium">$3,750 / month</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm">Quarterly</span>
                  <span className="text-sm font-medium">$11,250 / quarter</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Automation",
      description:
        "Let our intelligent system handle the heavy lifting. Automate repetitive tasks and focus on what matters most to your business.",
      visual: (
        <div className="h-[280px] flex items-center justify-center">
          <Card className="w-full p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold">AI Assistant</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <Activity className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Invoice Processing</p>
                    <p className="text-xs text-muted-foreground">Automated 247 invoices</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Customer Onboarding</p>
                    <p className="text-xs text-muted-foreground">32 new accounts created</p>
                  </div>
                </div>

                
              </div>

              <div className="pt-2 border-t border-primary/10">
                <p className="text-xs text-muted-foreground">
                  Time saved this week: <span className="text-primary font-semibold">18.5 hours</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      icon: Zap,
      title: "Scale With Confidence",
      description:
        "Close high-velocity transactions in minutes, not weeks. Our platform is built to handle your growth without compromising on speed or reliability.",
      visual: (
        <div className="h-[280px] flex items-center justify-center">
          <Card className="w-full p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold">Growth Metrics</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+24%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Transaction Volume</span>
                    <span className="font-semibold">$2.4M</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Active Deals</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-primary rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Avg. Close Time</span>
                    <span className="font-semibold">4.2 days</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-primary rounded-full" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-primary/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="text-lg font-bold text-primary">94%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                  <p className="text-lg font-bold text-primary">99.9%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps and transform your workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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

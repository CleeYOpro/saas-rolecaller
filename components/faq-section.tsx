"use client"

import { motion } from "motion/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is your pricing model?",
    answer:
      "We offer flexible pricing plans to suit businesses of all sizes. Our plans start with a free tier for small teams, and scale up based on your needs. Contact us for custom enterprise pricing.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most teams are up and running within 24 hours. Our streamlined onboarding process and dedicated support team ensure a smooth transition with minimal disruption to your workflow.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes! We provide 24/7 customer support via email, chat, and phone. Our dedicated support team is always ready to help you get the most out of our platform.",
  },
  {
    question: "Can I integrate with my existing tools?",
    answer:
      "Absolutely. We offer seamless integrations with popular tools like Slack, Google Workspace, Microsoft 365, and many more. Our API also allows for custom integrations.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is our top priority. We use enterprise-grade encryption, regular security audits, and comply with industry standards including SOC 2, GDPR, and HIPAA.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time with no penalties. We believe in earning your business every month, not locking you into long-term contracts.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-12"
        >
          <div className="flex justify-center">
            <div className="border border-border py-1 px-4 rounded-lg text-sm text-muted-foreground">FAQ</div>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mt-5 text-center">
            Frequently asked questions
          </h2>
          <p className="text-center mt-5 text-muted-foreground">Everything you need to know about our platform.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-display text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

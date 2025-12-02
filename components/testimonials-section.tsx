"use client"

import { motion } from "motion/react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"

const testimonials = [
  {
    text: "This platform revolutionized our operations, streamlining our workflow and boosting productivity. The intuitive interface keeps our team efficient.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Chen",
    role: "Operations Director",
  },
  {
    text: "Implementation was seamless and the results were immediate. Our team adapted quickly thanks to the user-friendly design.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Michael Rodriguez",
    role: "IT Manager",
  },
  {
    text: "The support team is outstanding. They guided us through every step and continue to provide exceptional assistance.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emily Watson",
    role: "Customer Success Lead",
  },
  {
    text: "This solution transformed how we work. The seamless integration and powerful features exceeded our expectations.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "David Kim",
    role: "CEO",
  },
  {
    text: "The robust features and responsive support have made our workflow significantly more efficient and streamlined.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Jessica Martinez",
    role: "Project Manager",
  },
  {
    text: "Implementation exceeded our expectations. It streamlined our processes and improved overall business performance dramatically.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Amanda Foster",
    role: "Business Analyst",
  },
  {
    text: "The user-friendly design and powerful capabilities have transformed how our team collaborates and delivers results.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "James Wilson",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that truly understood our needs and enhanced our operations beyond what we imagined possible.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Rachel Thompson",
    role: "Sales Manager",
  },
  {
    text: "Our productivity and efficiency improved dramatically. This platform has become essential to our daily operations.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Daniel Park",
    role: "Operations Manager",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export function TestimonialsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-border py-1 px-4 rounded-lg text-sm text-muted-foreground">Testimonials</div>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mt-5 text-center">
            What our users say
          </h2>
          <p className="text-center mt-5 text-muted-foreground">See what our customers have to say about us.</p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  )
}

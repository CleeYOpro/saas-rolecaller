import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { SocialProof } from "@/components/social-proof"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FeaturesSection } from "@/components/features-section"
import { ScriptureHeroSection } from "@/components/features-slideshow-section"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiLinkedin } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";
import { SiGithub } from "react-icons/si";
import { FaLink } from "react-icons/fa6";

export default function Home() {
  return (

    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <HowItWorksSection />
        <ScriptureHeroSection />
      </main>
      <footer className="border-t border-border py-12 mt-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6 flex justify-between items-end">

          {/* Massive RoleCaller with hover animation */}
          <h1 className="
      text-9xl lg:text-[14rem] xl:text-[16rem] 
      font-extrabold tracking-tighter leading-none 
      text-[#0075e6] select-none
      transition-all duration-700 ease-out
      hover:scale-105 hover:text-[#0075e6] 
      hover:-translate-y-2 hover:drop-shadow-2xl
      cursor-default
    ">
            RoleCaller
          </h1>

          {/* Admin Login Button */}
          <div className="flex flex-col items-center">


            {/* Social / Store Icons with individual hover bounce */}
            <div className="flex items-center gap-8 pb-2">
              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="
      text-muted-foreground hover:text-foreground 
      transition-all duration-300 
      hover:scale-125 hover:-translate-y-2
      hover:rotate-6
    "
              >
                <SiLinkedin size={32} />
              </a>

              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className="
      text-muted-foreground hover:text-foreground 
      transition-all duration-300 
      hover:scale-125 hover:-translate-y-2
      hover:rotate-6
    "
              >
                <SiGithub size={32} />
              </a>

              {/* Play Store */}
              <a
                href="#"
                aria-label="Google Play"
                className="
      text-muted-foreground hover:text-foreground 
      transition-all duration-300 
      hover:scale-125 hover:-translate-y-2
      hover:-rotate-6
    "
              >
                <BsGooglePlay size={32} />
              </a>

              {/* Website / Link */}
              <a
                href="#"
                aria-label="Website"
                className="
      text-muted-foreground hover:text-foreground 
      transition-all duration-300 
      hover:scale-125 hover:-translate-y-2
      hover:rotate-12
    "
              >
                <FaLink size={32} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright with subtle fade-in on hover (optional extra touch) */}
        <p className="text-center text-sm text-muted-foreground mt-10 transition-opacity duration-500 hover:opacity-80">
          © 2025 RoleCaller — Built for FMPB with ❤️
        </p>
      </footer>
    </div>
  )
}
"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { Download, Mail, Smartphone } from "lucide-react"

type Release = {
  version: string
  build: number
  commitHash: string
  commitMessage: string
  date: string
  profile: string
  latest?: boolean
  highlight: string
  changes: string[]
}

const releases: Release[] = [
  {
    version: "1.3.3",
    build: 5,
    commitHash: "e450af7",
    commitMessage: "export time",
    date: "January 13, 2026",
    profile: "apk/production",
    latest: true,
    highlight: "UI improvements & field naming",
    changes: [
      'Updated CSV import validation to accept multiple column name variations for grade/roll number: "grade", "roll no", "roll no.", "rollno"',
      'Updated UI labels throughout: "Grade" renamed to "Roll No." in forms and table headers',
      'CSV format help text updated: name,grade,class → name,roll no,class',
      'Attendance chart label updated: "Total" → "Day Total"',
      "Removed student ID display from the student search overview for a cleaner UX",
    ],
  },
  {
    version: "1.3.3",
    build: 3,
    commitHash: "f1d4ce0",
    commitMessage: "feat: Add teacher name input component and teacher dashboard",
    date: "December 15, 2025",
    profile: "apk",
    highlight: "Teacher dashboard enhancements",
    changes: [
      "Added a teacher name input component with persist functionality",
      "Teacher dashboard navigation now stays within class selection instead of returning to login",
      'Fixed typo: "Select ya Class" → "Select Your Class"',
      'Button text updated to "Update & Continue" when editing an existing teacher',
    ],
  },
  {
    version: "1.3.2",
    build: 20,
    commitHash: "de101f8",
    commitMessage: "feat: Introduce foundational data types and API services",
    date: "December 14, 2025",
    profile: "production",
    highlight: "Foundational data types & offline-first",
    changes: [
      "Offline-first architecture: offline login with school credentials stored locally",
      "Silent sync on teacher login when online, with local database fallback for classes, students, and attendance",
      "Enhanced API client with offline support for getClasses(), getStudents(), and getAttendance(), plus proper error handling and fallbacks",
      "New syncSchoolsToLocal() function to maintain school credentials for offline login",
      "Schools no longer cleared from the local DB during sync, preserving multi-school support",
      "Admin panel refactored to use authStore for centralized auth state, removing redundant school fetches",
      "UUID generation for new students using uuid v4",
    ],
  },
  {
    version: "1.0.0",
    build: 1,
    commitHash: "0b88619",
    commitMessage: "feat: Implement Drizzle ORM schema, local database, authentication",
    date: "December 14, 2025",
    profile: "production/apk",
    highlight: "Admin panel & student management",
    changes: [
      "Drizzle ORM schema on PostgreSQL (Neon), plus a SQLite local database with tables for schools, classes, students, attendance, and teachers",
      "Admin panel with student and class management, CSV import for bulk student uploads, and edit/delete for students and classes",
      "Attendance visualization with a donut chart (Present/Late/Absent/Unmarked)",
      "Real-time student search by name",
      "Authentication store (authStore) and an offline sync service for schools, classes, students, and attendance",
      "Icon asset optimization (logo.png)",
      "Android build optimization: minification and resource shrinking enabled",
      "Dependencies added: expo-build-properties, react-native-svg, uuid",
    ],
  },
]

const APK_CONTACT_EMAIL = "cbalaranjith@gmail.com"

export default function ChangelogPage() {
  const mailtoHref = `mailto:${APK_CONTACT_EMAIL}?subject=${encodeURIComponent(
    "RoleCaller APK Request"
  )}&body=${encodeURIComponent(
    "Hi,\n\nI'd like to get a copy of the latest RoleCaller APK.\n\nSchool name:\n\nThanks!"
  )}`

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-balance font-display">
            Changelog
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Every production build of the RoleCaller app, tracked release by release.
          </p>
        </motion.div>

        {/* Download APK CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold font-display mb-1">
                Want the latest APK?
              </h2>
              <p className="text-sm text-muted-foreground">
                Builds aren&apos;t distributed publicly yet. Reach out and we&apos;ll get the
                latest production build over to you.
              </p>
            </div>
            <a href={mailtoHref} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Download className="w-4 h-4" />
                Download APK
              </Button>
            </a>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Contact{" "}
            <a
              href={mailtoHref}
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              {APK_CONTACT_EMAIL}
            </a>
          </p>
        </motion.div>

        {/* Releases */}
        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            defaultValue="release-0"
            className="flex flex-col gap-4"
          >
            {releases.map((release, i) => (
              <motion.div
                key={`${release.version}-${release.build}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <AccordionItem
                  value={`release-${i}`}
                  className="border border-border rounded-xl bg-card px-6 last:border-b"
                >
                  <AccordionTrigger className="hover:no-underline py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-left">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg font-semibold font-display">
                          v{release.version}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          build {release.build}
                        </span>
                        {release.latest && (
                          <span className="text-xs font-medium bg-primary text-primary-foreground rounded-full px-2.5 py-0.5">
                            Latest
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground sm:before:content-['•'] sm:before:mr-4">
                        {release.highlight}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-4 font-mono">
                      <span>{release.date}</span>
                      <span className="opacity-50">·</span>
                      <span>{release.profile}</span>
                      <span className="opacity-50">·</span>
                      <span>
                        {release.commitHash}: {release.commitMessage}
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {release.changes.map((change, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-sm text-foreground/90 leading-relaxed"
                        >
                          <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </main>

      <footer className="border-t border-border py-10 mt-20">
        <p className="text-center text-sm text-muted-foreground">
          © 2026 RoleCaller. Built for FMPB with ❤️
        </p>
      </footer>
    </div>
  )
}

"use client"

import Link from "next/link"
import {LucideIcon} from "lucide-react"
import {Card} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {cn} from "@/lib/utils"

interface ColorfulToolCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  color?: "purple" | "blue" | "orange" | "teal" | "pink" | "green"
  isBeta?: boolean
}

const colorClasses = {
  purple: "from-purple-500 to-pink-500 hover:shadow-purple-500/20",
  blue: "from-blue-500 to-cyan-500 hover:shadow-blue-500/20",
  orange: "from-orange-500 to-yellow-500 hover:shadow-orange-500/20",
  teal: "from-teal-500 to-emerald-500 hover:shadow-teal-500/20",
  pink: "from-pink-500 to-rose-500 hover:shadow-pink-500/20",
  green: "from-green-500 to-lime-500 hover:shadow-green-500/20",
}

export function ColorfulToolCard({
  icon: Icon,
  title,
  description,
  href,
  color = "purple",
  isBeta = false,
}: ColorfulToolCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl h-full">
        {/* Gradient background decoration */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-bl-full transition-all duration-300 group-hover:opacity-20 group-hover:w-40 group-hover:h-40",
          colorClasses[color]
        )} />

        <div className="relative p-6 space-y-4">
          {/* Icon with gradient background */}
          <div className="flex items-start justify-between">
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl",
              colorClasses[color]
            )}>
              <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            {isBeta && (
              <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none">
                Beta
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Hover arrow indicator */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            Try it now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Card>
    </Link>
  )
}

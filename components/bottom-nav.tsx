"use client"

import { Home, Dumbbell, TrendingUp, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export type Tab = "home" | "workouts" | "progress" | "more"

const items: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Главная", icon: Home },
  { id: "workouts", label: "Тренировки", icon: Dumbbell },
  { id: "progress", label: "Прогресс", icon: TrendingUp },
  { id: "more", label: "Ещё", icon: MoreHorizontal },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <nav
      aria-label="Основная навигация"
      className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur-xl"
    >
      <div className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map((item) => {
          const isActive = active === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-colors"
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                strokeWidth={2}
              />
              <span
                className={cn(
                  "text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

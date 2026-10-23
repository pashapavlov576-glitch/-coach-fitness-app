"use client"

import { Clock, Dumbbell, Play } from "lucide-react"
import { upcomingWorkouts } from "@/lib/data"

export function WorkoutsScreen({ onStartToday }: { onStartToday: () => void }) {
  return (
    <div className="flex flex-col gap-6 px-5 pb-6 pt-6">
      <header>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Программа
        </span>
        <h1 className="mt-1 text-3xl font-bold">Мои тренировки</h1>
        <p className="mt-1 text-muted-foreground">Сплит «Верх / Низ» · 4 дня в неделю</p>
      </header>

      <div className="space-y-3">
        {upcomingWorkouts.map((w, i) => {
          const isToday = i === 0
          return (
            <button
              key={w.id}
              type="button"
              onClick={isToday ? onStartToday : undefined}
              disabled={!isToday}
              className="flex w-full items-center gap-4 rounded-3xl bg-card p-4 text-left transition-transform disabled:opacity-60 enabled:active:scale-[0.99]"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{w.title}</h2>
                  {isToday && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                      Сегодня
                    </span>
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{w.subtitle}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {w.duration}
                  </span>
                </p>
              </div>
              {isToday && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

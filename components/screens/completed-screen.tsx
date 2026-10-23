"use client"

import { Check, Clock, Dumbbell, Layers } from "lucide-react"
import type { WorkoutStats } from "./workout-screen"

export function CompletedScreen({
  stats,
  onFinish,
}: {
  stats: WorkoutStats
  onFinish: () => void
}) {
  const items = [
    { icon: Clock, label: "Длительность", value: stats.duration },
    { icon: Dumbbell, label: "Упражнений", value: `${stats.exercisesCompleted}` },
    { icon: Layers, label: "Подходов", value: `${stats.setsCompleted}` },
  ]

  return (
    <div className="flex h-full flex-col px-5 py-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
          <Check className="h-12 w-12 text-primary-foreground" strokeWidth={3} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Тренировка завершена!</h1>
          <p className="text-muted-foreground">Отличная работа, Паша. Так держать!</p>
        </div>

        <div className="grid w-full grid-cols-3 gap-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl bg-card p-4">
              <item.icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-xl font-bold">{item.value}</p>
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="w-full rounded-2xl bg-primary py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
      >
        Завершить
      </button>
    </div>
  )
}

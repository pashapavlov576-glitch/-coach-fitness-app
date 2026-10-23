"use client"

import { ArrowLeft, Play, Target, Timer, Repeat, Gauge, Layers } from "lucide-react"
import type { Exercise } from "@/lib/data"

export function ExerciseDetailsScreen({
  exercise,
  onBack,
  onStart,
}: {
  exercise: Exercise
  onBack: () => void
  onStart: () => void
}) {
  const stats = [
    { icon: Layers, label: "Подходы", value: `${exercise.sets}` },
    { icon: Repeat, label: "Повторы", value: exercise.reps },
    { icon: Gauge, label: "RIR", value: exercise.rir },
    { icon: Timer, label: "Отдых", value: `${exercise.rest} сек` },
  ]

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pt-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Упражнение
        </span>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        <h1 className="text-2xl font-bold leading-tight">{exercise.name}</h1>

        <div className="flex aspect-video items-center justify-center rounded-3xl border border-border bg-card">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
            </div>
            <span className="text-xs font-medium">Видео техники</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-3 text-center">
              <s.icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1.5 text-sm font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            <Target className="h-4 w-4 text-primary" />
            Целевые мышцы
          </h2>
          <div className="flex flex-wrap gap-2">
            {exercise.targetMuscles.map((m) => (
              <span key={m} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
                {m}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Техника выполнения
          </h2>
          <ol className="space-y-3">
            {exercise.technique.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-sm leading-snug text-foreground/90">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="border-t border-border bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-2xl bg-primary py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Начать упражнение
        </button>
      </div>
    </div>
  )
}

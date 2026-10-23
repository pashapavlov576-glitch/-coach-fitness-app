"use client"

import { ChevronRight, Clock, Flame, Play } from "lucide-react"
import { todayWorkout, type Exercise } from "@/lib/data"

export function HomeScreen({
  onStart,
  onOpenExercise,
}: {
  onStart: () => void
  onOpenExercise: (exercise: Exercise) => void
}) {
  return (
    <div className="flex flex-col gap-6 px-5 pb-6 pt-6">
      <header className="flex items-center justify-between">
        <span className="text-2xl font-black tracking-[0.2em] text-primary">COACH</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold">
          П
        </div>
      </header>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold leading-tight">Привет, Паша!</h1>
        <p className="text-muted-foreground">Сегодня твоя тренировка.</p>
      </div>

      <section className="overflow-hidden rounded-3xl bg-card">
        <div className="relative bg-primary p-5 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Программа дня</p>
              <h2 className="mt-1 text-2xl font-bold">{todayWorkout.title}</h2>
            </div>
            <Flame className="h-7 w-7 opacity-80" />
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Play className="h-4 w-4" />
              {todayWorkout.subtitle}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {todayWorkout.duration}
            </span>
          </div>
        </div>

        <ul className="divide-y divide-border">
          {todayWorkout.exercises.map((exercise, index) => (
            <li key={exercise.id}>
              <button
                type="button"
                onClick={() => onOpenExercise(exercise)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors active:bg-secondary/60"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-medium leading-snug">{exercise.name}</span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-2xl bg-primary py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
      >
        Начать тренировку
      </button>
    </div>
  )
}

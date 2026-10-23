"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Check, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { todayWorkout, type Exercise } from "@/lib/data"
import {
  clearDraft,
  loadDraft,
  recordCompletedWorkout,
  saveDraft,
  type CompletedWorkout,
  type SavedSet,
} from "@/lib/storage"
import { ExerciseDetailsScreen } from "./exercise-details-screen"

type SetState = SavedSet

export type WorkoutStats = {
  duration: string
  exercisesCompleted: number
  exercisesPlanned: number
  setsCompleted: number
  setsPlanned: number
}

function initSets(exercise: Exercise): SetState[] {
  return Array.from({ length: exercise.sets }, () => ({
    weight: exercise.suggestedWeight,
    reps: "",
    rir: "",
    completed: false,
  }))
}

export function WorkoutScreen({
  startIndex,
  onExit,
  onFinish,
}: {
  startIndex: number
  onExit: () => void
  onFinish: (stats: WorkoutStats) => void
}) {
  const exercises = todayWorkout.exercises

  const draft = typeof window !== "undefined" ? loadDraft() : null
  const hasDraft = draft?.workoutId === todayWorkout.id && draft.sets.length === exercises.length

  const [current, setCurrent] = useState(hasDraft ? draft!.current : startIndex)
  const [allSets, setAllSets] = useState<SetState[][]>(() =>
    hasDraft ? draft!.sets : exercises.map(initSets),
  )
  const [rest, setRest] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const startTimeRef = useRef(hasDraft ? draft!.startedAt : Date.now())

  const exercise = exercises[current]
  const sets = allSets[current]

  // Persist the in-progress workout so entered data survives navigation & refresh
  useEffect(() => {
    saveDraft({
      workoutId: todayWorkout.id,
      startedAt: startTimeRef.current,
      current,
      sets: allSets,
    })
  }, [allSets, current])

  // rest countdown
  useEffect(() => {
    if (rest === null) return
    if (rest <= 0) {
      setRest(null)
      return
    }
    const id = setTimeout(() => setRest((r) => (r === null ? null : r - 1)), 1000)
    return () => clearTimeout(id)
  }, [rest])

  function updateSet(setIndex: number, field: keyof SetState, value: string) {
    setAllSets((prev) => {
      const next = prev.map((arr) => arr.slice())
      next[current][setIndex] = { ...next[current][setIndex], [field]: value }
      return next
    })
  }

  function completeSet(setIndex: number) {
    setAllSets((prev) => {
      const next = prev.map((arr) => arr.slice())
      const wasCompleted = next[current][setIndex].completed
      next[current][setIndex] = { ...next[current][setIndex], completed: !wasCompleted }
      return next
    })
    const wasCompleted = sets[setIndex].completed
    if (!wasCompleted) {
      setRest(exercise.rest)
    }
  }

  function finishWorkout() {
    const elapsedMin = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000))
    const setsCompleted = allSets.reduce(
      (acc, arr) => acc + arr.filter((s) => s.completed).length,
      0,
    )
    const exercisesCompleted = allSets.filter((arr) => arr.some((s) => s.completed)).length

    const completed: CompletedWorkout = {
      id: `${todayWorkout.id}-${startTimeRef.current}`,
      workoutId: todayWorkout.id,
      title: todayWorkout.title,
      date: Date.now(),
      durationMin: elapsedMin,
      exercisesCompleted,
      setsCompleted,
      results: exercises.map((ex, i) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: allSets[i],
      })),
    }
    recordCompletedWorkout(completed)
    clearDraft()

    onFinish({
      duration: `${elapsedMin} мин`,
      exercisesCompleted,
      setsCompleted,
    })
  }

  function next() {
    setRest(null)
    if (current < exercises.length - 1) {
      setCurrent((c) => c + 1)
    } else {
      finishWorkout()
    }
  }

  if (showDetails) {
    return (
      <ExerciseDetailsScreen
        exercise={exercise}
        onBack={() => setShowDetails(false)}
        onStart={() => setShowDetails(false)}
      />
    )
  }

  const completedInExercise = sets.filter((s) => s.completed).length
  const isLast = current === exercises.length - 1

  return (
    <div className="flex h-full flex-col">
      <header className="space-y-4 px-5 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            aria-label="Выйти из тренировки"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-muted-foreground">
            {current + 1} / {exercises.length}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            aria-label="Детали упражнения"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-1.5">
          {exercises.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < current ? "bg-primary" : i === current ? "bg-primary/60" : "bg-secondary",
              )}
            />
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {todayWorkout.title}
          </p>
          <h1 className="mt-1 text-2xl font-bold leading-tight">{exercise.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {exercise.sets} подхода · {exercise.reps} повт · RIR {exercise.rir} · отдых{" "}
            {exercise.rest} сек
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-[2rem_1fr_1fr_1fr_2.75rem] items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Сет</span>
            <span>Вес, кг</span>
            <span>Повт</span>
            <span>RIR</span>
            <span className="text-right">✓</span>
          </div>
          {sets.map((set, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[2rem_1fr_1fr_1fr_2.75rem] items-center gap-2 rounded-2xl p-2 transition-colors",
                set.completed ? "bg-primary/10" : "bg-card",
              )}
            >
              <span className="text-center text-sm font-bold text-muted-foreground">{i + 1}</span>
              <SetInput
                value={set.weight}
                onChange={(v) => updateSet(i, "weight", v)}
                placeholder={exercise.suggestedWeight}
                disabled={set.completed}
              />
              <SetInput
                value={set.reps}
                onChange={(v) => updateSet(i, "reps", v)}
                placeholder={exercise.reps.split("–")[0]}
                disabled={set.completed}
              />
              <SetInput
                value={set.rir}
                onChange={(v) => updateSet(i, "rir", v)}
                placeholder={exercise.rir.split("–")[0]}
                disabled={set.completed}
              />
              <button
                type="button"
                onClick={() => completeSet(i)}
                aria-label={set.completed ? "Отменить подход" : "Завершить подход"}
                className={cn(
                  "flex h-10 w-10 items-center justify-center justify-self-end rounded-xl transition-colors",
                  set.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                <Check className="h-5 w-5" strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Выполнено подходов: {completedInExercise} из {exercise.sets}
        </p>
      </div>

      <div className="border-t border-border bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={next}
          className="w-full rounded-2xl bg-primary py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
        >
          {isLast ? "Завершить" : "Следующее"}
        </button>
      </div>

      {rest !== null && (
        <RestTimer
          remaining={rest}
          total={exercise.rest}
          onSkip={() => setRest(null)}
          onAdd={() => setRest((r) => (r === null ? null : r + 15))}
        />
      )}
    </div>
  )
}

function SetInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <input
      inputMode="numeric"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
      placeholder={placeholder}
      className={cn(
        "h-10 w-full rounded-xl bg-secondary text-center text-sm font-semibold text-foreground outline-none transition-colors",
        "placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary disabled:opacity-60",
      )}
    />
  )
}

function RestTimer({
  remaining,
  total,
  onSkip,
  onAdd,
}: {
  remaining: number
  total: number
  onSkip: () => void
  onAdd: () => void
}) {
  const mm = Math.floor(remaining / 60)
  const ss = remaining % 60
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100))

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-background/95 px-8 backdrop-blur-md">
      <button
        type="button"
        onClick={onSkip}
        aria-label="Закрыть таймер"
        className="absolute right-5 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
      >
        <X className="h-5 w-5" />
      </button>

      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Отдых</p>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="fill-none stroke-secondary" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="fill-none stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={(2 * Math.PI * 45 * (100 - pct)) / 100}
          />
        </svg>
        <span className="absolute text-5xl font-black tabular-nums">
          {mm}:{ss.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-2xl bg-secondary py-3.5 text-sm font-semibold transition-transform active:scale-[0.98]"
        >
          +15 секунд
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Пропустить
        </button>
      </div>
    </div>
  )
}

"use client"

import {
  bodyWeightData,
  personalRecords as demoRecords,
  strengthProgress as demoStrength,
  todayWorkout,
} from "@/lib/data"

export type SavedSet = {
  weight: string
  reps: string
  rir: string
  completed: boolean
}

export type ActiveDraft = {
  workoutId: string
  startedAt: number
  current: number
  sets: SavedSet[][]
}

export type ExerciseResult = {
  exerciseId: string
  exerciseName: string
  sets: SavedSet[]
}

export type CompletedWorkout = {
  id: string
  workoutId: string
  title: string
  date: number
  durationMin: number
  exercisesCompleted: number
  setsCompleted: number
  results: ExerciseResult[]
}

export type BodyWeightEntry = {
  date: number
  value: number
}

export type UserData = {
  bodyWeight: BodyWeightEntry[]
  workouts: CompletedWorkout[]
}

const USER_KEY = "coach:userData"
const DRAFT_KEY = "coach:activeDraft"

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / serialization errors in this MVP
  }
}

export function loadUserData(): UserData {
  return readJSON<UserData>(USER_KEY) ?? { bodyWeight: [], workouts: [] }
}

export function saveUserData(data: UserData) {
  writeJSON(USER_KEY, data)
}

export function recordCompletedWorkout(workout: CompletedWorkout) {
  const data = loadUserData()
  data.workouts = [workout, ...data.workouts].slice(0, 100)
  saveUserData(data)
}

export function addBodyWeight(value: number) {
  const data = loadUserData()
  data.bodyWeight = [...data.bodyWeight, { date: Date.now(), value }].slice(-52)
  saveUserData(data)
  return data
}

export function loadDraft(): ActiveDraft | null {
  return readJSON<ActiveDraft>(DRAFT_KEY)
}

export function saveDraft(draft: ActiveDraft) {
  writeJSON(DRAFT_KEY, draft)
}

export function clearDraft() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(DRAFT_KEY)
  } catch {
    // ignore
  }
}

// ---- Derived views (with demo fallback) ----

function toNum(v: string): number {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

export function workoutVolume(w: CompletedWorkout): number {
  return w.results.reduce(
    (acc, r) =>
      acc +
      r.sets.reduce((a, s) => (s.completed ? a + toNum(s.weight) * toNum(s.reps) : a), 0),
    0,
  )
}

export type BodyWeightView = {
  points: { date: string; value: number }[]
  hasData: boolean
}

export function bodyWeightView(data: UserData): BodyWeightView {
  if (data.bodyWeight.length > 0) {
    return {
      hasData: true,
      points: data.bodyWeight.map((e) => ({
        date: new Date(e.date).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        }),
        value: e.value,
      })),
    }
  }
  return {
    hasData: false,
    points: bodyWeightData.map((d) => ({ date: d.date, value: d.value })),
  }
}

export function personalRecords(data: UserData) {
  if (data.workouts.length === 0) return demoРrecords

  const best = new Map<string, { name: string; weight: number; reps: number }>()
  for (const w of data.workouts) {
    for (const r of w.results) {
      for (const s of r.sets) {
        if (!s.completed) continue
        const weight = toNum(s.weight)
        const reps = toNum(s.reps)
        if (weight <= 0) continue
        const cur = best.get(r.exerciseId)
        if (!cur || weight > cur.weight || (weight === cur.weight && reps > cur.reps)) {
          best.set(r.exerciseId, { name: r.exerciseName, weight, reps })
        }
      }
    }
  }

  const records = Array.from(best.values()).map((b) => ({
    exercise: b.name,
    value: `${b.weight} кг × ${b.reps || "—"}`,
  }))

  return records.length > 0 ? records : demoРrecords
}

export function strengthProgress(data: UserData) {
  if (data.workouts.length === 0) return demoStrength

  const sorted = [...data.workouts].sort((a, b) => b.date - a.date)

  function bestWeight(w: CompletedWorkout, exerciseId: string): number | null {
    const r = w.results.find((x) => x.exerciseId === exerciseId)
    if (!r) return null
    const weights = r.sets.filter((s) => s.completed).map((s) => toNum(s.weight)).filter((n) => n > 0)
    return weights.length ? Math.max(...weights) : null
  }

  const rows: { name: string; now: number; prev: number }[] = []
  for (const ex of todayWorkout.exercises) {
    const history: number[] = []
    for (const w of sorted) {
      const bw = bestWeight(w, ex.id)
      if (bw !== null) history.push(bw)
      if (history.length >= 2) break
    }
    if (history.length === 0) continue
    rows.push({ name: ex.name, now: history[0], prev: history[1] ?? history[0] })
    if (rows.length >= 4) break
  }

  return rows.length > 0 ? rows : demoStrength
}

export type HistoryItem = {
  id: string
  title: string
  dateLabel: string
  duration: string
  sets: number
}

function relativeDate(ts: number): string {
  const now = new Date()
  const then = new Date(ts)
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const days = Math.round((startOfDay(now) - startOfDay(then)) / 86400000)
  if (days <= 0) return "Сегодня"
  if (days === 1) return "Вчера"
  if (days < 5) return `${days} дня назад`
  if (days < 7) return `${days} дней назад`
  return then.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

export function workoutHistoryView(data: UserData): HistoryItem[] | null {
  if (data.workouts.length === 0) return null
  return data.workouts.map((w) => ({
    id: w.id,
    title: w.title,
    dateLabel: relativeDate(w.date),
    duration: `${w.durationMin} мин`,
    sets: w.setsCompleted,
  }))
}

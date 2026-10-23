"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Check, Pencil, Trophy, TrendingUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  addBodyWeight,
  bodyWeightView,
  loadUserData,
  personalRecords as computeRecords,
  strengthProgress as computeStrength,
  workoutHistoryView,
  type UserData,
} from "@/lib/storage"

export function ProgressScreen() {
  const [data, setData] = useState<UserData | null>(null)
  const [editing, setEditing] = useState(false)
  const [weightInput, setWeightInput] = useState("")

  useEffect(() => {
    setData(loadUserData())
  }, [])

  if (!data) {
    return (
      <div className="flex flex-col gap-6 px-5 pb-6 pt-6">
        <header>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Прогресс
          </span>
          <h1 className="mt-1 text-3xl font-bold">Твои результаты</h1>
        </header>
      </div>
    )
  }

  const bw = bodyWeightView(data)
  const records = computeRecords(data)
  const strength = computeStrength(data)
  const history = workoutHistoryView(data)

  const values = bw.points.map((d) => d.value)
  const min = Math.min(...values) - 0.5
  const max = Math.max(...values) + 0.5
  const range = max - min || 1
  const first = bw.points[0].value
  const last = bw.points[bw.points.length - 1].value
  const diff = last - first
  const diffLabel = `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`

  const points = bw.points
    .map((d, i) => {
      const x = (i / Math.max(1, bw.points.length - 1)) * 100
      const y = 100 - ((d.value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  function saveWeight() {
    const value = Number.parseFloat(weightInput.replace(",", "."))
    if (Number.isFinite(value) && value > 0) {
      setData(addBodyWeight(Math.round(value * 10) / 10))
    }
    setWeightInput("")
    setEditing(false)
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-6 pt-6">
      <header>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Прогресс
        </span>
        <h1 className="mt-1 text-3xl font-bold">Твои результаты</h1>
      </header>

      {/* Body weight */}
      <section className="rounded-3xl bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Вес тела</p>
            <p className="mt-1 text-3xl font-bold">
              {last} <span className="text-lg font-medium text-muted-foreground">кг</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {bw.points.length > 1 && (
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold",
                  diff <= 0 ? "bg-primary/15 text-primary" : "bg-secondary text-foreground",
                )}
              >
                {diff <= 0 ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
                {diffLabel} кг
              </span>
            )}
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-label="Изменить вес"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors active:bg-secondary/70"
            >
              {editing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {editing && (
          <div className="mt-4 flex items-center gap-2">
            <input
              autoFocus
              inputMode="decimal"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value.replace(/[^0-9.,]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) saveWeight()
              }}
              placeholder={`${last}`}
              className="h-11 flex-1 rounded-xl bg-secondary px-4 text-center text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={saveWeight}
              aria-label="Сохранить вес"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform active:scale-95"
            >
              <Check className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="mt-4 h-28 w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <polyline
              points={points}
              className="fill-none stroke-primary"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{bw.points[0].date}</span>
          <span>{bw.points[bw.points.length - 1].date}</span>
        </div>
      </section>

      {/* Strength progress */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Прогресс силы
        </h2>
        <div className="space-y-3 rounded-3xl bg-card p-5">
          {strength.map((s) => {
            const pct = s.prev > 0 ? Math.round(((s.now - s.prev) / s.prev) * 100) : 0
            const barPct = (s.now / (s.now + 20)) * 100
            return (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="font-semibold">
                    {s.now} кг{" "}
                    <span className={pct >= 0 ? "text-primary" : "text-muted-foreground"}>
                      {pct >= 0 ? "+" : ""}
                      {pct}%
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${barPct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Personal records */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Trophy className="h-4 w-4 text-primary" />
          Личные рекорды
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {records.map((r) => (
            <div key={r.exercise} className="rounded-2xl bg-card p-4">
              <p className="text-xs text-muted-foreground">{r.exercise}</p>
              <p className="mt-1.5 text-base font-bold text-primary">{r.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          История тренировок
        </h2>
        {history ? (
          <ul className="divide-y divide-border overflow-hidden rounded-3xl bg-card">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{h.dateLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{h.duration}</p>
                  <p className="text-xs text-muted-foreground">{h.sets} подходов</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl bg-card p-6 text-center text-sm text-muted-foreground">
            Пока нет завершённых тренировок. Заверши первую — и она появится здесь.
          </div>
        )}
      </section>
    </div>
  )
}

"use client"

import {
  ChevronRight,
  Bell,
  CircleUser,
  Dumbbell,
  HelpCircle,
  Ruler,
  Settings,
  Utensils,
} from "lucide-react"

const groups: { title: string; items: { icon: typeof Bell; label: string }[] }[] = [
  {
    title: "Тренировки",
    items: [
      { icon: Dumbbell, label: "Мои программы" },
      { icon: Ruler, label: "Замеры тела" },
      { icon: Utensils, label: "Питание" },
    ],
  },
  {
    title: "Аккаунт",
    items: [
      { icon: CircleUser, label: "Профиль" },
      { icon: Bell, label: "Уведомления" },
      { icon: Settings, label: "Настройки" },
      { icon: HelpCircle, label: "Помощь" },
    ],
  },
]

export function MoreScreen() {
  return (
    <div className="flex flex-col gap-6 px-5 pb-6 pt-6">
      <header>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Ещё
        </span>
        <h1 className="mt-1 text-3xl font-bold">Меню</h1>
      </header>

      <div className="flex items-center gap-4 rounded-3xl bg-card p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          П
        </div>
        <div>
          <p className="text-lg font-bold">Паша</p>
          <p className="text-sm text-muted-foreground">Программа «Верх / Низ»</p>
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.title} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {group.title}
          </h2>
          <ul className="divide-y divide-border overflow-hidden rounded-3xl bg-card">
            {group.items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors active:bg-secondary/60"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-center text-xs text-muted-foreground">COACH · MVP версия 0.1</p>
    </div>
  )
}

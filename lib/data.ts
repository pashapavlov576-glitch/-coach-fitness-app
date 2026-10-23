export type ExerciseSet = {
  targetReps: string
  weight: string
  reps: string
  rir: string
}

export type Exercise = {
  id: string
  name: string
  sets: number
  reps: string
  rir: string
  rest: number // seconds
  targetMuscles: string[]
  technique: string[]
  suggestedWeight: string
}

export type Workout = {
  id: string
  title: string
  subtitle: string
  duration: string
  exercises: Exercise[]
}

export const todayWorkout: Workout = {
  id: "verh-a",
  title: "Верх A",
  subtitle: "6 упражнений",
  duration: "60 мин",
  exercises: [
    {
      id: "ex-1",
      name: "Жим в тренажёре на верх груди",
      sets: 4,
      reps: "8–12",
      rir: "1–2",
      rest: 150,
      suggestedWeight: "40",
      targetMuscles: ["Верх груди", "Передняя дельта", "Трицепс"],
      technique: [
        "Отрегулируй сиденье так, чтобы рукояти были на уровне верха груди.",
        "Сведи лопатки и держи спину прижатой к спинке.",
        "Жми плавно, не выпрямляя локти до конца.",
        "Контролируй негативную фазу 2–3 секунды.",
      ],
    },
    {
      id: "ex-2",
      name: "Тяга верхнего блока",
      sets: 4,
      reps: "8–12",
      rir: "1–2",
      rest: 150,
      suggestedWeight: "55",
      targetMuscles: ["Широчайшие", "Бицепс", "Задняя дельта"],
      technique: [
        "Возьми рукоять чуть шире плеч.",
        "Тяни локти вниз к бокам, а не назад.",
        "Своди лопатки в нижней точке.",
        "Не раскачивайся корпусом.",
      ],
    },
    {
      id: "ex-3",
      name: "Жим в тренажёре на плечи",
      sets: 4,
      reps: "8–12",
      rir: "1–2",
      rest: 150,
      suggestedWeight: "30",
      targetMuscles: ["Средняя дельта", "Передняя дельта", "Трицепс"],
      technique: [
        "Спина плотно прижата к спинке.",
        "Жми вверх по прямой траектории.",
        "Не блокируй локти в верхней точке.",
        "Опускай под контролем.",
      ],
    },
    {
      id: "ex-4",
      name: "Тяга горизонтального блока",
      sets: 4,
      reps: "8–12",
      rir: "1–2",
      rest: 150,
      suggestedWeight: "50",
      targetMuscles: ["Середина спины", "Широчайшие", "Бицепс"],
      technique: [
        "Держи спину прямой, лёгкий наклон вперёд.",
        "Тяни рукоять к низу живота.",
        "Своди лопатки в конце движения.",
        "Возвращай вес плавно, растягивая спину.",
      ],
    },
    {
      id: "ex-5",
      name: "Разведения рук в стороны",
      sets: 4,
      reps: "8–12",
      rir: "1–2",
      rest: 150,
      suggestedWeight: "10",
      targetMuscles: ["Средняя дельта"],
      technique: [
        "Лёгкий наклон корпуса вперёд.",
        "Поднимай гантели через стороны до уровня плеч.",
        "Локти чуть согнуты и ведут движение.",
        "Без рывков и раскачки.",
      ],
    },
    {
      id: "ex-6",
      name: "Сгибания на бицепс",
      sets: 4,
      reps: "8–12",
      rir: "1–2",
      rest: 150,
      suggestedWeight: "14",
      targetMuscles: ["Бицепс", "Предплечья"],
      technique: [
        "Локти прижаты к корпусу.",
        "Поднимай вес за счёт бицепса, без раскачки.",
        "Полностью сжимай мышцу в верхней точке.",
        "Опускай медленно, полностью выпрямляя руку.",
      ],
    },
  ],
}

export const upcomingWorkouts: Workout[] = [
  todayWorkout,
  {
    id: "niz-a",
    title: "Низ A",
    subtitle: "5 упражнений",
    duration: "55 мин",
    exercises: [],
  },
  {
    id: "verh-b",
    title: "Верх B",
    subtitle: "6 упражнений",
    duration: "60 мин",
    exercises: [],
  },
  {
    id: "niz-b",
    title: "Низ B",
    subtitle: "5 упражнений",
    duration: "50 мин",
    exercises: [],
  },
]

export const bodyWeightData = [
  { date: "1 нед", value: 82.4 },
  { date: "2 нед", value: 82.0 },
  { date: "3 нед", value: 81.6 },
  { date: "4 нед", value: 81.1 },
  { date: "5 нед", value: 80.7 },
  { date: "6 нед", value: 80.2 },
  { date: "7 нед", value: 79.8 },
  { date: "8 нед", value: 79.3 },
]

export const strengthProgress = [
  { name: "Жим на верх груди", now: 45, prev: 40 },
  { name: "Тяга верхнего блока", now: 60, prev: 55 },
  { name: "Жим на плечи", now: 34, prev: 30 },
  { name: "Тяга гор. блока", now: 55, prev: 50 },
]

export const personalRecords = [
  { exercise: "Жим на верх груди", value: "45 кг × 10" },
  { exercise: "Тяга верхнего блока", value: "60 кг × 12" },
  { exercise: "Жим на плечи", value: "34 кг × 8" },
  { exercise: "Сгибания на бицепс", value: "16 кг × 12" },
]

export const workoutHistory = [
  { date: "Сегодня", title: "Верх A", volume: "4 320 кг", sets: 24 },
  { date: "2 дня назад", title: "Низ A", volume: "6 150 кг", sets: 20 },
  { date: "4 дня назад", title: "Верх B", volume: "4 080 кг", sets: 24 },
  { date: "6 дней назад", title: "Низ B", volume: "5 890 кг", sets: 20 },
  { date: "8 дней назад", title: "Верх A", volume: "4 210 кг", sets: 24 },
]

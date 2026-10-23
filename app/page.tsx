"use client"

import { useState } from "react"
import { BottomNav, type Tab } from "@/components/bottom-nav"
import { HomeScreen } from "@/components/screens/home-screen"
import { WorkoutsScreen } from "@/components/screens/workouts-screen"
import { ProgressScreen } from "@/components/screens/progress-screen"
import { MoreScreen } from "@/components/screens/more-screen"
import { ExerciseDetailsScreen } from "@/components/screens/exercise-details-screen"
import { WorkoutScreen, type WorkoutStats } from "@/components/screens/workout-screen"
import { CompletedScreen } from "@/components/screens/completed-screen"
import { todayWorkout, type Exercise } from "@/lib/data"

type Overlay =
  | { type: "none" }
  | { type: "details"; exercise: Exercise }
  | { type: "workout"; startIndex: number }
  | { type: "completed"; stats: WorkoutStats }

export default function Page() {
  const [tab, setTab] = useState<Tab>("home")
  const [overlay, setOverlay] = useState<Overlay>({ type: "none" })

  function startWorkout(startIndex = 0) {
    setOverlay({ type: "workout", startIndex })
  }

  return (
    <div className="flex min-h-svh justify-center bg-black">
      <div className="relative flex min-h-svh w-full max-w-md flex-col overflow-hidden bg-background text-foreground shadow-2xl sm:my-4 sm:min-h-0 sm:rounded-[2.5rem] sm:border sm:border-border">
        {/* Tab content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {tab === "home" && (
            <HomeScreen
              onStart={() => startWorkout(0)}
              onOpenExercise={(exercise) => setOverlay({ type: "details", exercise })}
            />
          )}
          {tab === "workouts" && <WorkoutsScreen onStartToday={() => startWorkout(0)} />}
          {tab === "progress" && <ProgressScreen />}
          {tab === "more" && <MoreScreen />}
        </div>

        <BottomNav active={tab} onChange={setTab} />

        {/* Overlays */}
        {overlay.type !== "none" && (
          <div className="absolute inset-0 z-30 flex flex-col bg-background">
            {overlay.type === "details" && (
              <ExerciseDetailsScreen
                exercise={overlay.exercise}
                onBack={() => setOverlay({ type: "none" })}
                onStart={() => {
                  const index = todayWorkout.exercises.findIndex(
                    (e) => e.id === overlay.exercise.id,
                  )
                  startWorkout(index === -1 ? 0 : index)
                }}
              />
            )}
            {overlay.type === "workout" && (
              <WorkoutScreen
                startIndex={overlay.startIndex}
                onExit={() => setOverlay({ type: "none" })}
                onFinish={(stats) => setOverlay({ type: "completed", stats })}
              />
            )}
            {overlay.type === "completed" && (
              <CompletedScreen
                stats={overlay.stats}
                onFinish={() => {
                  setOverlay({ type: "none" })
                  setTab("home")
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

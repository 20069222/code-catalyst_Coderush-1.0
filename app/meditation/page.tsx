"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"

interface MeditationSession {
  id: string
  title: string
  description: string
  duration: number
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  techniques: string[]
}

interface BreathingExercise {
  id: string
  name: string
  description: string
  pattern: string
  duration: number
  benefits: string[]
}

const meditationSessions: MeditationSession[] = [
  {
    id: "1",
    title: "Mindful Breathing",
    description: "Focus on your breath to center yourself and reduce anxiety",
    duration: 10,
    category: "Anxiety Relief",
    difficulty: "Beginner",
    techniques: ["Breath awareness", "Present moment focus"],
  },
  {
    id: "2",
    title: "Body Scan Relaxation",
    description: "Progressive relaxation technique to release physical tension",
    duration: 15,
    category: "Stress Relief",
    difficulty: "Beginner",
    techniques: ["Progressive muscle relaxation", "Body awareness"],
  },
  {
    id: "3",
    title: "Loving-Kindness Meditation",
    description: "Cultivate compassion for yourself and others",
    duration: 12,
    category: "Self-Compassion",
    difficulty: "Intermediate",
    techniques: ["Loving-kindness", "Compassion cultivation"],
  },
  {
    id: "4",
    title: "Cognitive Restructuring",
    description: "Challenge negative thought patterns with CBT techniques",
    duration: 20,
    category: "CBT",
    difficulty: "Intermediate",
    techniques: ["Thought challenging", "Cognitive reframing"],
  },
]

const breathingExercises: BreathingExercise[] = [
  {
    id: "1",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8 seconds",
    pattern: "4-7-8",
    duration: 5,
    benefits: ["Reduces anxiety", "Promotes sleep", "Calms nervous system"],
  },
  {
    id: "2",
    name: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, hold",
    pattern: "4-4-4-4",
    duration: 8,
    benefits: ["Improves focus", "Reduces stress", "Enhances emotional regulation"],
  },
  {
    id: "3",
    name: "Belly Breathing",
    description: "Deep diaphragmatic breathing to activate relaxation response",
    pattern: "Natural",
    duration: 10,
    benefits: ["Lowers blood pressure", "Reduces cortisol", "Improves digestion"],
  },
]

const cbtTechniques = [
  {
    id: "1",
    title: "Thought Record",
    description: "Identify and examine negative thought patterns",
    steps: [
      "Notice the negative thought",
      "Identify the emotion it creates",
      "Examine the evidence for and against",
      "Create a more balanced thought",
    ],
  },
  {
    id: "2",
    title: "Grounding 5-4-3-2-1",
    description: "Use your senses to stay present during anxiety",
    steps: [
      "5 things you can see",
      "4 things you can touch",
      "3 things you can hear",
      "2 things you can smell",
      "1 thing you can taste",
    ],
  },
  {
    id: "3",
    title: "Behavioral Activation",
    description: "Schedule pleasant activities to improve mood",
    steps: [
      "List activities you used to enjoy",
      "Rate them by difficulty and pleasure",
      "Schedule one small activity today",
      "Notice how you feel after completing it",
    ],
  },
]

export default function MeditationPage() {
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null)
  const [activeBreathing, setActiveBreathing] = useState<BreathingExercise | null>(null)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [breathPhase, setBreathPhase] = useState("inhale")
  const [breathCount, setBreathCount] = useState(0)
  const [selectedMood, setSelectedMood] = useState("")

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isSessionActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isSessionActive) {
      setIsSessionActive(false)
      setActiveSession(null)
      setActiveBreathing(null)
    }

    return () => clearInterval(interval)
  }, [isSessionActive, timeRemaining])

  useEffect(() => {
    if (activeBreathing && isSessionActive) {
      const pattern = activeBreathing.pattern.split("-").map(Number)
      if (pattern.length === 4) {
        // Box breathing
        const phases = ["inhale", "hold", "exhale", "hold"]
        const durations = pattern

        let phaseIndex = 0
        let phaseTime = durations[0]

        const breathInterval = setInterval(() => {
          phaseTime--
          if (phaseTime === 0) {
            phaseIndex = (phaseIndex + 1) % 4
            phaseTime = durations[phaseIndex]
            setBreathPhase(phases[phaseIndex])
            if (phaseIndex === 0) setBreathCount((prev) => prev + 1)
          }
        }, 1000)

        return () => clearInterval(breathInterval)
      } else if (pattern.length === 3) {
        // 4-7-8 breathing
        const phases = ["inhale", "hold", "exhale"]
        const durations = pattern

        let phaseIndex = 0
        let phaseTime = durations[0]

        const breathInterval = setInterval(() => {
          phaseTime--
          if (phaseTime === 0) {
            phaseIndex = (phaseIndex + 1) % 3
            phaseTime = durations[phaseIndex]
            setBreathPhase(phases[phaseIndex])
            if (phaseIndex === 0) setBreathCount((prev) => prev + 1)
          }
        }, 1000)

        return () => clearInterval(breathInterval)
      }
    }
  }, [activeBreathing, isSessionActive])

  const startSession = (session: MeditationSession) => {
    setActiveSession(session)
    setTimeRemaining(session.duration * 60)
    setIsSessionActive(true)
    setBreathPhase("inhale")
    setBreathCount(0)
  }

  const startBreathing = (exercise: BreathingExercise) => {
    setActiveBreathing(exercise)
    setTimeRemaining(exercise.duration * 60)
    setIsSessionActive(true)
    setBreathPhase("inhale")
    setBreathCount(0)
  }

  const stopSession = () => {
    setIsSessionActive(false)
    setActiveSession(null)
    setActiveBreathing(null)
    setTimeRemaining(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getMoodBasedRecommendations = (mood: string) => {
    switch (mood) {
      case "anxious":
        return {
          sessions: meditationSessions.filter((s) => s.category === "Anxiety Relief"),
          breathing: breathingExercises.filter((b) => b.benefits.some((benefit) => benefit.includes("anxiety"))),
          cbt: cbtTechniques.filter((t) => t.title.includes("Grounding")),
        }
      case "stressed":
        return {
          sessions: meditationSessions.filter((s) => s.category === "Stress Relief"),
          breathing: breathingExercises.filter((b) => b.benefits.some((benefit) => benefit.includes("stress"))),
          cbt: cbtTechniques.filter((t) => t.title.includes("Behavioral")),
        }
      case "sad":
        return {
          sessions: meditationSessions.filter((s) => s.category === "Self-Compassion"),
          breathing: breathingExercises,
          cbt: cbtTechniques.filter((t) => t.title.includes("Behavioral")),
        }
      default:
        return {
          sessions: meditationSessions,
          breathing: breathingExercises,
          cbt: cbtTechniques,
        }
    }
  }

  const recommendations = getMoodBasedRecommendations(selectedMood)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meditation & Coping Strategies</h1>
          <p className="text-muted-foreground">
            Evidence-based techniques for mindfulness, stress relief, and emotional well-being
          </p>
        </div>

        {/* Active Session */}
        {isSessionActive && (activeSession || activeBreathing) && (
          <div className="bg-card rounded-lg border border-border p-8 mb-8 text-center">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">
              {activeSession?.title || activeBreathing?.name}
            </h2>
            <div className="text-4xl font-bold text-primary mb-4">{formatTime(timeRemaining)}</div>

            {activeBreathing && (
              <div className="mb-6">
                <div
                  className={`w-32 h-32 mx-auto rounded-full border-4 transition-all duration-1000 ease-in-out ${
                    breathPhase === "inhale"
                      ? "scale-125 border-primary bg-primary/10"
                      : breathPhase === "hold"
                        ? "scale-125 border-secondary bg-secondary/10"
                        : "scale-100 border-accent bg-accent/10"
                  }`}
                />
                <p className="text-lg text-card-foreground mt-4 capitalize">{breathPhase}</p>
                <p className="text-sm text-muted-foreground">Cycle {breathCount}</p>
              </div>
            )}

            <button
              onClick={stopSession}
              className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors"
            >
              Stop Session
            </button>
          </div>
        )}

        {/* Mood-Based Recommendations */}
        <div className="mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">How are you feeling right now?</h2>
            <div className="flex flex-wrap gap-3">
              {["anxious", "stressed", "sad", "neutral"].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    selectedMood === mood
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-sm text-muted-foreground mt-3">
                Showing personalized recommendations for when you're feeling {selectedMood}
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Guided Meditations */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Guided Meditations</h2>
              <div className="space-y-4">
                {recommendations.sessions.map((session) => (
                  <div key={session.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-card-foreground">{session.title}</h3>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                        {session.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{session.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{session.duration} min</span>
                      <button
                        onClick={() => startSession(session)}
                        disabled={isSessionActive}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Breathing Exercises */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Breathing Exercises</h2>
              <div className="space-y-4">
                {recommendations.breathing.map((exercise) => (
                  <div key={exercise.id} className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-card-foreground mb-2">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                    <div className="mb-3">
                      <div className="text-xs text-muted-foreground mb-1">Benefits:</div>
                      <div className="flex flex-wrap gap-1">
                        {exercise.benefits.map((benefit, index) => (
                          <span key={index} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{exercise.duration} min</span>
                      <button
                        onClick={() => startBreathing(exercise)}
                        disabled={isSessionActive}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CBT Techniques */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">CBT Techniques</h2>
              <div className="space-y-4">
                {recommendations.cbt.map((technique) => (
                  <div key={technique.id} className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-card-foreground mb-2">{technique.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{technique.description}</p>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Steps:</div>
                      <ol className="text-sm text-card-foreground space-y-1">
                        {technique.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary font-medium mr-2">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Tips</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Start with shorter sessions and gradually increase duration</p>
                <p>• Find a quiet, comfortable space for practice</p>
                <p>• Consistency is more important than duration</p>
                <p>• Be patient and kind with yourself as you learn</p>
                <p>• Combine techniques for maximum benefit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

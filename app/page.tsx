"use client"

import Link from "next/link"
import Navigation from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Professional Mental Health Technology Platform</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Advanced AI-powered tools for mental health assessment, mood tracking, and therapeutic support. Designed for
            healthcare professionals and patients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Access Dashboard
            </Link>
            <Link
              href="/auth/login"
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">AI-Powered Chat</h3>
            <p className="text-muted-foreground">
              Advanced conversational AI trained on therapeutic techniques and mental health best practices.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Mood Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive mood tracking with detailed analytics and pattern recognition.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Digital Journaling</h3>
            <p className="text-muted-foreground">
              AI-guided journaling with personalized prompts and reflection exercises.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🧘</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Meditation & Coping</h3>
            <p className="text-muted-foreground">
              Personalized meditation sessions and evidence-based coping strategies.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Progress Tracking</h3>
            <p className="text-muted-foreground">
              Detailed progress reports and insights for both patients and healthcare providers.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">HIPAA Compliant</h3>
            <p className="text-muted-foreground">
              Enterprise-grade security and privacy protection for sensitive health data.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">500+</div>
              <div className="text-muted-foreground">Healthcare Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">1M+</div>
              <div className="text-muted-foreground">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-1 mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

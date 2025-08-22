"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  role: string
  joinDate: string
  timezone: string
  language: string
}

interface NotificationSettings {
  dailyReminders: boolean
  moodCheckIns: boolean
  journalPrompts: boolean
  meditationReminders: boolean
  weeklyReports: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

interface PreferenceSettings {
  preferredCopingStrategies: string[]
  meditationDuration: number
  journalPromptFrequency: string
  moodTrackingReminders: string
  privacyLevel: string
  dataSharing: boolean
}

const copingStrategies = [
  "Mindfulness Meditation",
  "Breathing Exercises",
  "Cognitive Behavioral Therapy",
  "Journaling",
  "Progressive Muscle Relaxation",
  "Grounding Techniques",
  "Positive Affirmations",
  "Physical Exercise",
  "Creative Expression",
  "Social Connection",
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "preferences" | "security">("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@medmind.com",
    role: "Healthcare Provider",
    joinDate: "2024-01-15",
    timezone: "America/New_York",
    language: "English",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    dailyReminders: true,
    moodCheckIns: true,
    journalPrompts: false,
    meditationReminders: true,
    weeklyReports: true,
    emailNotifications: true,
    pushNotifications: false,
  })

  const [preferences, setPreferences] = useState<PreferenceSettings>({
    preferredCopingStrategies: ["Mindfulness Meditation", "Breathing Exercises", "Journaling"],
    meditationDuration: 10,
    journalPromptFrequency: "daily",
    moodTrackingReminders: "evening",
    privacyLevel: "standard",
    dataSharing: false,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }, 1000)
  }

  const handleNotificationSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSuccessMessage("Notification settings updated!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }, 500)
  }

  const handlePreferencesSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSuccessMessage("Preferences updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }, 500)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setSuccessMessage("Password updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }, 1000)
  }

  const toggleCopingStrategy = (strategy: string) => {
    setPreferences((prev) => ({
      ...prev,
      preferredCopingStrategies: prev.preferredCopingStrategies.includes(strategy)
        ? prev.preferredCopingStrategies.filter((s) => s !== strategy)
        : [...prev.preferredCopingStrategies, strategy],
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account, preferences, and privacy settings</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-6">
            <p className="text-secondary font-medium">{successMessage}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4">
              <nav className="space-y-2">
                {[
                  { id: "profile", label: "Profile Information", icon: "👤" },
                  { id: "notifications", label: "Notifications", icon: "🔔" },
                  { id: "preferences", label: "Preferences", icon: "⚙️" },
                  { id: "security", label: "Security", icon: "🔒" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-6">
              {/* Profile Information */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-card-foreground">Profile Information</h2>
                    <button
                      onClick={() => (isEditing ? handleProfileSave() : setIsEditing(true))}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground disabled:bg-muted disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground disabled:bg-muted disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground disabled:bg-muted disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Role</label>
                      <select
                        value={profile.role}
                        onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground disabled:bg-muted disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      >
                        <option value="Patient">Patient</option>
                        <option value="Healthcare Provider">Healthcare Provider</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Timezone</label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile((prev) => ({ ...prev, timezone: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground disabled:bg-muted disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Language</label>
                      <select
                        value={profile.language}
                        onChange={(e) => setProfile((prev) => ({ ...prev, language: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground disabled:bg-muted disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Account Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Member Since:</span>
                        <span className="ml-2 text-card-foreground">
                          {new Date(profile.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Account Status:</span>
                        <span className="ml-2 text-secondary font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-card-foreground">Notification Settings</h2>
                    <button
                      onClick={handleNotificationSave}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">Reminder Notifications</h3>
                      <div className="space-y-4">
                        {Object.entries({
                          dailyReminders: "Daily wellness check-ins",
                          moodCheckIns: "Mood tracking reminders",
                          journalPrompts: "Journal writing prompts",
                          meditationReminders: "Meditation session reminders",
                          weeklyReports: "Weekly progress reports",
                        }).map(([key, label]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium text-card-foreground">{label}</div>
                              <div className="text-sm text-muted-foreground">
                                {key === "dailyReminders" && "Get reminded to check in with your mental health daily"}
                                {key === "moodCheckIns" && "Receive prompts to log your mood throughout the day"}
                                {key === "journalPrompts" && "Get AI-generated prompts for reflective writing"}
                                {key === "meditationReminders" && "Reminders for your scheduled meditation sessions"}
                                {key === "weeklyReports" && "Summary of your mental health progress each week"}
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications[key as keyof NotificationSettings] as boolean}
                                onChange={(e) => setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">Delivery Methods</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <div className="font-medium text-card-foreground">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">
                              Receive notifications via email at {profile.email}
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.emailNotifications}
                              onChange={(e) =>
                                setNotifications((prev) => ({ ...prev, emailNotifications: e.target.checked }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <div className="font-medium text-card-foreground">Push Notifications</div>
                            <div className="text-sm text-muted-foreground">
                              Receive notifications directly in your browser or mobile app
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.pushNotifications}
                              onChange={(e) =>
                                setNotifications((prev) => ({ ...prev, pushNotifications: e.target.checked }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === "preferences" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-card-foreground">Preferences</h2>
                    <button
                      onClick={handlePreferencesSave}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">Preferred Coping Strategies</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select the coping strategies you find most helpful. The AI will prioritize these in
                        recommendations.
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {copingStrategies.map((strategy) => (
                          <label key={strategy} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.preferredCopingStrategies.includes(strategy)}
                              onChange={() => toggleCopingStrategy(strategy)}
                              className="h-4 w-4 text-primary focus:ring-primary/50 border-border rounded"
                            />
                            <span className="text-sm text-card-foreground">{strategy}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Default Meditation Duration
                        </label>
                        <select
                          value={preferences.meditationDuration}
                          onChange={(e) =>
                            setPreferences((prev) => ({ ...prev, meditationDuration: Number.parseInt(e.target.value) }))
                          }
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        >
                          <option value={5}>5 minutes</option>
                          <option value={10}>10 minutes</option>
                          <option value={15}>15 minutes</option>
                          <option value={20}>20 minutes</option>
                          <option value={30}>30 minutes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Journal Prompt Frequency
                        </label>
                        <select
                          value={preferences.journalPromptFrequency}
                          onChange={(e) =>
                            setPreferences((prev) => ({ ...prev, journalPromptFrequency: e.target.value }))
                          }
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        >
                          <option value="daily">Daily</option>
                          <option value="every-other-day">Every Other Day</option>
                          <option value="weekly">Weekly</option>
                          <option value="as-needed">As Needed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Mood Tracking Reminders
                        </label>
                        <select
                          value={preferences.moodTrackingReminders}
                          onChange={(e) =>
                            setPreferences((prev) => ({ ...prev, moodTrackingReminders: e.target.value }))
                          }
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        >
                          <option value="morning">Morning</option>
                          <option value="afternoon">Afternoon</option>
                          <option value="evening">Evening</option>
                          <option value="multiple">Multiple Times</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">Privacy Level</label>
                        <select
                          value={preferences.privacyLevel}
                          onChange={(e) => setPreferences((prev) => ({ ...prev, privacyLevel: e.target.value }))}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        >
                          <option value="minimal">Minimal Data Collection</option>
                          <option value="standard">Standard Privacy</option>
                          <option value="enhanced">Enhanced Analytics</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-medium text-card-foreground">Anonymous Data Sharing</div>
                        <div className="text-sm text-muted-foreground">
                          Help improve mental health research by sharing anonymized data
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.dataSharing}
                          onChange={(e) => setPreferences((prev) => ({ ...prev, dataSharing: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                          />
                        </div>

                        <button
                          onClick={handlePasswordChange}
                          disabled={
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            passwordData.newPassword !== passwordData.confirmPassword ||
                            isSaving
                          }
                          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSaving ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">Account Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <div className="font-medium text-card-foreground">Two-Factor Authentication</div>
                            <div className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </div>
                          </div>
                          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                            Enable 2FA
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <div className="font-medium text-card-foreground">Login Sessions</div>
                            <div className="text-sm text-muted-foreground">Manage your active login sessions</div>
                          </div>
                          <button className="text-primary hover:text-primary/80 font-medium">View Sessions</button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <div>
                            <div className="font-medium text-destructive">Delete Account</div>
                            <div className="text-sm text-muted-foreground">
                              Permanently delete your account and all data
                            </div>
                          </div>
                          <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

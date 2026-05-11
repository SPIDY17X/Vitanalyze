"use client"

import * as React from "react"
import { User, Shield, Bell, Target, Settings, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

interface UserProfile {
  firstName: string
  lastName: string
  age: string
  weight: string
  height: string
  activityLevel: string
  dietType: string
  restrictions: string[]
  goal: string
  targetWeight: string
}

const defaultProfile: UserProfile = {
  firstName: "",
  lastName: "",
  age: "",
  weight: "",
  height: "",
  activityLevel: "moderate",
  dietType: "Everything",
  restrictions: [],
  goal: "",
  targetWeight: "",
}

function computeGoal(weight: string, targetWeight: string): string {
  if (!weight || !targetWeight) return "Not Set"
  const w = parseFloat(weight)
  const t = parseFloat(targetWeight)
  if (w > t) return "Weight Loss"
  if (w < t) return "Weight Gain"
  return "Maintenance"
}

export default function ProfilePage() {
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [profile, setProfile] = React.useState<UserProfile>(defaultProfile)

  const currentGoal = computeGoal(profile.weight, profile.targetWeight)

  // Firestore se data load karo
  React.useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      try {
        const docRef = doc(firestore, "users", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfile({ ...defaultProfile, ...docSnap.data() as UserProfile })
        }
      } catch (err) {
        console.error("Profile load error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user, firestore])

  // Firestore mein save karo
  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const docRef = doc(firestore, "users", user.uid)
      const goalToSave = computeGoal(profile.weight, profile.targetWeight)
      await setDoc(docRef, { 
        ...profile, 
        goal: goalToSave,
        id: user.uid, 
        userId: user.uid 
      }, { merge: true })
      toast({
        title: "Profile Updated ✅",
        description: "Your settings have been saved!",
      })
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Could not save profile. Try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleRestriction = (id: string) => {
    setProfile(prev => ({
      ...prev,
      restrictions: prev.restrictions.includes(id)
        ? prev.restrictions.filter(r => r !== id)
        : [...prev.restrictions, id]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 py-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
        <Button onClick={handleSave} disabled={saving} className="rounded-full px-8">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          {[
            { name: "Personal Info", icon: User, active: true },
            { name: "Health Goals", icon: Target, active: false },
            { name: "Preferences", icon: Settings, active: false },
            { name: "Notifications", icon: Bell, active: false },
            { name: "Security", icon: Shield, active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Personal Information</CardTitle>
              <CardDescription>Update your biometrics for more accurate AI planning.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={profile.firstName}
                    onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={profile.lastName}
                    onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={profile.age}
                    onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                    placeholder="0"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={profile.weight}
                    onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))}
                    placeholder="0"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={profile.height}
                    onChange={e => setProfile(p => ({ ...p, height: e.target.value }))}
                    placeholder="0"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select
                  value={profile.activityLevel}
                  onValueChange={val => setProfile(p => ({ ...p, activityLevel: val }))}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Office job, little exercise)</SelectItem>
                    <SelectItem value="light">Lightly Active (1-2 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="very">Very Active (6-7 days/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Dietary Profile</CardTitle>
              <CardDescription>Tell us about your preferences and restrictions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Primary Diet Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo", "Everything"].map((diet) => (
                    <div
                      key={diet}
                      onClick={() => setProfile(p => ({ ...p, dietType: diet }))}
                      className={`border p-3 rounded-xl text-center cursor-pointer transition-all hover:border-primary ${profile.dietType === diet ? 'border-primary bg-primary/5' : ''}`}
                    >
                      <p className="text-sm font-medium">{diet}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Common Restrictions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "gluten", label: "Gluten-Free" },
                    { id: "dairy", label: "Dairy-Free" },
                    { id: "nuts", label: "Nut-Free" },
                    { id: "soy", label: "Soy-Free" },
                    { id: "sugar", label: "Low Added Sugar" },
                    { id: "shellfish", label: "No Shellfish" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={profile.restrictions.includes(item.id)}
                        onCheckedChange={() => toggleRestriction(item.id)}
                      />
                      <label htmlFor={item.id} className="text-sm font-medium leading-none">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-accent/5">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Current Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Weight (kg)</Label>
                <Input
                  type="number"
                  value={profile.targetWeight}
                  onChange={e => setProfile(p => ({ ...p, targetWeight: e.target.value }))}
                  placeholder="0"
                  className="rounded-lg max-w-[200px]"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">{currentGoal}</p>
                    <p className="text-xs text-muted-foreground">
                      Target: {profile.targetWeight ? `${profile.targetWeight} kg` : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center italic">"Changing your goal will regenerate your AI Meal & Exercise plan automatically."</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
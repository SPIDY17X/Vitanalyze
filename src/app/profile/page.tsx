"use client"

import * as React from "react"
import { User, Shield, Bell, Target, Settings, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [saving, setSaving] = React.useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Profile Updated",
        description: "Your settings have been saved and your AI plan is being optimized.",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-8 py-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
        <Button onClick={handleSave} disabled={saving} className="rounded-full px-8">
          {saving ? "Saving..." : "Save Changes"}
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
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Alex" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" className="rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" defaultValue="32" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" defaultValue="79.8" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" defaultValue="182" className="rounded-lg" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select defaultValue="moderate">
                  <SelectTrigger id="activity" className="rounded-lg">
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
                      <div key={diet} className={`border p-3 rounded-xl text-center cursor-pointer transition-all hover:border-primary ${diet === "Everything" ? 'border-primary bg-primary/5' : ''}`}>
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
                        <Checkbox id={item.id} />
                        <label htmlFor={item.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{item.label}</label>
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
               <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                     <Check className="h-5 w-5 text-white" />
                   </div>
                   <div>
                     <p className="font-bold">Weight Loss</p>
                     <p className="text-xs text-muted-foreground">Target: 75.0 kg</p>
                   </div>
                 </div>
                 <Button variant="ghost" size="sm">Change</Button>
               </div>
               <p className="text-xs text-muted-foreground text-center italic">"Changing your goal will regenerate your AI Meal & Exercise plan automatically."</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { Utensils, Activity, Plus, Moon, Sun, Sunrise, Flame, Trash2, Loader2, Coffee, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, Timestamp } from "firebase/firestore"
import { getNutritionInfo } from "@/ai/flows/nutrition-lookup"

interface FoodLog {
  id?: string
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  mealType: string
  time: string
  userId: string
  createdAt: Timestamp
}

interface ActivityLog {
  id?: string
  name: string
  duration: string
  intensity: string
  burned: number
  time: string
  userId: string
  createdAt: Timestamp
}

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"]
const intensityLevels = ["Low", "Moderate", "High"]

const todayStr = () => new Date().toLocaleDateString("en-US", {
  weekday: "long", month: "long", day: "numeric"
})

export default function LoggingPage() {
  const { user } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()

  const [foodLogs, setFoodLogs] = React.useState<FoodLog[]>([])
  const [activityLogs, setActivityLogs] = React.useState<ActivityLog[]>([])
  const [loading, setLoading] = React.useState(true)

  // Food Dialog
  const [foodDialogOpen, setFoodDialogOpen] = React.useState(false)
  const [foodForm, setFoodForm] = React.useState({
    name: "",
    quantity: "",
    mealType: "Breakfast",
  })
  const [nutrition, setNutrition] = React.useState<{
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  } | null>(null)
  const [detectingNutrition, setDetectingNutrition] = React.useState(false)
  const [savingFood, setSavingFood] = React.useState(false)

  // Activity Dialog
  const [activityDialogOpen, setActivityDialogOpen] = React.useState(false)
  const [activityForm, setActivityForm] = React.useState({
    name: "", duration: "", intensity: "Moderate", burned: ""
  })
  const [savingActivity, setSavingActivity] = React.useState(false)

  // Load today's logs
  const fetchLogs = React.useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const foodRef = collection(firestore, "users", user.uid, "foodLogs")
      const foodQ = query(foodRef, where("createdAt", ">=", Timestamp.fromDate(todayStart)), orderBy("createdAt", "desc"))
      const foodSnap = await getDocs(foodQ)
      setFoodLogs(foodSnap.docs.map(d => ({ id: d.id, ...d.data() } as FoodLog)))

      const actRef = collection(firestore, "users", user.uid, "activityLogs")
      const actQ = query(actRef, where("createdAt", ">=", Timestamp.fromDate(todayStart)), orderBy("createdAt", "desc"))
      const actSnap = await getDocs(actQ)
      setActivityLogs(actSnap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog)))
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [user, firestore])

  React.useEffect(() => { fetchLogs() }, [fetchLogs])

  // AI se nutrition detect karo
  const handleDetectNutrition = async () => {
    if (!foodForm.name || !foodForm.quantity) {
      toast({ title: "Please enter food name and quantity first!", variant: "destructive" })
      return
    }
    setDetectingNutrition(true)
    setNutrition(null)
    try {
      const result = await getNutritionInfo(foodForm.name, foodForm.quantity)
      if (result.success && result.data) {
        setNutrition(result.data)
        toast({ title: "Nutrition detected! ✅", description: `${foodForm.name} (${foodForm.quantity})` })
      } else {
        toast({ title: "Could not detect nutrition ❌", description: "Try a different food name or quantity.", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Error ❌", description: "AI detection failed.", variant: "destructive" })
    } finally {
      setDetectingNutrition(false)
    }
  }

  // Food save karo
  const handleSaveFood = async () => {
    if (!user || !foodForm.name || !foodForm.quantity || !nutrition) return
    setSavingFood(true)
    try {
      const now = new Date()
      const newFood: Omit<FoodLog, "id"> = {
        name: foodForm.name,
        quantity: foodForm.quantity,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        fiber: nutrition.fiber,
        mealType: foodForm.mealType,
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        userId: user.uid,
        createdAt: Timestamp.fromDate(now)
      }
      await addDoc(collection(firestore, "users", user.uid, "foodLogs"), newFood)
      toast({ title: "Food logged! ✅" })
      setFoodDialogOpen(false)
      setFoodForm({ name: "", quantity: "", mealType: "Breakfast" })
      setNutrition(null)
      fetchLogs()
    } catch (err) {
      toast({ title: "Error ❌", description: "Could not save food.", variant: "destructive" })
    } finally {
      setSavingFood(false)
    }
  }

  // Activity save karo
  const handleSaveActivity = async () => {
    if (!user || !activityForm.name || !activityForm.burned) return
    setSavingActivity(true)
    try {
      const now = new Date()
      const newActivity: Omit<ActivityLog, "id"> = {
        name: activityForm.name,
        duration: activityForm.duration || "N/A",
        intensity: activityForm.intensity,
        burned: parseFloat(activityForm.burned) || 0,
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        userId: user.uid,
        createdAt: Timestamp.fromDate(now)
      }
      await addDoc(collection(firestore, "users", user.uid, "activityLogs"), newActivity)
      toast({ title: "Activity logged! ✅" })
      setActivityDialogOpen(false)
      setActivityForm({ name: "", duration: "", intensity: "Moderate", burned: "" })
      fetchLogs()
    } catch (err) {
      toast({ title: "Error ❌", description: "Could not save activity.", variant: "destructive" })
    } finally {
      setSavingActivity(false)
    }
  }

  const handleDeleteFood = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(firestore, "users", user.uid, "foodLogs", id))
    toast({ title: "Removed! 🗑️" })
    fetchLogs()
  }

  const handleDeleteActivity = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(firestore, "users", user.uid, "activityLogs", id))
    toast({ title: "Removed! 🗑️" })
    fetchLogs()
  }

  const openFoodDialog = (mealType: string) => {
    setFoodForm({ name: "", quantity: "", mealType })
    setNutrition(null)
    setFoodDialogOpen(true)
  }

  // Totals
  const totalCalories = foodLogs.reduce((sum, f) => sum + f.calories, 0)
  const totalProtein = foodLogs.reduce((sum, f) => sum + f.protein, 0)
  const totalCarbs = foodLogs.reduce((sum, f) => sum + f.carbs, 0)
  const totalFat = foodLogs.reduce((sum, f) => sum + f.fat, 0)
  const totalFiber = foodLogs.reduce((sum, f) => sum + (f.fiber || 0), 0)
  const totalBurned = activityLogs.reduce((sum, a) => sum + a.burned, 0)
  const calorieGoal = 2000
  const calorieProgress = Math.min((totalCalories / calorieGoal) * 100, 100)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 py-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Daily Log</h1>
          <p className="text-muted-foreground">Track your nutrition and activities.</p>
        </div>
        <Button variant="outline" className="rounded-full w-fit">{todayStr()}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="food" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="food" className="rounded-lg py-2">Food Intake</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-lg py-2">Physical Activity</TabsTrigger>
            </TabsList>

            {/* FOOD TAB */}
            <TabsContent value="food" className="space-y-6 mt-6">
              {[
                { type: "Breakfast", icon: <Sunrise className="h-4 w-4 text-orange-400" /> },
                { type: "Lunch", icon: <Sun className="h-4 w-4 text-yellow-500" /> },
                { type: "Dinner", icon: <Moon className="h-4 w-4 text-indigo-400" /> },
                { type: "Snack", icon: <Coffee className="h-4 w-4 text-amber-600" /> },
              ].map(({ type, icon }) => {
                const meals = foodLogs.filter(f => f.mealType === type)
                return (
                  <div key={type} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold flex items-center gap-2">{icon} {type}</h3>
                      <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => openFoodDialog(type)}>
                        + Add Food
                      </Button>
                    </div>
                    {meals.length > 0 ? (
                      <div className="grid gap-3">
                        {meals.map((meal) => (
                          <Card key={meal.id} className="border-none shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Utensils className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{meal.name}</p>
                                  <p className="text-xs text-muted-foreground">{meal.quantity} • {meal.time}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    P:{meal.protein}g | C:{meal.carbs}g | F:{meal.fat}g | Fiber:{meal.fiber}g
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="font-bold text-sm">{meal.calories} kcal</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteFood(meal.id!)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="p-6 border-2 border-dashed rounded-xl text-center text-muted-foreground text-sm cursor-pointer hover:border-primary hover:text-primary transition-colors"
                        onClick={() => openFoodDialog(type)}
                      >
                        + Log your {type.toLowerCase()}
                      </div>
                    )}
                  </div>
                )
              })}
            </TabsContent>

            {/* ACTIVITY TAB */}
            <TabsContent value="activity" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="font-bold">Today's Activities</h3>
                {activityLogs.length > 0 ? (
                  activityLogs.map((ex) => (
                    <Card key={ex.id} className="border-none shadow-sm">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{ex.name}</p>
                            <p className="text-xs text-muted-foreground">{ex.time} • {ex.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-sm text-primary">-{ex.burned} kcal</p>
                            <Badge variant="secondary" className="text-[10px] uppercase">{ex.intensity}</Badge>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteActivity(ex.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div
                    className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground text-sm cursor-pointer hover:border-primary hover:text-primary transition-colors"
                    onClick={() => setActivityDialogOpen(true)}
                  >
                    + Log your first activity today
                  </div>
                )}
                <Button className="w-full h-12 rounded-xl border-dashed" variant="outline" onClick={() => setActivityDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Activity
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-headline">Nutrition Summary</CardTitle>
              <CardDescription className="text-primary-foreground/70">Today's totals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span className="font-bold">{totalCalories.toFixed(0)} / {calorieGoal}</span>
                </div>
                <Progress value={calorieProgress} className="h-2 bg-white/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-[10px] opacity-70">Protein</p>
                  <p className="font-bold">{totalProtein.toFixed(1)}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] opacity-70">Carbs</p>
                  <p className="font-bold">{totalCarbs.toFixed(1)}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] opacity-70">Fats</p>
                  <p className="font-bold">{totalFat.toFixed(1)}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] opacity-70">Fiber</p>
                  <p className="font-bold">{totalFiber.toFixed(1)}g</p>
                </div>
              </div>
              {totalBurned > 0 && (
                <div className="pt-2 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> Burned</span>
                    <span className="font-bold">-{totalBurned} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Net Calories</span>
                    <span className="font-bold">{(totalCalories - totalBurned).toFixed(0)} kcal</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Meals logged</span>
                <span className="font-bold">{foodLogs.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Activities</span>
                <span className="font-bold">{activityLogs.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Calories remaining</span>
                <span className={`font-bold ${totalCalories > calorieGoal ? 'text-destructive' : 'text-primary'}`}>
                  {Math.max(calorieGoal - totalCalories, 0).toFixed(0)} kcal
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FOOD DIALOG */}
      <Dialog open={foodDialogOpen} onOpenChange={(open) => {
        setFoodDialogOpen(open)
        if (!open) { setNutrition(null); setFoodForm({ name: "", quantity: "", mealType: "Breakfast" }) }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Log Food with AI
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select value={foodForm.mealType} onValueChange={val => setFoodForm(f => ({ ...f, mealType: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mealTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Food Name *</Label>
              <Input
                placeholder="e.g. Chicken Biryani, Banana, Dal Rice"
                value={foodForm.name}
                onChange={e => { setFoodForm(f => ({ ...f, name: e.target.value })); setNutrition(null) }}
              />
            </div>

            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                placeholder="e.g. 200g, 1 cup, 2 chapati, 1 bowl"
                value={foodForm.quantity}
                onChange={e => { setFoodForm(f => ({ ...f, quantity: e.target.value })); setNutrition(null) }}
              />
            </div>

            {/* AI Detect Button */}
            <Button
              className="w-full"
              variant="outline"
              onClick={handleDetectNutrition}
              disabled={detectingNutrition || !foodForm.name || !foodForm.quantity}
            >
              {detectingNutrition ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Detecting nutrition...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2 text-primary" />Detect Nutrition with AI</>
              )}
            </Button>

            {/* Nutrition Results — Read Only */}
            {nutrition && (
              <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  AI Detected Nutrition — {foodForm.quantity} of {foodForm.name}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Calories", value: `${nutrition.calories} kcal`, highlight: true },
                    { label: "Protein", value: `${nutrition.protein}g` },
                    { label: "Carbs", value: `${nutrition.carbs}g` },
                    { label: "Fats", value: `${nutrition.fat}g` },
                    { label: "Fiber", value: `${nutrition.fiber}g` },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className={`p-2 rounded-lg text-center ${highlight ? 'bg-primary/10 col-span-2' : 'bg-background'}`}>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className={`font-bold text-sm ${highlight ? 'text-primary' : ''}`}>{value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  ✨ AI generated — based on standard nutritional databases
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFoodDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveFood}
              disabled={savingFood || !nutrition}
            >
              {savingFood ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log Food"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ACTIVITY DIALOG */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Activity Name *</Label>
              <Input
                placeholder="e.g. Morning Run, Gym, Yoga"
                value={activityForm.name}
                onChange={e => setActivityForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input placeholder="e.g. 30 min" value={activityForm.duration} onChange={e => setActivityForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Calories Burned *</Label>
                <Input type="number" placeholder="0" value={activityForm.burned} onChange={e => setActivityForm(f => ({ ...f, burned: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Intensity</Label>
              <Select value={activityForm.intensity} onValueChange={val => setActivityForm(f => ({ ...f, intensity: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {intensityLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveActivity} disabled={savingActivity || !activityForm.name || !activityForm.burned}>
              {savingActivity ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log Activity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
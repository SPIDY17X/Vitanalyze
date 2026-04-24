"use client"

import * as React from "react"
import { Utensils, Activity, Plus, Search, Coffee, Moon, Sun, Sunrise, Clock, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const loggedMeals = [
  { time: "08:15 AM", name: "Oatmeal with Berries", calories: 350, protein: 12, carbs: 45, fat: 8, type: "Breakfast" },
  { time: "10:30 AM", name: "Greek Yogurt", calories: 150, protein: 15, carbs: 10, fat: 2, type: "Snack" },
  { time: "01:20 PM", name: "Grilled Chicken Salad", calories: 420, protein: 35, carbs: 15, fat: 18, type: "Lunch" },
]

const recentExercises = [
  { time: "07:00 AM", name: "Morning Yoga", duration: "30 min", intensity: "Low", burned: 120 },
  { time: "05:30 PM", name: "Biking", duration: "45 min", intensity: "Moderate", burned: 350 },
]

export default function LoggingPage() {
  return (
    <div className="flex flex-col gap-8 py-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Daily Log</h1>
          <p className="text-muted-foreground">Keep track of your nutrition and physical activities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full">Today, Oct 30</Button>
          <Button variant="default" className="rounded-full shadow-md">
            <Plus className="h-4 w-4 mr-2" /> Quick Add
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="food" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="food" className="rounded-lg py-2">Food Intake</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-lg py-2">Physical Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="food" className="space-y-6 mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search food, recipes, or scan barcode..." className="pl-10 h-12 rounded-xl" />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Sunrise className="h-4 w-4 text-orange-400" /> Breakfast
                  </h3>
                  <Button variant="ghost" size="sm" className="text-xs text-primary">+ Add Food</Button>
                </div>
                <div className="grid gap-4">
                  {loggedMeals.filter(m => m.type === "Breakfast").map((meal, i) => (
                    <MealCard key={i} meal={meal} />
                  ))}
                  {loggedMeals.filter(m => m.type === "Breakfast").length === 0 && (
                     <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground text-sm">
                        No food logged for breakfast yet.
                     </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" /> Lunch
                  </h3>
                  <Button variant="ghost" size="sm" className="text-xs text-primary">+ Add Food</Button>
                </div>
                <div className="grid gap-4">
                   {loggedMeals.filter(m => m.type === "Lunch").map((meal, i) => (
                    <MealCard key={i} meal={meal} />
                  ))}
                </div>

                 <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-400" /> Dinner
                  </h3>
                  <Button variant="ghost" size="sm" className="text-xs text-primary">+ Add Food</Button>
                </div>
                 <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground text-sm">
                    Log your dinner to complete the day.
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-6">
               <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search activity (e.g., Running, Yoga, Weights)..." className="pl-10 h-12 rounded-xl" />
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold">Today's Activities</h3>
                {recentExercises.map((ex, i) => (
                  <Card key={i} className="border-none shadow-sm overflow-hidden">
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
                      <div className="text-right">
                        <p className="font-bold text-sm text-primary">-{ex.burned} kcal</p>
                        <Badge variant="secondary" className="text-[10px] uppercase">{ex.intensity}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button className="w-full h-12 rounded-xl border-dashed" variant="outline">
                   <Plus className="mr-2 h-4 w-4" /> Add Another Activity
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
           <Card className="border-none shadow-sm bg-primary text-primary-foreground">
             <CardHeader className="pb-2">
               <CardTitle className="text-lg font-headline">Nutrition Summary</CardTitle>
               <CardDescription className="text-primary-foreground/70">Estimated totals for today</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span>Calories</span>
                   <span className="font-bold">920 / 2,200</span>
                 </div>
                 <Progress value={42} className="h-2 bg-white/20" />
               </div>
               
               <div className="grid grid-cols-3 gap-4">
                 <div className="text-center">
                   <p className="text-[10px] opacity-70">Protein</p>
                   <p className="font-bold">62g</p>
                   <p className="text-[10px] opacity-70">of 150g</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[10px] opacity-70">Carbs</p>
                   <p className="font-bold">70g</p>
                   <p className="text-[10px] opacity-70">of 220g</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[10px] opacity-70">Fats</p>
                   <p className="font-bold">28g</p>
                   <p className="text-[10px] opacity-70">of 65g</p>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="border-none shadow-sm">
             <CardHeader>
               <CardTitle className="text-lg font-headline">Recent Foods</CardTitle>
             </CardHeader>
             <CardContent>
               <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {["Brown Rice", "Avocado", "Salmon Fillet", "Spinach", "Almonds", "Protein Shake", "Apple"].map((food, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium">{food}</span>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
               </ScrollArea>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}

function MealCard({ meal }: { meal: any }) {
  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Utensils className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">{meal.name}</p>
            <p className="text-xs text-muted-foreground">{meal.time}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm">{meal.calories} kcal</p>
          <p className="text-[10px] text-muted-foreground">P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import { generateMealExercisePlan, type AIMealExercisePlannerOutput } from "@/ai/flows/ai-meal-exercise-planner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Utensils, Dumbbell, Clock, Flame, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PlannerPage() {
  const [loading, setLoading] = React.useState(false)
  const [plan, setPlan] = React.useState<AIMealExercisePlannerOutput | null>(null)
  const { toast } = useToast()

  const handleGeneratePlan = async () => {
    setLoading(true)
    try {
      const result = await generateMealExercisePlan({
        healthGoals: ["lose weight", "improve cardiovascular health"],
        dietaryPreferences: ["high protein", "low carb"],
        dietaryRestrictions: ["none"],
        activityLevel: "moderately active",
        currentWeightKg: 80,
        heightCm: 175,
        age: 32,
        gender: "male",
        additionalNotes: "I want to focus on quick 30-minute meals."
      })
      setPlan(result)
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate your personalized plan. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 py-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">AI Wellness Planner</h1>
          <p className="text-muted-foreground">Tailored nutrition and exercise routines powered by AI.</p>
        </div>
        <Button 
          onClick={handleGeneratePlan} 
          disabled={loading}
          className="rounded-full px-6 h-12 shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Weekly Plan
            </>
          )}
        </Button>
      </div>

      {!plan && !loading && (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-headline">Ready for your new plan?</h3>
              <p className="text-muted-foreground max-w-sm">Click generate to get a full 7-day personalized meal and workout routine based on your current profile.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="space-y-8 animate-pulse">
           <div className="h-64 bg-muted rounded-xl w-full" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="h-32 bg-muted rounded-xl" />
             <div className="h-32 bg-muted rounded-xl" />
           </div>
        </div>
      )}

      {plan && (
        <div className="space-y-8">
          <Card className="bg-primary/5 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Weekly Overview</CardTitle>
              <CardDescription>{plan.overallSummary}</CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue={plan.weeklyPlan[0].day} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50 rounded-xl">
              {plan.weeklyPlan.map((day) => (
                <TabsTrigger 
                  key={day.day} 
                  value={day.day}
                  className="rounded-lg py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  {day.day}
                </TabsTrigger>
              ))}
            </TabsList>
            {plan.weeklyPlan.map((dayPlan) => (
              <TabsContent key={dayPlan.day} value={dayPlan.day} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-primary" />
                      Daily Meals
                    </h3>
                    <div className="space-y-4">
                      {dayPlan.mealPlan.map((meal, idx) => (
                        <Card key={idx} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader className="bg-muted/30 py-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="bg-white">{meal.mealType}</Badge>
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {meal.recipe.calories} kcal</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {meal.recipe.prepTimeMinutes + (meal.recipe.cookTimeMinutes || 0)}m</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <h4 className="font-bold text-lg mb-2">{meal.recipe.recipeName}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{meal.recipe.description}</p>
                            
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex gap-2">
                                <Badge variant="secondary" className="text-[10px]">P: {meal.recipe.proteinGrams}g</Badge>
                                <Badge variant="secondary" className="text-[10px]">C: {meal.recipe.carbsGrams}g</Badge>
                                <Badge variant="secondary" className="text-[10px]">F: {meal.recipe.fatGrams}g</Badge>
                              </div>
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
                                View Recipe <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-accent" />
                      Workout Routine
                    </h3>
                    <div className="space-y-4">
                      {dayPlan.exerciseRoutine.map((ex, idx) => (
                        <Card key={idx} className="border-none shadow-sm bg-accent/5">
                          <CardContent className="p-4">
                            <h4 className="font-bold mb-1">{ex.exerciseName}</h4>
                            <p className="text-xs text-muted-foreground mb-3">{ex.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {ex.sets && <Badge className="bg-accent text-accent-foreground border-none">{ex.sets} Sets</Badge>}
                              {ex.reps && <Badge className="bg-accent text-accent-foreground border-none">{ex.reps} Reps</Badge>}
                              {ex.durationMinutes && <Badge className="bg-accent text-accent-foreground border-none">{ex.durationMinutes} Min</Badge>}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {dayPlan.exerciseRoutine.length === 0 && (
                        <Card className="bg-muted/20 border-none">
                           <CardContent className="p-8 text-center text-muted-foreground text-sm">
                             Rest Day! Focus on recovery and light movement.
                           </CardContent>
                        </Card>
                      )}
                    </div>

                    <Card className="border-none shadow-sm bg-primary text-primary-foreground">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs leading-relaxed opacity-90">{dayPlan.dailySummary}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  )
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}

"use client"

import * as React from "react"
import { aiCoachingInsights, type AICoachingInsightsOutput } from "@/ai/flows/ai-coaching-insights"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, CheckCircle2, AlertCircle, Zap, TrendingUp, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function InsightsPage() {
  const [loading, setLoading] = React.useState(false)
  const [insights, setInsights] = React.useState<AICoachingInsightsOutput | null>(null)
  const { toast } = useToast()

  const generateInsights = async () => {
    setLoading(true)
    try {
      const result = await aiCoachingInsights({
        healthGoals: ["lose weight", "increase energy"],
        dietaryPreferences: ["low carb"],
        restrictions: ["none"],
        activityLevel: "moderately active",
        loggedFoodData: JSON.stringify([
          { item: "Oatmeal", calories: 300, proteinGrams: 10, carbsGrams: 50, fatGrams: 5, date: "2024-10-29" },
          { item: "Chicken Salad", calories: 450, proteinGrams: 40, carbsGrams: 15, fatGrams: 20, date: "2024-10-29" },
          { item: "Late Night Pizza", calories: 800, proteinGrams: 25, carbsGrams: 90, fatGrams: 35, date: "2024-10-28" }
        ]),
        loggedActivityData: JSON.stringify([
          { activityType: "Running", durationMinutes: 30, intensity: "high", caloriesBurned: 350, date: "2024-10-29" },
          { activityType: "Yoga", durationMinutes: 20, intensity: "low", caloriesBurned: 80, date: "2024-10-28" }
        ])
      })
      setInsights(result)
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Your AI coach is currently resting. Please try again in a moment.",
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
          <h1 className="text-3xl font-bold font-headline">AI Coaching Insights</h1>
          <p className="text-muted-foreground">Deep analysis of your habits and personalized growth strategies.</p>
        </div>
        <Button 
          onClick={generateInsights} 
          disabled={loading}
          className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-5 w-5" />
              Request Coach Review
            </>
          )}
        </Button>
      </div>

      {!insights && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
           <div className="space-y-6">
             <div className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-primary">
               Personalized Coaching
             </div>
             <h2 className="text-4xl font-bold font-headline leading-tight">Your data tells a <span className="text-primary italic">story</span>. Let's read it together.</h2>
             <p className="text-muted-foreground text-lg">Vitanalyze uses your logged food and activity history to identify hidden patterns that might be slowing your progress.</p>
             <div className="space-y-4">
               {[
                 { icon: TrendingUp, text: "Trend identification across weeks" },
                 { icon: Zap, text: "Metabolic window optimization" },
                 { icon: Lightbulb, text: "Tailored habit replacement ideas" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                     <item.icon className="h-4 w-4 text-primary" />
                   </div>
                   <span className="font-medium">{item.text}</span>
                 </div>
               ))}
             </div>
           </div>
           <Card className="border-none shadow-2xl relative overflow-hidden group">
              <img 
                src="https://picsum.photos/seed/coach/600/600" 
                className="aspect-square object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="AI Coach"
                data-ai-hint="meditation nature"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                 <p className="text-white font-medium italic">"Success is the sum of small efforts, repeated day-in and day-out."</p>
              </div>
           </Card>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
           <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
           </div>
           <div className="space-y-2">
             <h3 className="text-xl font-bold font-headline">Vitanalyze AI is thinking...</h3>
             <p className="text-muted-foreground">Looking at your nutrition balance, activity levels, and sleep markers.</p>
           </div>
        </div>
      )}

      {insights && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          <Card className="border-none shadow-sm bg-primary/5">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
               <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                 <Brain className="h-6 w-6 text-white" />
               </div>
               <div className="space-y-1">
                 <CardTitle className="font-headline">Coach's Summary</CardTitle>
                 <CardDescription className="text-primary/80 font-medium">{insights.feedbackSummary}</CardDescription>
               </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                Patterns Identified
              </h3>
              <div className="grid gap-3">
                {insights.patternsIdentified.map((pattern, i) => (
                  <div key={i} className="p-4 rounded-xl bg-card border shadow-sm flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0" />
                    <p className="text-sm font-medium">{pattern}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Actionable Advice
              </h3>
               <div className="grid gap-4">
                {insights.actionableAdvice.map((advice, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-primary/20 shadow-sm flex items-start gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">{i+1}</span>
                    <p className="text-sm">{advice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold font-headline">Suggested Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.suggestions.map((suggestion, i) => (
                <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow bg-accent/10">
                  <CardContent className="p-6">
                    <Zap className="h-5 w-5 text-primary mb-4" />
                    <p className="text-sm font-semibold leading-relaxed">{suggestion}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

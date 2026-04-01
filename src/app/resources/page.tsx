"use client"

import * as React from "react"
import { Search, Utensils, Dumbbell, Clock, Flame, ChefHat, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recipes = [
  { id: 1, name: "Quinoa Veggie Bowl", time: "20 min", calories: 380, difficulty: "Easy", image: "https://picsum.photos/seed/recipe1/400/300", tags: ["Vegan", "Gluten-Free"] },
  { id: 2, name: "Lemon Herb Salmon", time: "25 min", calories: 420, difficulty: "Moderate", image: "https://picsum.photos/seed/recipe2/400/300", tags: ["High Protein", "Low Carb"] },
  { id: 3, name: "Sweet Potato Toast", time: "15 min", calories: 250, difficulty: "Easy", image: "https://picsum.photos/seed/recipe3/400/300", tags: ["Breakfast", "Healthy"] },
  { id: 4, name: "Berry Smoothie Bowl", time: "10 min", calories: 310, difficulty: "Easy", image: "https://picsum.photos/seed/recipe4/400/300", tags: ["Breakfast", "Vegan"] },
]

const exercises = [
  { id: 1, name: "HIIT Cardio Blast", duration: "30 min", type: "Cardio", level: "Intermediate", image: "https://picsum.photos/seed/workout1/400/300", burned: "350-500" },
  { id: 2, name: "Lower Body Strength", duration: "45 min", type: "Strength", level: "Beginner", image: "https://picsum.photos/seed/workout2/400/300", burned: "200-300" },
  { id: 3, name: "Flow Yoga for Energy", duration: "40 min", type: "Yoga", level: "Beginner", image: "https://picsum.photos/seed/workout3/400/300", burned: "150-200" },
]

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-8 py-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline">Wellness Library</h1>
        <p className="text-muted-foreground">Expert-curated recipes and exercise routines to fuel your goals.</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search recipes or workouts..." className="pl-12 h-14 rounded-2xl shadow-sm border-none bg-white" />
      </div>

      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-8">
          <TabsTrigger value="recipes" className="rounded-lg py-2 px-8 flex items-center gap-2">
            <Utensils className="h-4 w-4" /> Healthy Recipes
          </TabsTrigger>
          <TabsTrigger value="exercises" className="rounded-lg py-2 px-8 flex items-center gap-2">
            <Dumbbell className="h-4 w-4" /> Workouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {recipes.map((recipe) => (
               <Card key={recipe.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all rounded-2xl">
                 <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={recipe.image} alt={recipe.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {recipe.tags.map(tag => (
                        <Badge key={tag} className="bg-white/90 text-primary text-[10px] backdrop-blur-sm border-none shadow-sm">{tag}</Badge>
                      ))}
                    </div>
                 </div>
                 <CardHeader className="p-4 pb-2">
                   <CardTitle className="text-lg font-bold">{recipe.name}</CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 pt-0 space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.time}</span>
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {recipe.calories} kcal</span>
                    </div>
                 </CardContent>
                 <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                      View Recipe
                    </Button>
                 </CardFooter>
               </Card>
             ))}
           </div>
        </TabsContent>

        <TabsContent value="exercises">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {exercises.map((workout) => (
               <Card key={workout.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all rounded-2xl flex flex-col">
                 <div className="relative aspect-video overflow-hidden">
                    <img src={workout.image} alt={workout.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-accent text-accent-foreground border-none font-bold uppercase tracking-wider text-[10px]">{workout.level}</Badge>
                    </div>
                 </div>
                 <CardHeader className="p-6 flex-1">
                   <CardTitle className="text-xl font-bold mb-2">{workout.name}</CardTitle>
                   <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Duration</span>
                        <span className="text-sm font-medium">{workout.duration}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Burn</span>
                        <span className="text-sm font-medium">{workout.burned} kcal</span>
                      </div>
                   </div>
                 </CardHeader>
                 <CardFooter className="p-6 pt-0">
                   <Button className="w-full rounded-full gap-2">
                     <BookOpen className="h-4 w-4" /> View Routine
                   </Button>
                 </CardFooter>
               </Card>
             ))}
           </div>
        </TabsContent>
      </Tabs>

      <section className="mt-12 p-8 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden">
         <div className="relative z-10 max-w-2xl">
           <ChefHat className="h-10 w-10 mb-6 opacity-80" />
           <h3 className="text-2xl font-bold font-headline mb-4">Request a Specific Plan?</h3>
           <p className="opacity-90 mb-6">Our AI can generate a custom recipe collection based on ingredients you already have in your fridge.</p>
           <Button variant="secondary" className="rounded-full px-8" asChild>
             <Link href="/planner">Go to Planner</Link>
           </Button>
         </div>
         <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/10 -skew-x-12 translate-x-1/2" />
      </section>
    </div>
  )
}

import Link from "next/link"

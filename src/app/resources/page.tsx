"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Utensils, Dumbbell, Clock, Flame } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const recipes = [
  {
    id: 1,
    name: "Quinoa Veggie Bowl",
    duration: "20 min",
    calories: "380 kcal",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  },
  {
    id: 2,
    name: "Lemon Herb Salmon",
    duration: "25 min",
    calories: "420 kcal",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
  },
  {
    id: 3,
    name: "Sweet Potato Toast",
    duration: "15 min",
    calories: "250 kcal",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d", // ✅ sweet potato toast
  },
  {
    id: 4,
    name: "Berry Smoothie Bowl",
    duration: "10 min",
    calories: "310 kcal",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea", // ✅ smoothie bowl
  },
];

const exercises = [
  {
    id: 1,
    name: "HIIT Cardio Blast",
    duration: "30 min",
    burned: "350-500",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800"
  },
  {
    id: 2,
    name: "Lower Body Strength",
    duration: "45 min",
    burned: "200-300",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800"
  },
  {
    id: 3,
    name: "Flow Yoga for Energy",
    duration: "40 min",
    burned: "150-200",
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800"
  },
]

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Wellness Library</h1>
        <p className="text-gray-500">
          Expert-curated recipes and exercise routines to fuel your goals.
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search recipes or workouts..."
          className="pl-12 h-12 rounded-xl"
        />
      </div>

      {/* TABS */}
      <Tabs defaultValue="recipes">

        <TabsList className="mb-6">
          <TabsTrigger value="recipes">
            <Utensils className="mr-2 h-4 w-4" /> Recipes
          </TabsTrigger>
          <TabsTrigger value="exercises">
            <Dumbbell className="mr-2 h-4 w-4" /> Workouts
          </TabsTrigger>
        </TabsList>

        {/* RECIPES */}
        <TabsContent value="recipes">
          <div className="grid md:grid-cols-4 gap-6">
            {recipes.map((r) => (
              <Card key={r.id} className="overflow-hidden rounded-xl shadow hover:shadow-lg">

                <img
                  src={r.image}
                  className="w-full h-40 object-cover"
                />

                <CardContent className="p-4">
                  <h2 className="font-bold">{r.name}</h2>

                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {r.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={14} /> {r.calories} kcal
                    </span>
                  </div>

                  <Link href={`/recipes/${r.id}`}>
  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
    View Recipe
  </Button>
</Link>
                </CardContent>

              </Card>
            ))}
          </div>
        </TabsContent>

        {/* EXERCISES */}
        <TabsContent value="exercises">
          <div className="grid md:grid-cols-3 gap-6">
            {exercises.map((e) => (
              <Card key={e.id} className="overflow-hidden rounded-xl shadow hover:shadow-lg">

                <img
                  src={e.image}
                  className="w-full h-40 object-cover"
                />

                <CardContent className="p-4">
                  <h2 className="font-bold">{e.name}</h2>

                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{e.duration}</span>
                    <span>{e.burned} kcal</span>
                  </div>

                  <Button className="w-full mt-4">
                    View Workout
                  </Button>
                </CardContent>

              </Card>
            ))}
          </div>
        </TabsContent>

      </Tabs>

    </div>
  )
}
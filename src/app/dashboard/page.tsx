"use client"

import * as React from "react"
import { 
  TrendingUp, 
  Activity, 
  Utensils, 
  Flame, 
  Target,
  ArrowRight
} from "lucide-react"
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Pie,
  PieChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const calorieData = [
  { day: "Mon", consumed: 2100, goal: 2200 },
  { day: "Tue", consumed: 1950, goal: 2200 },
  { day: "Wed", consumed: 2300, goal: 2200 },
  { day: "Thu", consumed: 2150, goal: 2200 },
  { day: "Fri", consumed: 2400, goal: 2200 },
  { day: "Sat", consumed: 1800, goal: 2200 },
  { day: "Sun", consumed: 2050, goal: 2200 },
]

const weightData = [
  { date: "Oct 1", weight: 82.5 },
  { date: "Oct 8", weight: 81.8 },
  { date: "Oct 15", weight: 81.2 },
  { date: "Oct 22", weight: 80.9 },
  { date: "Oct 29", weight: 80.4 },
  { date: "Nov 5", weight: 79.8 },
]

const macroData = [
  { name: "Protein", value: 30, color: "hsl(var(--primary))" },
  { name: "Carbs", value: 45, color: "hsl(var(--accent))" },
  { name: "Fats", value: 25, color: "hsl(var(--muted-foreground))" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 py-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline">Welcome back, Alex</h1>
        <p className="text-muted-foreground">You're on track to reach your weight loss goal in 4 weeks.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
            <Flame className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,450 / 2,200</div>
            <Progress value={65} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">750 kcal remaining</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450 kcal</div>
            <p className="text-xs text-muted-foreground mt-1">Burned today (3 sessions)</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-[10px]">Yoga</Badge>
              <Badge variant="secondary" className="text-[10px]">Cycling</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79.8 kg</div>
            <p className="text-xs text-green-600 mt-1 font-medium">-0.6 kg from last week</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Logged every meal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-headline">Weekly Calorie Intake</CardTitle>
            <CardDescription>Consistency over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="consumed" radius={[4, 4, 0, 0]}>
                  {calorieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.consumed > entry.goal ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-headline">Nutrient Balance</CardTitle>
            <CardDescription>Today's macronutrient split</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 pb-6">
            <div className="flex w-full items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span>Protein (30%)</span>
              </div>
              <span className="font-bold">120g</span>
            </div>
            <div className="flex w-full items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span>Carbs (45%)</span>
              </div>
              <span className="font-bold">180g</span>
            </div>
            <div className="flex w-full items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span>Fats (25%)</span>
              </div>
              <span className="font-bold">45g</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 border-none shadow-sm">
           <CardHeader>
            <CardTitle className="text-lg font-bold font-headline">Weight Journey</CardTitle>
            <CardDescription>Progress towards your 75kg target</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-headline flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-white shadow-sm border border-primary/10">
              <p className="text-sm font-medium">Boost Morning Protein</p>
              <p className="text-xs text-muted-foreground mt-1">Your energy levels dip at 2 PM. Adding 15g more protein to breakfast may help stability.</p>
            </div>
            <div className="p-3 rounded-lg bg-white shadow-sm border border-primary/10">
              <p className="text-sm font-medium">Weekend Pattern</p>
              <p className="text-xs text-muted-foreground mt-1">Sodium intake is 40% higher on Sundays. Consider prepping a low-salt Sunday dinner.</p>
            </div>
            <Button className="w-full rounded-full group" variant="ghost">
              View Detailed Report <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Lightbulb(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

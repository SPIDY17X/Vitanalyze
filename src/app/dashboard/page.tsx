"use client"

import * as React from "react"
import { 
  TrendingUp, 
  Activity, 
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
import { Button } from "@/components/ui/button"
import { useUser, useFirestore } from "@/firebase"
import { doc, getDoc, collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  firstName: string
  lastName: string
  weight: string
  targetWeight: string
  goal: string
  activityLevel: string
}

interface FoodLog {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  day: string
  createdAt: Timestamp
}

interface ActivityLog {
  burned: number
}

const calorieGoal = 2000

export default function DashboardPage() {
  const { user } = useUser()
  const firestore = useFirestore()
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [foodLogs, setFoodLogs] = React.useState<FoodLog[]>([])
  const [weeklyData, setWeeklyData] = React.useState<any[]>([])
  const [activityLogs, setActivityLogs] = React.useState<ActivityLog[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!user) return
    const fetchAll = async () => {
      try {
        // Profile
        const docRef = doc(firestore, "users", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) setProfile(docSnap.data() as UserProfile)

        // Aaj ke food logs
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        const foodRef = collection(firestore, "users", user.uid, "foodLogs")
        const foodQ = query(foodRef, where("createdAt", ">=", Timestamp.fromDate(todayStart)), orderBy("createdAt", "desc"))
        const foodSnap = await getDocs(foodQ)
        const todayFoods = foodSnap.docs.map(d => d.data() as FoodLog)
        setFoodLogs(todayFoods)

        // Aaj ki activities
        const actRef = collection(firestore, "users", user.uid, "activityLogs")
        const actQ = query(actRef, where("createdAt", ">=", Timestamp.fromDate(todayStart)), orderBy("createdAt", "desc"))
        const actSnap = await getDocs(actQ)
        setActivityLogs(actSnap.docs.map(d => d.data() as ActivityLog))

        // Weekly data — last 7 days
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - 6)
        weekStart.setHours(0, 0, 0, 0)
        const weekFoodQ = query(foodRef, where("createdAt", ">=", Timestamp.fromDate(weekStart)), orderBy("createdAt", "asc"))
        const weekFoodSnap = await getDocs(weekFoodQ)

        // Group by day
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const weekMap: Record<string, number> = {}
        weekFoodSnap.docs.forEach(d => {
          const data = d.data()
          const date = data.createdAt.toDate()
          const dayName = days[date.getDay()]
          weekMap[dayName] = (weekMap[dayName] || 0) + (data.calories || 0)
        })

        // Last 7 days generate karo
        const last7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          const dayName = days[d.getDay()]
          return { day: dayName, consumed: Math.round(weekMap[dayName] || 0), goal: calorieGoal }
        })
        setWeeklyData(last7)

      } catch (err) {
        console.error("Dashboard load error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [user, firestore])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : user?.email?.split("@")[0] || "there"

  const currentWeight = profile?.weight ? parseFloat(profile.weight) : null
  const targetWeight = profile?.targetWeight ? parseFloat(profile.targetWeight) : null
  const weightDiff = currentWeight && targetWeight ? (targetWeight - currentWeight).toFixed(1) : null
  const isProfileComplete = profile?.firstName && profile?.weight

  // Today totals
  const totalCalories = Math.round(foodLogs.reduce((sum, f) => sum + (f.calories || 0), 0))
  const totalProtein = foodLogs.reduce((sum, f) => sum + (f.protein || 0), 0)
  const totalCarbs = foodLogs.reduce((sum, f) => sum + (f.carbs || 0), 0)
  const totalFat = foodLogs.reduce((sum, f) => sum + (f.fat || 0), 0)
  const totalBurned = Math.round(activityLogs.reduce((sum, a) => sum + (a.burned || 0), 0))
  const calorieProgress = Math.min((totalCalories / calorieGoal) * 100, 100)

  // Macro pie data
  const macroData = [
    { name: "Protein", value: totalProtein || 1, color: "hsl(var(--primary))" },
    { name: "Carbs", value: totalCarbs || 1, color: "hsl(var(--accent))" },
    { name: "Fats", value: totalFat || 1, color: "hsl(var(--muted-foreground))" },
  ]

  return (
    <div className="flex flex-col gap-8 py-6 max-w-7xl mx-auto w-full">

      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline">Welcome back, {displayName}! 👋</h1>
        <p className="text-muted-foreground">
          {isProfileComplete
            ? `Your goal: ${profile?.goal || "Not set"} ${targetWeight ? `→ ${targetWeight} kg` : ""}`
            : "Complete your profile to get personalized insights!"}
        </p>
        {!isProfileComplete && (
          <Link href="/profile">
            <Button className="mt-2 rounded-full w-fit" size="sm">
              Setup Profile <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
            <Flame className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories} / {calorieGoal}</div>
            <Progress value={calorieProgress} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {totalCalories > 0 
                ? `${Math.max(calorieGoal - totalCalories, 0)} kcal remaining`
                : "Start logging your meals!"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBurned} kcal</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBurned > 0 
                ? `Burned today (${activityLogs.length} session${activityLogs.length > 1 ? 's' : ''})`
                : "No activity logged today"}
            </p>
            {totalBurned > 0 && (
              <p className="text-xs text-primary mt-1 font-medium">
                Net: {totalCalories - totalBurned} kcal
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentWeight ? `${currentWeight} kg` : "Not set"}
            </div>
            {weightDiff && (
              <p className="text-xs text-muted-foreground mt-1">
                {parseFloat(weightDiff) > 0
                  ? `${weightDiff} kg to gain`
                  : `${Math.abs(parseFloat(weightDiff))} kg to lose`}
              </p>
            )}
            {!currentWeight && (
              <p className="text-xs text-muted-foreground mt-1">Set in Profile</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foodLogs.length > 0 ? "1 Day 🔥" : "0 Days"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {foodLogs.length > 0 ? "Keep it up!" : "Start logging to build streak!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-headline">Weekly Calorie Intake</CardTitle>
            <CardDescription>Your calorie log over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="consumed" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
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
                <span>Protein</span>
              </div>
              <span className="font-bold">{totalProtein.toFixed(1)}g</span>
            </div>
            <div className="flex w-full items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span>Carbs</span>
              </div>
              <span className="font-bold">{totalCarbs.toFixed(1)}g</span>
            </div>
            <div className="flex w-full items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span>Fats</span>
              </div>
              <span className="font-bold">{totalFat.toFixed(1)}g</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Weight Journey + AI Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-headline">Weight Journey</CardTitle>
            <CardDescription>
              {targetWeight
                ? `Progress towards your ${targetWeight}kg target`
                : "Set your target weight in Profile"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {currentWeight ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ date: "Today", weight: currentWeight }]}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
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
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-sm">No weight data yet</p>
                <Link href="/profile">
                  <Button variant="link" size="sm">Set your weight in Profile</Button>
                </Link>
              </div>
            )}
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
            {totalCalories > 0 ? (
              <>
                <div className="p-3 rounded-lg bg-white shadow-sm border border-primary/10">
                  <p className="text-sm font-medium">Today's Progress 📊</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You've consumed {totalCalories} kcal out of {calorieGoal} kcal goal. 
                    {totalCalories < calorieGoal 
                      ? ` ${calorieGoal - totalCalories} kcal remaining!`
                      : " You've hit your goal!"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white shadow-sm border border-primary/10">
                  <p className="text-sm font-medium">Goal: {profile?.goal} 🎯</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {targetWeight && currentWeight
                      ? `${Math.abs(parseFloat(weightDiff || "0"))} kg ${parseFloat(weightDiff || "0") > 0 ? "to gain" : "to lose"} to reach your target.`
                      : "Set your target weight to track progress."}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-3 rounded-lg bg-white shadow-sm border border-primary/10">
                <p className="text-sm font-medium">Start Logging! 🍽️</p>
                <p className="text-xs text-muted-foreground mt-1">Log your meals to get personalized AI insights and track your progress.</p>
              </div>
            )}
            <Link href="/insights">
              <Button className="w-full rounded-full group" variant="ghost">
                View Detailed Report <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
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
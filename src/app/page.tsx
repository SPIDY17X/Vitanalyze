import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, ArrowRight, Activity, Brain, Utensils } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-primary tracking-tight">Vitanalyze</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/dashboard">Dashboard</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/resources">Library</Link>
        </nav>
        <Button asChild className="rounded-full px-6">
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-6">
          <div className="container mx-auto">
            <div className="grid gap-12 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-block rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-primary">
                    AI-Powered Personal Wellness
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-7xl/none font-headline text-foreground leading-[1.1]">
                    Your Journey to <span className="text-primary italic">Vibrant Health</span> Starts Here
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Personalized meal plans, AI coaching, and comprehensive health tracking tailored specifically to your unique biometrics and goals.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button size="lg" className="rounded-full text-lg px-8 h-14" asChild>
                    <Link href="/dashboard">Start Your Plan <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full text-lg px-8 h-14" asChild>
                    <Link href="/profile">Setup Profile</Link>
                  </Button>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                <img
                  alt="Healthy Living"
                  className="aspect-video object-cover"
                  src="https://picsum.photos/seed/vitanalyze1/1200/800"
                  data-ai-hint="healthy lifestyle"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-[800px] mx-auto">Vitanalyze combines cutting-edge AI with nutrition science to help you reach your peak performance.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "AI Meal Planner",
                  description: "Chef-quality recipes and full meal plans generated specifically for your dietary needs.",
                  icon: Utensils,
                },
                {
                  title: "Smart Tracking",
                  description: "Log food and activities with ease. Get instant macronutrient and calorie breakdowns.",
                  icon: Activity,
                },
                {
                  title: "AI Coaching",
                  description: "Personalized insights that identify patterns in your habits and offer actionable advice.",
                  icon: Brain,
                },
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-card border hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-12 px-6 bg-card">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-primary">Vitanalyze</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Vitanalyze AI Health Coach. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">Terms</Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

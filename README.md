# Vitanalyze | AI Health Coach

Vitanalyze is a personalized wellness platform that leverages AI to generate custom meal and exercise plans based on your unique biometrics and goals.

## Features

- **AI Meal Planner**: Personalized recipes and 7-day nutritional schedules.
- **AI Exercise Planner**: Targeted workout routines based on your activity level.
- **Coaching Insights**: Deep analysis of your habits with actionable growth tips.
- **Daily Logging**: Track food intake and physical activity in real-time.
- **Biometric Progress**: Monitor weight and body metrics with visual charts.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **AI**: Genkit (Google Gemini)
- **Backend**: Firebase (Auth & Firestore)
- **Icons**: Lucide React

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) to see the app.

## How to push to GitHub

1. **Create a new repository on GitHub**: Go to [github.com/new](https://github.com/new) and create a repository (empty).
2. **Initialize local repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. **Connect and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Deployment

This project is optimized for **Firebase App Hosting**. Simply connect your GitHub repository to Firebase App Hosting in the Firebase Console for automatic deployments.

# Vitanalyze | AI Health Coach

This is a Next.js 15 application built with React, ShadCN UI, and Genkit for AI-powered health coaching. It integrates with Firebase for Authentication and Firestore for data storage.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Making this available on GitHub

To put this project on GitHub, follow these steps:

1. **Create a new repository on GitHub**: Go to [github.com/new](https://github.com/new) and create a repository (don't initialize it with a README or License).
2. **Initialize local repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from Firebase Studio"
   ```
3. **Connect and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/ai`: Genkit flows for AI coaching and planning.
- `src/firebase`: Firebase configuration and client-side SDK wrappers.
- `components/ui`: Reusable ShadCN UI components.

## Deployment

This project is configured for **Firebase App Hosting**. When you push to GitHub, you can connect your repository to Firebase App Hosting for automatic builds and deployments.

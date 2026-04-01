'use server';
/**
 * @fileOverview An AI agent that generates personalized daily and weekly meal plans with recipes and exercise routines.
 *
 * - generateMealExercisePlan - A function that handles the meal and exercise plan generation process.
 * - AIMealExercisePlannerInput - The input type for the generateMealExercisePlan function.
 * - AIMealExercisePlannerOutput - The return type for the generateMealExercisePlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IngredientSchema = z.object({
  name: z.string().describe('Name of the ingredient.'),
  quantity: z.string().describe('Quantity and unit of the ingredient (e.g., "1 cup", "2 large").'),
});

const RecipeSchema = z.object({
  recipeName: z.string().describe('Name of the recipe.'),
  description: z.string().optional().describe('A brief description of the recipe.'),
  ingredients: z.array(IngredientSchema).describe('List of ingredients with quantities.'),
  instructions: z.array(z.string()).describe('Step-by-step cooking instructions.'),
  prepTimeMinutes: z.number().int().positive().optional().describe('Preparation time in minutes.'),
  cookTimeMinutes: z.number().int().positive().optional().describe('Cook time in minutes.'),
  calories: z.number().optional().describe('Estimated calories per serving.'),
  proteinGrams: z.number().optional().describe('Estimated protein in grams per serving.'),
  carbsGrams: z.number().optional().describe('Estimated carbohydrates in grams per serving.'),
  fatGrams: z.number().optional().describe('Estimated fat in grams per serving.'),
});

const MealSchema = z.object({
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other']).describe('Type of meal.'),
  recipe: RecipeSchema.describe('Details of the recipe for this meal.'),
});

const ExerciseSchema = z.object({
  exerciseName: z.string().describe('Name of the exercise.'),
  description: z.string().describe('Detailed description or instructions for the exercise.'),
  sets: z.number().int().positive().optional().describe('Number of sets.'),
  reps: z.number().int().positive().optional().describe('Number of repetitions per set.'),
  durationMinutes: z.number().int().positive().optional().describe('Duration of the exercise in minutes.'),
  intensity: z.enum(['low', 'moderate', 'high']).optional().describe('Intensity level of the exercise.'),
  targetMuscleGroups: z.array(z.string()).optional().describe('Muscle groups targeted by the exercise.'),
});

const DailyPlanSchema = z.object({
  day: z.string().describe('Day of the week (e.g., "Monday").'),
  date: z.string().optional().describe('Specific date for the plan (e.g., "2024-07-29").'),
  mealPlan: z.array(MealSchema).describe('List of meals for the day.'),
  exerciseRoutine: z.array(ExerciseSchema).describe('List of exercises for the day.'),
  dailySummary: z.string().describe('A brief summary of the daily plan, including calorie and macro goals for the day.'),
});

const AIMealExercisePlannerInputSchema = z.object({
  healthGoals: z.array(z.string()).describe('User\'s health goals (e.g., "lose weight", "build muscle", "maintain health").'),
  dietaryPreferences: z.array(z.string()).describe('User\'s dietary preferences (e.g., "vegetarian", "vegan", "pescatarian", "keto").'),
  dietaryRestrictions: z.array(z.string()).describe('User\'s dietary restrictions or allergies (e.g., "gluten-free", "lactose intolerant", "nut allergy").'),
  activityLevel: z.enum(['sedentary', 'lightly active', 'moderately active', 'very active', 'extra active']).describe('User\'s activity level.'),
  currentWeightKg: z.number().positive().describe('User\'s current weight in kilograms.'),
  targetWeightKg: z.number().positive().optional().describe('User\'s target weight in kilograms.'),
  heightCm: z.number().positive().describe('User\'s height in centimeters.'),
  age: z.number().int().positive().describe('User\'s age.'),
  gender: z.enum(['male', 'female', 'other']).describe('User\'s gender.'),
  currentExerciseRoutineDescription: z.string().optional().describe('Description of user\'s current exercise routine.'),
  currentMealPlanDescription: z.string().optional().describe('Description of user\'s current meal plan.'),
  weeklyCalorieTarget: z.number().int().positive().optional().describe('Specific weekly calorie target if provided by the user.'),
  dailyCalorieTarget: z.number().int().positive().optional().describe('Specific daily calorie target if provided by the user.'),
  additionalNotes: z.string().optional().describe('Any additional notes or preferences from the user.'),
});

export type AIMealExercisePlannerInput = z.infer<typeof AIMealExercisePlannerInputSchema>;

const AIMealExercisePlannerOutputSchema = z.object({
  weeklyPlan: z.array(DailyPlanSchema).length(7).describe('A full 7-day personalized meal and exercise plan.'),
  overallSummary: z.string().describe('An overall summary and advice for the weekly plan.'),
});

export type AIMealExercisePlannerOutput = z.infer<typeof AIMealExercisePlannerOutputSchema>;

export async function generateMealExercisePlan(input: AIMealExercisePlannerInput): Promise<AIMealExercisePlannerOutput> {
  return aiMealExercisePlannerFlow(input);
}

const aiMealExercisePlannerPrompt = ai.definePrompt({
  name: 'aiMealExercisePlannerPrompt',
  input: { schema: AIMealExercisePlannerInputSchema },
  output: { schema: AIMealExercisePlannerOutputSchema },
  prompt: `You are Vitanalyze, an AI health and nutrition coach. Your task is to create a personalized 7-day meal plan with recipes and an exercise routine for the user.

Consider the following user profile and goals:

Health Goals: {{{healthGoals}}}
Dietary Preferences: {{{dietaryPreferences}}}
Dietary Restrictions: {{{dietaryRestrictions}}}
Activity Level: {{{activityLevel}}}
Current Weight: {{{currentWeightKg}}} kg
{{#if targetWeightKg}}Target Weight: {{{targetWeightKg}}} kg{{/if}}
Height: {{{heightCm}}} cm
Age: {{{age}}}
Gender: {{{gender}}}
{{#if currentExerciseRoutineDescription}}Current Exercise Routine: {{{currentExerciseRoutineDescription}}}{{/if}}
{{#if currentMealPlanDescription}}Current Meal Plan: {{{currentMealPlanDescription}}}{{/if}}
{{#if weeklyCalorieTarget}}Weekly Calorie Target: {{{weeklyCalorieTarget}}} calories{{/if}}
{{#if dailyCalorieTarget}}Daily Calorie Target: {{{dailyCalorieTarget}}} calories{{/if}}
{{#if additionalNotes}}Additional Notes: {{{additionalNotes}}}{{/if}}

Based on this information, generate a detailed 7-day plan. Each day should include:
- A complete meal plan (Breakfast, Lunch, Dinner, Snacks if appropriate) with specific recipes. For each recipe, provide the recipe name, a short description, ingredients with quantities, step-by-step instructions, and estimated nutritional information (calories, protein, carbs, fat per serving).
- An exercise routine with specific exercises. For each exercise, provide the name, a detailed description, sets, reps, duration (if applicable), intensity, and target muscle groups.
- A daily summary including calorie and macro goals for that day, and how the plan aligns with the user's overall goals.

Ensure the plan is realistic, balanced, and strictly adheres to all dietary preferences and restrictions. If a calorie target is provided, try to stay within 10% of that target. Prioritize achievable and sustainable routines.

Finally, provide an overall summary and actionable advice for the entire weekly plan, emphasizing how it helps the user achieve their health goals.

Please provide the output in the specified JSON format.`,
});

const aiMealExercisePlannerFlow = ai.defineFlow(
  {
    name: 'aiMealExercisePlannerFlow',
    inputSchema: AIMealExercisePlannerInputSchema,
    outputSchema: AIMealExercisePlannerOutputSchema,
  },
  async (input) => {
    const { output } = await aiMealExercisePlannerPrompt(input);
    return output!;
  },
);

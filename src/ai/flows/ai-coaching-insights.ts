'use server';
/**
 * @fileOverview A Genkit flow for providing personalized AI coaching insights based on user's logged health data.
 *
 * - aiCoachingInsights - A function that handles the AI coaching insights generation process.
 * - AICoachingInsightsInput - The input type for the aiCoachingInsights function.
 * - AICoachingInsightsOutput - The return type for the aiCoachingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AICoachingInsightsInputSchema = z.object({
  healthGoals: z
    .array(z.string())
    .describe('User\'s primary health and fitness goals (e.g., "weight loss", "muscle gain", "improve energy").'),
  dietaryPreferences: z
    .array(z.string())
    .describe('User\'s dietary preferences (e.g., "vegetarian", "low-carb", "high-protein").'),
  restrictions: z
    .array(z.string())
    .describe('User\'s food allergies, intolerances, or dietary restrictions (e.g., "lactose intolerant", "gluten-free").'),
  activityLevel: z
    .string()
    .describe('User\'s general activity level (e.g., "sedentary", "moderately active", "very active").'),
  loggedFoodData: z
    .string()
    .describe(
      'A JSON string representing an array of logged food entries. Each object should contain: ' +
        '{ "item": string, "quantity": string, "calories": number, "proteinGrams": number, ' +
        '"carbsGrams": number, "fatGrams": number, "date": string (ISO 8601 date string) }'
    ),
  loggedActivityData: z
    .string()
    .describe(
      'A JSON string representing an array of logged activity entries. Each object should contain: ' +
        '{ "activityType": string, "durationMinutes": number, "intensity": string, ' +
        '"caloriesBurned": number, "date": string (ISO 8601 date string) }'
    ),
});
export type AICoachingInsightsInput = z.infer<typeof AICoachingInsightsInputSchema>;

// Output Schema
const AICoachingInsightsOutputSchema = z.object({
  feedbackSummary: z
    .string()
    .describe('A concise, encouraging summary of the user\'s overall performance and progress.'),
  patternsIdentified: z
    .array(z.string())
    .describe('A list of key patterns or trends observed in the logged data (e.g., "consistent protein intake", "late-night snacking on weekends", "skipping breakfast").'),
  actionableAdvice: z
    .array(z.string())
    .describe('Specific, personalized, and actionable advice to help the user optimize their health and nutrition.'),
  suggestions: z
    .array(z.string())
    .describe('Concrete suggestions such as recipe ideas, exercise modifications, or habit-forming strategies.'),
});
export type AICoachingInsightsOutput = z.infer<typeof AICoachingInsightsOutputSchema>;

// Prompt Definition
const aiCoachingInsightsPrompt = ai.definePrompt({
  name: 'aiCoachingInsightsPrompt',
  input: { schema: AICoachingInsightsInputSchema },
  output: { schema: AICoachingInsightsOutputSchema },
  prompt: `You are an AI-powered personalized health and nutrition coach named Vitanalyze. Your goal is to analyze the user's logged food and activity data, identify patterns, provide insightful feedback, and offer actionable advice to help them achieve their health goals.\n\nUser Profile:\n- Health Goals: {{{healthGoals}}}\n- Dietary Preferences: {{{dietaryPreferences}}}\n- Restrictions: {{{restrictions}}}\n- Activity Level: {{{activityLevel}}}\n\nLogged Food Data (JSON Array):\n{{{loggedFoodData}}}\n\nLogged Activity Data (JSON Array):\n{{{loggedActivityData}}}\n\nBased on the provided user profile and logged data, perform the following:\n1.  **Analyze** the food and activity data in relation to the user's health goals, dietary preferences, and restrictions.\n2.  **Identify** any positive or negative patterns, trends, or areas for improvement in their nutrition and activity habits.\n3.  **Provide** a concise and encouraging feedback summary.\n4.  **Offer** specific, actionable advice.\n5.  **Suggest** concrete ideas (e.g., recipe types, exercise modifications, habit changes).\n\nEnsure your output strictly adheres to the AICoachingInsightsOutputSchema structure.`,
});

// Flow Definition
const aiCoachingInsightsFlow = ai.defineFlow(
  {
    name: 'aiCoachingInsightsFlow',
    inputSchema: AICoachingInsightsInputSchema,
    outputSchema: AICoachingInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await aiCoachingInsightsPrompt(input);
    if (!output) {
      throw new Error('AI Coaching Insights prompt failed to return output.');
    }
    return output;
  },
);

// Wrapper Function
export async function aiCoachingInsights(
  input: AICoachingInsightsInput,
): Promise<AICoachingInsightsOutput> {
  return aiCoachingInsightsFlow(input);
}

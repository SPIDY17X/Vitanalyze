'use server'

import { ai } from '@/ai/genkit'
import { z } from 'zod'

export async function getNutritionInfo(foodName: string, quantity: string) {
  try {
    const response = await ai.generate({
      prompt: `You are a professional nutritionist with access to accurate food databases (USDA, WHO standards).

Calculate the exact nutritional values for: "${quantity} of ${foodName}"

Rules:
- Use standard, scientifically accurate nutritional data
- Calculate based on the EXACT quantity given
- Round all values to 1 decimal place
- Return ONLY raw JSON, no explanation, no markdown

Return this exact JSON format:
{
  "calories": <number>,
  "protein": <number>,
  "carbs": <number>,
  "fat": <number>,
  "fiber": <number>
}`,
    })

    const text = response.text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(text)
    
    return { 
      success: true, 
      data: {
        calories: parseFloat(data.calories) || 0,
        protein: parseFloat(data.protein) || 0,
        carbs: parseFloat(data.carbs) || 0,
        fat: parseFloat(data.fat) || 0,
        fiber: parseFloat(data.fiber) || 0,
      }
    }
  } catch (err) {
    console.error('Nutrition lookup error:', err)
    return { success: false, data: null }
  }
}
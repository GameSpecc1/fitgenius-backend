// src/ai/flows/generate-macro-recommendations.ts
'use server';
/**
 * @fileOverview Generates personalized macro recommendations based on user input.
 *
 * - generateMacroRecommendations - A function that generates macro recommendations.
 * - MacroRecommendationsInput - The input type for the generateMacroRecommendations function.
 * - MacroRecommendationsOutput - The return type for the generateMacroRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MacroRecommendationsInputSchema = z.object({
  bodyComposition: z
    .string()
    .describe(
      'User body composition details including weight, height, age, gender, and body fat percentage.'
    ),
  activityLevel: z
    .string()
    .describe(
      'The activity level of the user including sedentary, lightly active, moderately active, very active, or extra active.'
    ),
  fitnessGoals: z
    .string()
    .describe(
      'The fitness goals of the user including muscle growth, fat loss, or overall health.'
    ),
});
export type MacroRecommendationsInput = z.infer<typeof MacroRecommendationsInputSchema>;

const MacroRecommendationsOutputSchema = z.object({
  protein: z.string().describe('Recommended daily protein intake in grams.'),
  carbs: z.string().describe('Recommended daily carbohydrate intake in grams.'),
  fats: z.string().describe('Recommended daily fat intake in grams.'),
  calories: z.string().describe('Recommended daily calorie intake.'),
  notes: z
    .string()
    .describe(
      'Additional notes and considerations for the user regarding their macro recommendations.'
    ),
});
export type MacroRecommendationsOutput = z.infer<typeof MacroRecommendationsOutputSchema>;

export async function generateMacroRecommendations(
  input: MacroRecommendationsInput
): Promise<MacroRecommendationsOutput> {
  return generateMacroRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'macroRecommendationsPrompt',
  input: {schema: MacroRecommendationsInputSchema},
  output: {schema: MacroRecommendationsOutputSchema},
  prompt: `You are a nutrition and fitness expert. Based on the user's body composition, activity level, and fitness goals, provide personalized macro recommendations (protein, carbs, fats) and calorie recommendations.

  Body Composition: {{{bodyComposition}}}
  Activity Level: {{{activityLevel}}}
  Fitness Goals: {{{fitnessGoals}}}

  Follow the output schema to return the values.
  Provide the macro recommendations in grams.
  Include any additional notes and considerations for the user regarding their macro recommendations.`,
});

const generateMacroRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateMacroRecommendationsFlow',
    inputSchema: MacroRecommendationsInputSchema,
    outputSchema: MacroRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

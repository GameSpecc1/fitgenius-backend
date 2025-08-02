'use server';

/**
 * @fileOverview AI meal suggestion flow.
 *
 * - suggestMeals - A function that handles the meal suggestion process.
 * - SuggestMealsInput - The input type for the suggestMeals function.
 * - SuggestMealsOutput - The return type for the suggestMeals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMealsInputSchema = z.object({
  dietaryPreferences: z
    .string()
    .describe('The dietary preferences of the user (e.g., vegetarian, vegan, gluten-free).'),
  caloricNeeds: z.number().describe('The daily caloric needs of the user.'),
  macroGoals: z
    .string()
    .describe('The macro goals of the user (e.g., high protein, low carb).'),
});
export type SuggestMealsInput = z.infer<typeof SuggestMealsInputSchema>;

const SuggestMealsOutputSchema = z.object({
  mealSuggestions: z
    .array(z.string())
    .describe('An array of meal suggestions tailored to the user.'),
});
export type SuggestMealsOutput = z.infer<typeof SuggestMealsOutputSchema>;

export async function suggestMeals(input: SuggestMealsInput): Promise<SuggestMealsOutput> {
  return suggestMealsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMealsPrompt',
  input: {schema: SuggestMealsInputSchema},
  output: {schema: SuggestMealsOutputSchema},
  prompt: `You are a nutritionist providing meal suggestions based on user preferences and goals.

  Provide a list of meal suggestions tailored to the user's dietary preferences, caloric needs, and macro goals.

  Dietary Preferences: {{{dietaryPreferences}}}
  Caloric Needs: {{{caloricNeeds}}}
  Macro Goals: {{{macroGoals}}}

  Meal Suggestions:`,
});

const suggestMealsFlow = ai.defineFlow(
  {
    name: 'suggestMealsFlow',
    inputSchema: SuggestMealsInputSchema,
    outputSchema: SuggestMealsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

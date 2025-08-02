'use server';

/**
 * @fileOverview A fitness chatbot AI agent.
 *
 * - fitnessChatbot - A function that handles the fitness chatbot process.
 * - FitnessChatbotInput - The input type for the fitnessChatbot function.
 * - FitnessChatbotOutput - The return type for the fitnessChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FitnessChatbotInputSchema = z.object({
  query: z.string().describe('The user query about fitness.'),
  personalSettings: z.string().optional().describe('User personal settings like age, weight, height, gender, activity level, fitness goals.'),
  pastInteractions: z.string().optional().describe('Summary of past interactions with the chatbot.'),
});
export type FitnessChatbotInput = z.infer<typeof FitnessChatbotInputSchema>;

const FitnessChatbotOutputSchema = z.object({
  response: z.string().describe('The response from the fitness chatbot.'),
});
export type FitnessChatbotOutput = z.infer<typeof FitnessChatbotOutputSchema>;

export async function fitnessChatbot(input: FitnessChatbotInput): Promise<FitnessChatbotOutput> {
  return fitnessChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fitnessChatbotPrompt',
  input: {schema: FitnessChatbotInputSchema},
  output: {schema: FitnessChatbotOutputSchema},
  prompt: `You are a fitness chatbot providing real-time, personalized advice to users.

  Your responses should be concise and helpful, and tailored to the user's specific circumstances.

  Consider the following information when formulating your response:

  Personal Settings: {{{personalSettings}}}
  Past Interactions: {{{pastInteractions}}}

  User Query: {{{query}}}`,
});

const fitnessChatbotFlow = ai.defineFlow(
  {
    name: 'fitnessChatbotFlow',
    inputSchema: FitnessChatbotInputSchema,
    outputSchema: FitnessChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

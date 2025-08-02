'use server';

/**
 * @fileOverview A workout plan generator AI agent.
 *
 * - generateWorkoutPlan - A function that handles the workout plan generation process.
 * - GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutPlanOutput - The return type for the generateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('The fitness goals of the user (e.g., weight loss, muscle gain, general fitness).'),
  experienceLevel: z
    .string()
    .describe('The experience level of the user (e.g., beginner, intermediate, advanced).'),
  availableEquipment: z
    .string()
    .describe('The equipment available to the user (e.g., dumbbells, barbell, gym access, none).'),
  workoutDuration: z
    .string()
    .describe('The duration of each workout session in minutes (e.g., 30 minutes, 45 minutes, 1 hour).'),
  workoutFrequency: z
    .string()
    .describe('How many days per week the user can workout (e.g., 3 days, 4 days, 5 days).'),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The generated workout plan as a string.'),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are an expert fitness coach specializing in creating personalized workout plans.

You will use the information provided by the user to generate a workout plan tailored to their specific needs and goals.

Consider the user's fitness goals, experience level, available equipment, workout duration, and workout frequency when creating the plan.

Fitness Goals: {{{fitnessGoals}}}
Experience Level: {{{experienceLevel}}}
Available Equipment: {{{availableEquipment}}}
Workout Duration: {{{workoutDuration}}}
Workout Frequency: {{{workoutFrequency}}}

Generate a detailed workout plan that the user can follow.
`, 
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

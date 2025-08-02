import { config } from 'dotenv';
config();

import '@/ai/flows/fitness-chatbot.ts';
import '@/ai/flows/generate-workout-plan.ts';
import '@/ai/flows/suggest-meals.ts';
import '@/ai/flows/identify-equipment.ts';
import '@/ai/flows/generate-macro-recommendations.ts';
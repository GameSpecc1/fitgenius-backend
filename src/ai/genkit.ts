import {genkit} from 'genkit';
import {vertexAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [vertexAI({location: 'us-central1'})],
  model: 'googleai/gemini-2.0-flash',
});

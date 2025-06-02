import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import nextPlugin from '@genkit-ai/next'; // Import the plugin (attempting as default import)

export const ai = genkit({
  plugins: [
    googleAI(),
    nextPlugin(), // Add the plugin
  ],
  model: 'googleai/gemini-2.0-flash',
});

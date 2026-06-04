import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
});

/**
 * Standard model references for use throughout the app.
 */
export const gemini15Flash = googleAI.model('gemini-1.5-flash');

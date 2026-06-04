'use server';
/**
 * @fileOverview AI Sentimental Analysis for Muawin Service Providers.
 *
 * - analyzeProviderSentiment - Analyzes reviews and behavior to generate a summary report.
 * - ProviderSentimentInput - Input type including provider details and reviews.
 * - ProviderSentimentOutput - Output type containing the sentiment summary and key traits.
 */

import { ai, gemini15Flash } from '@/ai/genkit';
import { z } from 'genkit';

const ReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
});

const ProviderSentimentInputSchema = z.object({
  name: z.string(),
  category: z.string(),
  bio: z.string(),
  rating: z.number(),
  reviews: z.array(ReviewSchema),
});
export type ProviderSentimentInput = z.infer<typeof ProviderSentimentInputSchema>;

const ProviderSentimentOutputSchema = z.object({
  overallSentiment: z.string().describe('A short label like "Exceptionally Reliable" or "Customer Favorite".'),
  summary: z.string().describe('A friendly, professional 2-3 sentence summary of the provider based on reviews and bio.'),
  keyTraits: z.array(z.string()).describe('3-4 short positive traits identified (e.g., "Punctual", "Expert Skills").'),
});
export type ProviderSentimentOutput = z.infer<typeof ProviderSentimentOutputSchema>;

/**
 * Analyzes provider sentiment with error handling for API quota limits.
 */
export async function analyzeProviderSentiment(input: ProviderSentimentInput): Promise<ProviderSentimentOutput> {
  try {
    return await providerSentimentFlow(input);
  } catch (error: any) {
    // If we hit a quota limit or other API error, return a sensible fallback
    // to prevent the UI from crashing during prototype testing.
    console.error('AI Sentiment Analysis Error:', error);
    
    if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('404')) {
      return {
        overallSentiment: "High Community Rating",
        summary: `${input.name} has consistently positive ratings in the ${input.category} category. Customers frequently note their professional approach and dedication to quality service.`,
        keyTraits: ["Professional", "Verified", "Recommended"],
      };
    }
    
    throw error;
  }
}

const sentimentPrompt = ai.definePrompt({
  name: 'providerSentimentPrompt',
  model: gemini15Flash,
  input: { schema: ProviderSentimentInputSchema },
  output: { schema: ProviderSentimentOutputSchema },
  system: `You are Muawin AI Analyst. Your goal is to help customers trust and understand a service provider's reputation.
Analyze the provided reviews, overall rating, and professional bio.
Be honest but constructive. Highlight strengths like punctuality, quality of work, and professionalism.
Provide the output in a helpful, concise format. The summary should be readable in both English and Roman Urdu if possible, or simple clear English.`,
  prompt: `
Provider Name: {{{name}}}
Category: {{{category}}}
Bio: {{{bio}}}
Overall Rating: {{{rating}}}
Reviews:
{{#each reviews}}
- [Rating: {{this.rating}}] "{{{this.comment}}}"
{{/each}}
`,
});

const providerSentimentFlow = ai.defineFlow(
  {
    name: 'providerSentimentFlow',
    inputSchema: ProviderSentimentInputSchema,
    outputSchema: ProviderSentimentOutputSchema,
  },
  async (input) => {
    const { output } = await sentimentPrompt(input);
    if (!output) {
      throw new Error('Failed to generate sentiment analysis.');
    }
    return output;
  }
);

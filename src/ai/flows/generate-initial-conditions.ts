'use server';

/**
 * @fileOverview Flow to generate initial conditions for fluid flow simulation.
 *
 * - generateInitialConditions - A function that generates initial velocity and pressure fields based on a text prompt.
 * - GenerateInitialConditionsInput - The input type for the generateInitialConditions function.
 * - GenerateInitialConditionsOutput - The return type for the generateInitialConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialConditionsInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired initial fluid state.'),
});
export type GenerateInitialConditionsInput = z.infer<typeof GenerateInitialConditionsInputSchema>;

const GenerateInitialConditionsOutputSchema = z.object({
  initialConditionImage: z
    .string()
    .describe(
      'A data URI of an image representing the generated initial velocity and pressure fields.'
    ),
});
export type GenerateInitialConditionsOutput = z.infer<typeof GenerateInitialConditionsOutputSchema>;

export async function generateInitialConditions(
  input: GenerateInitialConditionsInput
): Promise<GenerateInitialConditionsOutput> {
  return generateInitialConditionsFlow(input);
}

const generateInitialConditionsPrompt = ai.definePrompt({
  name: 'generateInitialConditionsPrompt',
  input: {schema: GenerateInitialConditionsInputSchema},
  output: {schema: GenerateInitialConditionsOutputSchema},
  prompt: `You are an expert in computational fluid dynamics. Generate an image that visually represents the initial conditions for a fluid flow simulation based on the following description: {{{prompt}}}. The image should clearly show the velocity and pressure fields. Return the image as a data URI.`,
});

const generateInitialConditionsFlow = ai.defineFlow(
  {
    name: 'generateInitialConditionsFlow',
    inputSchema: GenerateInitialConditionsInputSchema,
    outputSchema: GenerateInitialConditionsOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: input.prompt,
      model: 'googleai/imagen-4.0-fast-generate-001',
    });

    if (!media?.url) {
      throw new Error('Failed to generate initial condition image.');
    }

    return {initialConditionImage: media.url};
  }
);

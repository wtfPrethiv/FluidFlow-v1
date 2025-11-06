'use server';
/**
 * @fileOverview This file defines a Genkit flow to analyze and explain discrepancies in physics-informed losses during PINN training for fluid flow simulation.
 *
 * - explainPhysicsDiscrepancies - A function that takes loss data and simulation parameters, and returns an explanation of any discrepancies.
 * - ExplainPhysicsDiscrepanciesInput - The input type for the explainPhysicsDiscrepancies function.
 * - ExplainPhysicsDiscrepanciesOutput - The return type for the explainPhysicsDiscrepancies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainPhysicsDiscrepanciesInputSchema = z.object({
  lossData: z.record(z.string(), z.number()).describe('A record of loss values for each component of the physics-informed loss function, such as continuity and momentum.'),
  simulationParameters: z.object({
    reynoldsNumber: z.number().describe('The Reynolds number of the fluid flow.'),
    kinematicViscosity: z.number().describe('The kinematic viscosity of the fluid.'),
    fluidDensity: z.number().describe('The density of the fluid.'),
    geometry: z.string().describe('A description of the simulation geometry, including any obstacles.'),
    boundaryConditions: z.string().describe('A description of the boundary conditions applied to the simulation.'),
  }).describe('The parameters used to configure the fluid flow simulation.'),
  historicalFlowStates: z.string().describe('The historical flow states as a stringified tensor.'),
});
export type ExplainPhysicsDiscrepanciesInput = z.infer<typeof ExplainPhysicsDiscrepanciesInputSchema>;

const ExplainPhysicsDiscrepanciesOutputSchema = z.object({
  explanation: z.string().describe('An explanation of any discrepancies or unexpected scenarios in the physics-informed losses, including potential causes and suggestions for refinement.'),
});
export type ExplainPhysicsDiscrepanciesOutput = z.infer<typeof ExplainPhysicsDiscrepanciesOutputSchema>;

export async function explainPhysicsDiscrepancies(input: ExplainPhysicsDiscrepanciesInput): Promise<ExplainPhysicsDiscrepanciesOutput> {
  return explainPhysicsDiscrepanciesFlow(input);
}

const explainPhysicsDiscrepanciesPrompt = ai.definePrompt({
  name: 'explainPhysicsDiscrepanciesPrompt',
  input: {schema: ExplainPhysicsDiscrepanciesInputSchema},
  output: {schema: ExplainPhysicsDiscrepanciesOutputSchema},
  prompt: `You are an expert in computational fluid dynamics and Physics-Informed Neural Networks (PINNs). Your task is to analyze the physics-informed losses during PINN training for fluid flow simulation and explain any discrepancies or unexpected scenarios.

  Here's the data you have:

  Loss Data:
  {{#each lossData}} - {{@key}}: {{this}}
  {{/each}}

  Simulation Parameters:
  - Reynolds Number: {{simulationParameters.reynoldsNumber}}
  - Kinematic Viscosity: {{simulationParameters.kinematicViscosity}}
  - Fluid Density: {{simulationParameters.fluidDensity}}
  - Geometry: {{simulationParameters.geometry}}
  - Boundary Conditions: {{simulationParameters.boundaryConditions}}

  Historical Flow States:
  {{{historicalFlowStates}}}

  Based on this information, provide a detailed explanation of any discrepancies or unexpected scenarios in the physics-informed losses. Consider potential causes such as:
  - Imbalances in the loss terms (e.g., adversarial loss dominating reconstruction loss).
  - Violations of physical constraints (e.g., continuity equation not being satisfied).
  - Sensitivity to simulation parameters (e.g., Reynolds number).
  - Inadequate network architecture or training data.

  Also, suggest possible refinements to the simulation setup, such as:
  - Adjusting the weights of the loss terms.
  - Improving the network architecture.
  - Increasing the size or quality of the training data.
  - Modifying the boundary conditions or simulation geometry.

  Your explanation should be clear, concise, and actionable.
  `,
});

const explainPhysicsDiscrepanciesFlow = ai.defineFlow(
  {
    name: 'explainPhysicsDiscrepanciesFlow',
    inputSchema: ExplainPhysicsDiscrepanciesInputSchema,
    outputSchema: ExplainPhysicsDiscrepanciesOutputSchema,
  },
  async input => {
    const {output} = await explainPhysicsDiscrepanciesPrompt(input);
    return output!;
  }
);

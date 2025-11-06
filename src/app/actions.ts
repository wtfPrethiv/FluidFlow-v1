'use server';

import { explainPhysicsDiscrepancies } from '@/ai/flows/explain-physics-discrepancies';
import { MOCK_LOSS_DATA } from '@/lib/constants';
import type { Geometry, SimulationParameters } from '@/lib/types';
import { z } from 'zod';

const generateSchema = z.object({
  reynoldsNumber: z.number(),
  kinematicViscosity: z.number(),
  fluidDensity: z.number(),
});

export async function handleGenerateFlow(
  params: SimulationParameters
) {
  const validatedFields = generateSchema.safeParse({
    reynoldsNumber: params.reynoldsNumber,
    kinematicViscosity: params.kinematicViscosity,
    fluidDensity: params.fluidDensity,
  });

  if (!validatedFields.success) {
    return { error: 'Invalid simulation parameters.' };
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${backendUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reynolds: validatedFields.data.reynoldsNumber,
            kinematicViscosity: validatedFields.data.kinematicViscosity,
            fluidDensity: validatedFields.data.fluidDensity,
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error occurred" }));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (!result || !result.streamline_image || !result.pressure_image) {
        throw new Error("Failed to get streamline and pressure images from API.");
    }
    
    const streamlineUrl = `data:image/png;base64,${result.streamline_image}`;
    const pressureUrl = `data:image/png;base64,${result.pressure_image}`;

    return { data: { streamline: streamlineUrl, pressure: pressureUrl } };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || 'Failed to generate flow. Is the backend server running?' };
  }
}

const explainSchema = z.object({
    simulationParameters: z.any(),
    geometry: z.any(),
});

export async function handleExplainDiscrepancies(currentState: {
    simulationParameters: SimulationParameters,
    geometry: Geometry
}) {
    const validatedState = explainSchema.safeParse(currentState);

    if (!validatedState.success) {
        return { error: 'Invalid simulation state provided.' };
    }

    const { simulationParameters, geometry } = validatedState.data;

    // In a real app, historicalFlowStates would be a complex tensor.
    // For this scaffold, we'll stringify the geometry as a proxy.
    const historicalFlowStates = JSON.stringify(geometry.map(row => row.map(cell => cell.type.charAt(0)).join('')));

    try {
        const result = await explainPhysicsDiscrepancies({
            lossData: MOCK_LOSS_DATA,
            simulationParameters: {
              ...simulationParameters,
              geometry: "Custom user-defined grid",
              boundaryConditions: "Defined by geometry map"
            },
            historicalFlowStates,
        });
        if (!result || !result.explanation) {
            throw new Error("Failed to get explanation from AI.");
        }
        return { data: result.explanation };
    } catch(error) {
        console.error(error);
        return { error: 'Failed to analyze discrepancies. Please try again.' };
    }
}

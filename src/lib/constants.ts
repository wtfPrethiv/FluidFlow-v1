import type { BoundaryCondition, Geometry, SimulationParameters } from './types';

export const DEFAULT_SIMULATION_PARAMETERS: SimulationParameters = {
  reynoldsNumber: 200,
  kinematicViscosity: 0.01,
  fluidDensity: 1.225,
};

export const GRID_WIDTH = 32;
export const GRID_HEIGHT = 24;

export const createInitialGeometry = (width: number, height: number): Geometry => {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ type: 'fluid' as BoundaryCondition }))
  );
};

export const MOCK_LOSS_DATA: Record<string, number> = {
  "Continuity Loss": 0.0123,
  "Momentum-X Loss": 0.0456,
  "Momentum-Y Loss": 0.0389,
  "Adversarial Loss": 0.6789,
  "Reconstruction Loss": 0.1234,
};

export const BOUNDARY_CONDITION_CONFIG: Record<
  BoundaryCondition,
  { color: string; label: string }
> = {
  fluid: { color: 'bg-background', label: 'Fluid' },
  solid: { color: 'bg-slate-700', label: 'Solid/Obstacle' },
  inflow: { color: 'bg-green-600', label: 'Inflow' },
  outflow: { color: 'bg-red-600', label: 'Outflow' },
  wall: { color: 'bg-slate-500', label: 'Wall' },
};

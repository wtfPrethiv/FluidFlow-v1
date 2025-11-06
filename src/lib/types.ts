export type SimulationParameters = {
  reynoldsNumber: number;
  kinematicViscosity: number;
  fluidDensity: number;
};

export type BoundaryCondition = 'fluid' | 'solid' | 'inflow' | 'outflow' | 'wall';

export type GeometryCell = {
  type: BoundaryCondition;
};

export type Geometry = GeometryCell[][];

export type LossData = Record<string, number>;

export type SimulationViewType = 'streamline' | 'pressure';

export type SimulationImages = {
    [key in SimulationViewType]: string | null;
};

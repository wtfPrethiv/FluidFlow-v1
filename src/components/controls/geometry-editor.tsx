'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Geometry, BoundaryCondition } from '@/lib/types';
import { BOUNDARY_CONDITION_CONFIG, createInitialGeometry, GRID_WIDTH, GRID_HEIGHT } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Circle, Square, Wind, Pencil } from 'lucide-react';

type GeometryEditorProps = {
  geometry: Geometry;
  setGeometry: (geom: Geometry) => void;
};

type GeometryType = 'custom' | 'cylinder' | 'rectangle' | 'airfoil';

const GEOMETRY_OPTIONS: { value: GeometryType, label: string, icon: React.FC<any> }[] = [
    { value: 'cylinder', label: 'Cylinder', icon: Circle },
    { value: 'rectangle', label: 'Rectangle', icon: Square },
    { value: 'airfoil', label: 'Airfoil', icon: Wind },
    { value: 'custom', label: 'Custom', icon: Pencil },
];

export function GeometryEditor({ geometry, setGeometry }: GeometryEditorProps) {
  const [brush, setBrush] = useState<BoundaryCondition>('solid');
  const [isDrawing, setIsDrawing] = useState(false);
  const [geometryType, setGeometryType] = useState<GeometryType>('cylinder');

  const isCustomEditing = geometryType === 'custom';

  const handleCellInteraction = (row: number, col: number) => {
    if (!isCustomEditing) return;

    const newGeometry = geometry.map((r, rowIndex) =>
      r.map((c, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { type: brush };
        }
        return c;
      })
    );
    setGeometry(newGeometry);
  };

  const handleMouseDown = (row: number, col: number) => {
    if (!isCustomEditing) return;
    setIsDrawing(true);
    handleCellInteraction(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing && isCustomEditing) {
      handleCellInteraction(row, col);
    }
  };
  
  const handleGeometryChange = (type: GeometryType) => {
    setGeometryType(type);
    let newGeometry = createInitialGeometry(GRID_WIDTH, GRID_HEIGHT);

    switch (type) {
        case 'cylinder': {
            const centerX = Math.floor(GRID_WIDTH / 3);
            const centerY = Math.floor(GRID_HEIGHT / 2);
            const radius = Math.min(GRID_WIDTH, GRID_HEIGHT) / 6;
            newGeometry = newGeometry.map((row, y) => row.map((cell, x) => {
                const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                return dist < radius ? { type: 'solid' } : cell;
            }));
            break;
        }
        case 'rectangle': {
            const rectWidth = Math.floor(GRID_WIDTH / 4);
            const rectHeight = Math.floor(GRID_HEIGHT / 2);
            const startX = Math.floor(GRID_WIDTH / 3) - Math.floor(rectWidth / 2);
            const startY = Math.floor(GRID_HEIGHT / 2) - Math.floor(rectHeight / 2);
            for (let y = startY; y < startY + rectHeight; y++) {
                for (let x = startX; x < startX + rectWidth; x++) {
                    if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
                        newGeometry[y][x] = { type: 'solid' };
                    }
                }
            }
            break;
        }
        case 'airfoil':
            // Simplified NACA 0012 airfoil shape for demonstration
            const c = GRID_WIDTH / 2;
            const t = 0.12;
            const offsetX = GRID_WIDTH / 4;
            const offsetY = GRID_HEIGHT / 2;

            newGeometry = newGeometry.map((row, y_grid) => row.map((cell, x_grid) => {
                const x = (x_grid - offsetX) / c;
                if (x >= 0 && x <= 1) {
                    const half_thickness = 5 * t * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * Math.pow(x, 2) + 0.2843 * Math.pow(x, 3) - 0.1015 * Math.pow(x, 4));
                    const y_upper = half_thickness * (c / GRID_HEIGHT) * (GRID_HEIGHT/2.5);
                    const y_lower = -y_upper;
                    
                    const y_norm = (y_grid - offsetY) / (GRID_HEIGHT / 2.5);

                    if (y_norm <= y_upper && y_norm >= y_lower) {
                        return { type: 'solid' };
                    }
                }
                return cell;
            }));
            break;
        case 'custom':
            setGeometry(createInitialGeometry(GRID_WIDTH, GRID_HEIGHT));
            return;
    }
    setGeometry(newGeometry);
  }

  useEffect(() => {
    // On initial mount, if the default is not custom, generate the shape.
    if (geometryType !== 'custom') {
        handleGeometryChange(geometryType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Geometry & Boundary Conditions</CardTitle>
        <CardDescription>
          Select a predefined shape or draw a custom one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="geometry-type">Geometry Type</Label>
          <Select value={geometryType} onValueChange={handleGeometryChange}>
            <SelectTrigger id="geometry-type">
              <SelectValue placeholder="Select a geometry..." />
            </SelectTrigger>
            <SelectContent>
                {GEOMETRY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                           <opt.icon className="h-4 w-4" />
                           <span>{opt.label}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className={cn('space-y-4', !isCustomEditing && 'opacity-50 pointer-events-none')}>
          <div>
            <Label>Brush Type</Label>
            <p className="text-xs text-muted-foreground mt-1">
                Click and drag on the grid below to define obstacles and flow boundaries.
            </p>
            <RadioGroup
              value={brush}
              onValueChange={(value: BoundaryCondition) => setBrush(value)}
              className="mt-2 grid grid-cols-3 gap-2"
              disabled={!isCustomEditing}
            >
              {Object.entries(BOUNDARY_CONDITION_CONFIG).map(([key, { label }]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`geom-${key}`} />
                  <Label htmlFor={`geom-${key}`} className="text-sm font-normal">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div
            className={cn(
                "grid gap-px overflow-hidden rounded-md border bg-muted p-px",
                !isCustomEditing && "cursor-not-allowed"
            )}
            style={{ gridTemplateColumns: `repeat(${geometry[0]?.length || 1}, minmax(0, 1fr))` }}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
          >
            {geometry.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                      "aspect-square w-full transition-all duration-150 ease-in-out",
                      BOUNDARY_CONDITION_CONFIG[cell.type].color,
                      isCustomEditing ? "cursor-pointer hover:scale-110 hover:brightness-125" : "cursor-not-allowed"
                  )}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

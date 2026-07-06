import React, { useMemo, useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { useRaceStore } from '../store/useRaceStore';
import { DEFAULT_CIRCUIT_BOUNDS } from '../constants';
import { DriverState } from '../types';

interface MapProps {
    width?: number;
    height?: number;
}

export const CircuitMap: React.FC<MapProps> = ({ width = 800, height = 600 }) => {
  const { drivers, focusDriverNumber } = useRaceStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const carsMapRef = useRef<Map<number, PIXI.Container>>(new Map());
  
  const activeDrivers = (Object.values(drivers) as DriverState[]).filter(d => d.x !== undefined && d.y !== undefined);
  
  const bounds = useMemo(() => {
    if (activeDrivers.length === 0) return DEFAULT_CIRCUIT_BOUNDS;
    return DEFAULT_CIRCUIT_BOUNDS; 
  }, []);

  const scaleX = width / (bounds.maxX - bounds.minX);
  const scaleY = height / (bounds.maxY - bounds.minY);
  const scale = Math.min(scaleX, scaleY) * 0.8;
  const offsetX = width / 2;
  const offsetY = height / 2;

  // Transform: OpenF1 coords -> Screen Coords
  const transform = (x: number, y: number) => ({
      x: (x * scale) + offsetX,
      y: (-y * scale) + offsetY 
  });

  // Initialize Pixi Application
  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      width,
      height,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      appRef.current = null;
    };
  }, [width, height]);

  // Update Scene
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    // We simply iterate active drivers and update or create their sprites
    const currentDriverIds = new Set<number>();

    activeDrivers.forEach((d) => {
        currentDriverIds.add(d.driver_number);
        const pos = transform(d.x!, d.y!);
        const isFocused = focusDriverNumber === d.driver_number;
        const color = parseInt(d.team_colour.replace('#', ''), 16);
        
        let carContainer = carsMapRef.current.get(d.driver_number);

        if (!carContainer) {
            // Create new car representation
            carContainer = new PIXI.Container();
            
            // Dot
            const dot = new PIXI.Graphics();
            dot.name = 'dot';
            carContainer.addChild(dot);

            // Focus Glow
            const glow = new PIXI.Graphics();
            glow.name = 'glow';
            glow.visible = false;
            carContainer.addChildAt(glow, 0);

            // Text
            const text = new PIXI.Text(d.name_acronym, {
                fontFamily: 'Arial',
                fontSize: 10,
                fill: 0xffffff,
                fontWeight: 'bold',
                stroke: 0x000000,
                strokeThickness: 2,
            });
            text.anchor.set(0.5);
            text.y = -20;
            carContainer.addChild(text);

            app.stage.addChild(carContainer);
            carsMapRef.current.set(d.driver_number, carContainer);
        }

        // Update Position
        carContainer.x = pos.x;
        carContainer.y = pos.y;

        // Update Visuals (Focus / Color)
        const dot = carContainer.getChildByName('dot') as PIXI.Graphics;
        const size = isFocused ? 12 : 8;
        dot.clear();
        dot.beginFill(color);
        dot.lineStyle(1, 0xffffff);
        dot.drawCircle(0, 0, size);
        dot.endFill();

        const glow = carContainer.getChildByName('glow') as PIXI.Graphics;
        glow.visible = isFocused;
        if (isFocused) {
            glow.clear();
            glow.beginFill(0xffffff, 0.3);
            glow.drawCircle(0, 0, 20);
            glow.endFill();
        }
    });

    // Cleanup removed drivers
    for (const [id, container] of carsMapRef.current.entries()) {
        if (!currentDriverIds.has(id)) {
            app.stage.removeChild(container);
            container.destroy();
            carsMapRef.current.delete(id);
        }
    }

  }, [activeDrivers, focusDriverNumber, width, height, scale, offsetX, offsetY]);

  return (
    <div className="w-full h-full bg-[#121214] relative overflow-hidden flex items-center justify-center">
       {activeDrivers.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center text-muted z-10 pointer-events-none">
               <div className="text-center">
                   <p className="mb-2">No telemetry data available.</p>
                   <p className="text-xs opacity-50">Waiting for live positions...</p>
               </div>
           </div>
       )}
       
       <div ref={containerRef} />
       
       <div className="absolute bottom-4 left-4 pointer-events-none">
           <div className="bg-black/50 backdrop-blur px-3 py-1 rounded border border-white/10 text-xs font-mono text-white">
               TRACK MAP (Estimated)
           </div>
       </div>
    </div>
  );
};
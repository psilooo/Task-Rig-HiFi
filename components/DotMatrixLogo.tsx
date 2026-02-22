import React, { useEffect, useRef } from 'react';

/**
 * Parses an SVG path into a 3D dot matrix and renders it rotating slowly.
 * This replaces the generic cube with the Task Rig logo.
 */
export const DotMatrixLogo: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Canvas setup
        const renderSize = 400; // Displayed size
        const dpr = window.devicePixelRatio || 1;
        canvas.width = renderSize * dpr;
        canvas.height = renderSize * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${renderSize}px`;
        canvas.style.height = `${renderSize}px`;

        // Extract SVG points using an offscreen canvas
        const sampleLogoPoints = () => {
            const offscreen = document.createElement('canvas');
            const sampleSize = 100; // Resolution of the sampling grid
            offscreen.width = sampleSize;
            offscreen.height = sampleSize;
            const offCtx = offscreen.getContext('2d');
            if (!offCtx) return [];

            // Task Rig SVG Path
            const pathData = "m324 0.07c2.1-0.01 3.22 1.3 7 8.15 2.81 5.1 7.5 11.33 12.5 16.6 4.4 4.63 11.38 10.63 15.5 13.33 4.13 2.7 10.99 6.24 15.25 7.88 4.26 1.63 11.91 3.7 17 4.59 6.52 1.13 12.05 1.43 18.75 1 5.23-0.33 12.88-1.53 17-2.66 4.13-1.13 11.1-3.82 15.5-5.99 4.4-2.16 11.27-6.53 15.27-9.7 4-3.17 9.98-9.15 13.28-13.27 3.29-4.13 7.45-10.31 9.22-13.75 2.51-4.85 3.73-6.24 5.48-6.25 1.24 0 9.56 1.85 18.5 4.11 8.94 2.26 23.23 6.51 31.75 9.44 8.52 2.93 20.67 7.55 27 10.26 9.38 4.03 11.44 5.29 11.17 6.82-0.18 1.03-0.57 7.49-0.87 14.37-0.42 9.58-0.15 14.49 1.16 21 0.94 4.67 2.81 11.2 4.16 14.5 1.35 3.3 4.33 9.15 6.64 13 2.3 3.85 6.9 9.87 10.21 13.38 3.32 3.52 8.73 8.3 12.03 10.64 3.3 2.33 9.38 5.93 13.5 7.98 4.13 2.06 10.88 4.65 15 5.76 5.58 1.51 10.83 2.05 20.5 2.13 9.6 0.07 14.96-0.39 20.5-1.77 4.13-1.03 11.33-3.62 16-5.77 4.67-2.14 8.73-3.9 9-3.91 0.27-0.01 4.13 4.17 8.57 9.27 4.45 5.11 11.69 14.01 16.1 19.79 4.41 5.78 10.73 14.55 14.04 19.5 3.31 4.95 8.55 13.16 11.65 18.25 3.1 5.09 5.65 9.59 5.65 10 0.01 0.41-2.05 2.78-4.59 5.25-2.53 2.47-6.56 7.2-8.94 10.5-2.39 3.3-5.92 9.37-7.85 13.5-1.93 4.12-4.43 11.32-5.56 16-1.46 6.05-2.06 11.82-2.06 20 0 7.92 0.6 13.99 1.93 19.5 1.06 4.4 3.13 10.7 4.6 14 1.47 3.3 4.7 9.15 7.19 13 2.48 3.85 7.77 10.15 11.74 14 3.97 3.85 10.78 9.14 15.12 11.75 4.35 2.61 11.06 5.86 14.91 7.22 3.85 1.36 10.45 3.05 22.32 5.03l0.55 4c0.31 2.2 1.1 13.45 1.76 25 0.94 16.5 0.93 25.29-0.04 41-0.68 11-1.43 21.46-1.66 23.25-0.37 2.77-0.83 3.25-3.18 3.26-1.51 0-6.35 0.87-10.75 1.93-4.4 1.06-10.7 3.13-14 4.6-3.3 1.47-9.15 4.7-13 7.19-3.85 2.48-10.15 7.77-14 11.74-3.85 3.97-9.12 10.78-11.71 15.12-2.59 4.35-6.18 12.18-7.98 17.41-3.19 9.24-3.28 9.95-3.27 26 0 15.99 0.1 16.8 3.25 26 1.79 5.23 5.26 12.99 7.73 17.25 2.46 4.26 7.39 10.79 10.94 14.5 3.55 3.71 6.48 7.09 6.5 7.5 0.02 0.41-2.5 4.91-5.6 10-3.1 5.09-8.67 13.75-12.39 19.25-3.71 5.5-10.06 14.28-14.11 19.52-4.05 5.24-10.96 13.68-15.36 18.77-4.4 5.08-8.23 9.25-8.5 9.25-0.27 0-4.33-1.75-9-3.91-4.67-2.15-11.65-4.72-15.5-5.71-5.01-1.29-10.7-1.8-20-1.79-8.92 0.01-15.2 0.56-20 1.75-3.85 0.95-10.83 3.54-15.5 5.74-4.67 2.21-11.2 5.95-14.5 8.3-3.3 2.36-8.86 7.39-12.36 11.18-3.5 3.8-8.33 10.27-10.73 14.4-2.41 4.12-5.81 11.77-7.58 17-3 8.9-3.2 10.42-3.26 24-0.04 7.98 0.16 16.25 0.93 22.28l-11.5 4.93c-6.33 2.72-18.7 7.38-27.5 10.36-8.8 2.97-23.2 7.21-32 9.42-8.8 2.21-16.9 4.02-18 4.01-1.44 0-2.91-1.76-5.23-6.25-1.77-3.44-5.93-9.63-9.22-13.75-3.3-4.13-9.28-10.1-13.28-13.27-4-3.17-10.87-7.54-15.27-9.7-4.4-2.17-11.38-4.87-15.5-6.01-4.13-1.14-11.55-2.33-16.5-2.66-5-0.32-12.55-0.07-17 0.57-4.4 0.63-11.38 2.28-15.5 3.67-4.13 1.38-10.88 4.4-15 6.71-5.19 2.9-10.58 7.27-17.52 14.19-7.54 7.52-11.13 12.04-14.5 18.22-3.27 6-5.02 8.23-6.48 8.26-1.1 0.02-8.98-1.73-17.5-3.87-8.52-2.15-20.68-5.58-27-7.63-6.32-2.04-16.9-5.86-23.5-8.49-6.6-2.63-14.14-5.72-16.75-6.88-3.73-1.66-4.61-2.49-4.1-3.86 0.35-0.96 0.86-7.38 1.12-14.25 0.36-9.36 0.05-14.63-1.22-21-0.94-4.67-3.01-11.65-4.61-15.5-1.59-3.85-5.11-10.38-7.8-14.5-2.7-4.13-8.22-10.67-12.27-14.54-4.06-3.87-10.52-8.87-14.37-11.11-3.85-2.24-9.93-5.24-13.5-6.66-3.57-1.42-10.78-3.33-16-4.25-6.83-1.2-12.17-1.5-19-1.05-5.22 0.34-12.43 1.34-16 2.23-3.57 0.88-10.45 3.47-15.27 5.75-5.61 2.64-9.08 3.77-9.62 3.13-0.46-0.55-3.96-4.6-7.79-9-3.82-4.4-10.09-12.05-13.94-17-3.85-4.95-10.39-13.95-14.54-20-4.15-6.05-10.2-15.39-19.34-30.53l6.1-6.23c3.36-3.43 7.99-9.16 10.29-12.74 2.3-3.58 5.49-9.65 7.09-13.5 1.6-3.85 3.61-10.26 4.46-14.25 0.88-4.07 1.56-12.07 1.56-18.25 0-6.09-0.69-14.23-1.54-18.25-0.85-3.99-3-10.63-4.78-14.75-1.78-4.13-5.03-10.19-7.21-13.47-2.18-3.28-6.45-8.63-9.47-11.87-3.03-3.25-9.33-8.47-14-11.6-4.68-3.12-12.21-7.12-16.75-8.87-4.54-1.76-11.74-3.79-16-4.51-7.68-1.31-7.76-1.36-8.44-4.75-0.38-1.89-1.21-12.43-1.84-23.43-0.87-15.15-0.87-24.97 0.01-40.5 0.65-11.27 1.47-22.29 2.52-28.44l7-1.16c3.85-0.65 10.37-2.35 14.5-3.78 4.12-1.44 11.06-4.76 15.41-7.37 4.34-2.61 11.15-7.9 15.12-11.75 3.97-3.85 9.55-10.6 12.39-15 2.85-4.4 6.46-11.38 8.02-15.5 1.56-4.13 3.39-10.65 4.07-14.5 0.77-4.36 1.04-11.72 0.73-19.5-0.28-6.88-1.25-15.2-2.16-18.5-0.9-3.3-3.12-9.15-4.92-13-1.8-3.85-4.8-9.25-6.66-12-1.86-2.75-6.11-7.81-15.5-17.47l5.91-9.77c3.25-5.37 9.77-15.39 14.48-22.26 4.71-6.88 12.95-17.9 18.31-24.5 5.35-6.6 11.5-14.03 17.58-21l7.86 3.71c4.32 2.03 11.46 4.71 15.86 5.94 6.29 1.76 10.66 2.24 20.5 2.26 6.87 0.01 15.2-0.57 18.5-1.29 3.3-0.72 8.93-2.46 12.5-3.85 3.57-1.4 9.65-4.38 13.5-6.62 3.85-2.25 10.1-7.02 13.88-10.62 3.79-3.59 8.82-9.23 11.18-12.53 2.37-3.3 5.88-9.38 7.81-13.5 1.93-4.13 4.48-11.55 5.68-16.5 1.85-7.71 2.1-11.01 1.7-23-0.25-7.7-0.64-14.63-0.86-15.4-0.27-0.97 3.58-3.05 12.61-6.81 7.15-2.99 19.75-7.71 28-10.51 8.25-2.79 21.75-6.79 30-8.89 8.25-2.09 16.13-3.81 17.5-3.82zm38.5 124.37c-6.05 0.93-16.4 2.99-23 4.59-6.6 1.59-17.29 4.71-23.75 6.93-6.46 2.22-16.36 6.06-22 8.53-5.64 2.47-15.2 7.24-21.25 10.58-6.05 3.35-15.27 8.96-20.5 12.46-5.22 3.5-14.22 10.14-20 14.76-5.78 4.61-15.45 13.32-21.5 19.35-6.05 6.03-14.78 15.66-19.41 21.41-4.62 5.75-10.97 14.27-14.1 18.95-3.13 4.68-8.3 13-11.49 18.5-3.18 5.5-7.57 13.82-9.75 18.5-2.17 4.68-5.88 13.45-8.22 19.5-2.35 6.05-5.44 15.05-6.88 20-1.43 4.95-3.27 11.93-4.09 15.5-0.82 3.57-2.4 12.12-3.51 19-1.11 6.87-2.46 19.48-2.99 28-0.63 9.98-0.64 20.93-0.02 30.75 0.53 8.39 1.64 19.75 2.46 25.25 0.82 5.5 2.45 14.39 3.61 19.75 1.16 5.36 4.14 16.05 6.61 23.75 2.48 7.7 6.9 19.4 9.82 26 2.93 6.6 7.65 16.27 10.49 21.5 2.85 5.23 7.67 13.33 10.71 18 3.04 4.67 8.73 12.76 12.64 17.96 3.92 5.2 12.74 15.28 19.62 22.4 6.87 7.12 17 16.75 22.5 21.39 5.5 4.64 16.3 12.64 24 17.78 7.7 5.13 20.07 12.44 27.5 16.23 7.43 3.8 18.45 8.81 24.5 11.14 6.05 2.34 16.18 5.77 22.5 7.63 6.32 1.86 17.12 4.5 24 5.87 6.87 1.36 17 3.04 22.5 3.72 5.5 0.68 19.68 1.24 31.5 1.24 11.82 0 26-0.56 31.5-1.26 5.5-0.69 14.5-2.11 20-3.16 5.5-1.05 15.85-3.51 23-5.47 7.15-1.96 18.62-5.79 25.5-8.51 6.87-2.71 17.67-7.57 24-10.78 6.33-3.22 15.77-8.5 21-11.73 5.23-3.23 14.9-9.92 21.5-14.86 7.25-5.42 18.36-15.33 28.06-25.03 9.54-9.55 19.53-20.72 24.62-27.56 4.72-6.33 11.63-16.45 15.37-22.5 3.74-6.05 9.83-17.3 13.54-25 3.71-7.7 8.76-19.63 11.23-26.5 2.47-6.88 5.87-18.13 7.57-25 1.69-6.88 3.77-16.55 4.61-21.5 0.84-4.95 2.03-14.18 2.64-20.5 0.67-6.9 0.9-20.1 0.56-33q-0.56-21.5-2.63-34.5c-1.14-7.15-3.46-18.63-5.16-25.5-1.71-6.88-5.12-18.13-7.6-25-2.47-6.88-7.29-18.35-10.71-25.5-3.43-7.15-9.51-18.4-13.52-25-4.01-6.6-11.18-17.17-15.93-23.49-4.76-6.32-14.28-17.3-21.15-24.4-6.88-7.1-17.45-16.96-23.5-21.91-6.05-4.95-15.5-12-21-15.68-5.5-3.67-14.5-9.21-20-12.31-5.5-3.11-15.06-7.91-21.25-10.68-6.19-2.77-17.89-7.25-26-9.95-8.11-2.71-20.15-6.06-26.75-7.44-6.6-1.38-17.18-3.24-23.5-4.12-6.32-0.89-20.05-1.79-30.5-2-10.45-0.21-23.05-0.02-28 0.43-4.95 0.45-13.95 1.57-20 2.49zm9 192.62c105.25-0.03 173.05 0.32 179.75 0.94 5.91 0.55 14.24 2.1 18.5 3.44 4.26 1.34 10.64 4.38 14.17 6.75 3.54 2.37 7.72 5.88 9.3 7.81 1.57 1.92 4.19 6.2 5.81 9.5 1.61 3.3 3.73 8.92 4.7 12.5 1.47 5.39 1.77 10.68 1.76 31 0 20.73-0.28 25.5-1.84 31-1.01 3.57-3.02 8.98-4.47 12-1.45 3.02-5.12 8.13-8.16 11.34-3.42 3.63-7.8 6.96-11.52 8.77-3.3 1.6-8.79 3.69-18.38 6.39l25.06 31c13.78 17.05 25.79 32.04 26.69 33.31 1.36 1.93 1.42 2.71-0.87 7.19h-48l-2.75-3.29c-1.51-1.81-13.1-16.9-48.75-63.77l-114.5 0.06v-37l143.64-0.5 5.87-3c4.84-2.47 6.32-3.87 8.43-7.97 2.34-4.54 2.59-6.22 2.89-19.5 0.2-8.95-0.12-16.26-0.84-19.03-0.65-2.48-2.03-5.74-3.08-7.25-1.05-1.51-3.82-3.76-10.41-7.25l-199.5-0.5v83c0 74.15-0.17 83.16-1.57 84.5-1.29 1.23-5.14 1.5-21.25 1.52-15.53 0.01-20.1-0.29-21.68-1.42-1.97-1.42-2-2.73-2.5-167.6l-48.75 0.02c-40.77 0.01-49.08-0.22-50.75-1.42-1.84-1.32-2.03-2.81-2.36-18.77-0.27-13.02-0.03-17.9 0.96-19.64 0.72-1.26 2.23-2.7 3.36-3.18 1.14-0.5 76.08-0.91 171.04-0.95z";

            const p = new Path2D(pathData);

            // Scale down path to fit nicely in the sample grid
            // Viewbox was 0 0 810 793
            const scale = sampleSize / 810;
            offCtx.scale(scale, scale);

            offCtx.fillStyle = 'black';
            offCtx.fill(p);

            // Read pixels back to find edges
            const imgData = offCtx.getImageData(0, 0, sampleSize, sampleSize);
            const data = imgData.data;

            const pts: { x: number; y: number; z: number; isGear: boolean }[] = [];
            const density = 2; // Check every Nth pixel for better performance
            const depthLayers = 15; // Increased layers for denser Z-axis walls
            const zSpacing = 3; // Reduced spacing to match X/Y density

            // First pass: find which pixels are edges/outlines
            const isEdge = (x: number, y: number) => {
                // Check 4 neighbors
                const neighbors = [
                    { nx: x, ny: y - density },
                    { nx: x, ny: y + density },
                    { nx: x - density, ny: y },
                    { nx: x + density, ny: y }
                ];

                for (const n of neighbors) {
                    if (n.nx < 0 || n.nx >= sampleSize || n.ny < 0 || n.ny >= sampleSize) return true;
                    const nIdx = (n.ny * sampleSize + n.nx) * 4;
                    if (data[nIdx + 3] <= 128) return true; // Neighbor is transparent
                }
                return false;
            };

            for (let y = 0; y < sampleSize; y += density) {
                for (let x = 0; x < sampleSize; x += density) {
                    const idx = (y * sampleSize + x) * 4;
                    const alpha = data[idx + 3];

                    if (alpha > 128) {
                        const centeredX = (x - sampleSize / 2) * 1.5;
                        const centeredY = (y - sampleSize / 2) * 1.5;

                        // Distinguish gear from inner TR via radius
                        // The sampleSize is 100, so max radius is ~50*1.5 = ~75.
                        // Visually in the SVG, the inner TR is smaller than ~45 radius.
                        const radius = Math.sqrt(centeredX * centeredX + centeredY * centeredY);
                        const isGear = radius > 45;

                        if (!isGear) continue;

                        const edge = isEdge(x, y);

                        // Create extruded depth
                        for (let layer = 0; layer < depthLayers; layer++) {
                            const z = (layer - depthLayers / 2) * zSpacing;

                            // If it's an edge pixel, draw it on every layer to create the walls
                            // If it's an interior pixel, ONLY draw it on the front and back face
                            if (edge || layer === 0 || layer === depthLayers - 1) {
                                pts.push({ x: centeredX, y: centeredY, z: z, isGear });
                            }
                        }
                    }
                }
            }
            return pts;
        };

        const points = sampleLogoPoints();
        const dotSize = 2;

        let animationFrameId: number;
        let angleY = 0;
        let time = 0;

        const render = () => {
            ctx.clearRect(0, 0, renderSize, renderSize);

            // Smooth continuous rotation
            angleY += 0.008;
            time += 1;

            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);

            const centerX = renderSize / 2;
            const centerY = renderSize / 2;
            const fov = 350;

            // Trippy time-based phase for wavy deformations
            const trippyPhase = time * 0.03;

            // Draw points
            for (let i = 0; i < points.length; i++) {
                const p = points[i];

                let x1 = p.x;
                let z1 = p.z;
                let y1 = p.y;

                // Apply smooth rotation first to outer gear
                if (p.isGear) {
                    x1 = p.x * cosY + p.z * sinY;
                    z1 = -p.x * sinY + p.z * cosY;
                }

                // Orthographic flat projection (No division by Z!)
                // This creates the "looks 3D but is perfectly flat 2D" optical illusion
                const isometicScale = 1.3;
                const xProjected = x1 * isometicScale + centerX;
                const yProjected = y1 * isometicScale + centerY;

                // Use Z simply for drawing color/opacity, not position
                // Z goes from roughly -75 to 75. Normalize to 0-1 for depth shading.
                const normalizedZ = Math.max(0, Math.min(1, (z1 + 75) / 150));

                // Base opacity is dimmer in the back, brighter in the front
                const baseAlpha = 0.2 + (normalizedZ * 0.8);

                // Sharp scanline flicker
                const slowTime = time * 0.2;
                const scanline = (slowTime % 150 > yProjected * 0.2 && slowTime % 150 < yProjected * 0.2 + 5) ? 1 : 0.6;

                // Occasional data loss flicker
                const flicker = Math.random() > 0.98 ? 0.3 : 1;

                ctx.fillStyle = `rgba(249, 115, 22, ${baseAlpha * scanline * flicker})`;

                // Flat dot size
                const currentDotSize = dotSize * isometicScale;
                ctx.fillRect(
                    xProjected - currentDotSize / 2,
                    yProjected - currentDotSize / 2,
                    currentDotSize,
                    currentDotSize
                );
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative flex items-center justify-center w-full max-w-[400px]">
            {/* Glow behind the logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600/20 blur-[40px] rounded-full pointer-events-none"></div>
            <canvas
                ref={canvasRef}
                className="pointer-events-none mix-blend-screen opacity-100 max-w-full h-auto"
            />
        </div>
    );
};

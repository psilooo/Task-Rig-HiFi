import React, { useEffect, useRef } from 'react';

/**
 * Renders a 3D dot-matrix style cube rotating slowly, 
 * simulating the central visual from the Figma design.
 */
export const DotMatrixCube: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Set canvas resolution for crispness
        const size = 320; // Reduced size to match Figma
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        // Configuration
        const dotSpacing = 12; // Increased spacing for a less dense cube
        const dotSize = 2; // Slightly larger dots
        const cubeSize = 80; // Smaller overall cube size

        // Generate points
        const points: { x: number; y: number; z: number }[] = [];
        for (let x = -cubeSize; x <= cubeSize; x += dotSpacing) {
            for (let y = -cubeSize; y <= cubeSize; y += dotSpacing) {
                for (let z = -cubeSize; z <= cubeSize; z += dotSpacing) {
                    // Only add points on the surface (creating a hollow cube effect)
                    if (
                        Math.abs(x) >= cubeSize - 0.1 ||
                        Math.abs(y) >= cubeSize - 0.1 ||
                        Math.abs(z) >= cubeSize - 0.1
                    ) {
                        points.push({ x, y, z });
                    } else {
                        // add very sparse internal points
                        if (Math.random() > 0.98) {
                            points.push({ x, y, z });
                        }
                    }
                }
            }
        }

        let animationFrameId: number;
        // Set initial angles for an isometric/diamond view
        let angleX = Math.PI / 4; // 45 degrees
        let angleY = Math.PI / 4; // 45 degrees

        const render = () => {
            ctx.clearRect(0, 0, size, size);

            // Slower rotation to maintain the diamond shape longer
            angleX += 0.002;
            angleY += 0.003;

            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);

            const centerX = size / 2;
            const centerY = size / 2;
            const fov = 400; // Flatter perspective (less fisheye)

            // Draw points
            for (let i = 0; i < points.length; i++) {
                const p = points[i];

                // Rotate X
                const y1 = p.y * cosX - p.z * sinX;
                const z1 = p.y * sinX + p.z * cosX;

                // Rotate Y
                const x2 = p.x * cosY + z1 * sinY;
                const z2 = -p.x * sinY + z1 * cosY;

                // Perspective projection
                const distance = z2 + 300; // Pushed back further

                if (distance <= 0) continue;

                const scaleProjected = fov / distance;

                const xProjected = x2 * scaleProjected + centerX;
                const yProjected = y1 * scaleProjected + centerY;

                // Depth sorting effect (points further away are smaller/dimmer)
                const depthAlpha = Math.max(0.1, Math.min(0.9, scaleProjected * 1.5 - 0.5));
                const currentDotSize = dotSize * scaleProjected;

                // Add some random noise to alpha for 'flicker' effect seen in matrix/hologram styles
                const flicker = Math.random() > 0.98 ? 0.5 : 1;

                ctx.fillStyle = `rgba(249, 115, 22, ${depthAlpha * flicker})`;

                // Fast draw method (no path / fill / shadowBlur)
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
        <div className="relative flex items-center justify-center">
            {/* Glow behind the cube */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600/20 blur-[40px] rounded-full pointer-events-none"></div>
            <canvas
                ref={canvasRef}
                className="pointer-events-none mix-blend-screen opacity-100"
            />
        </div>
    );
};

import React, { useEffect, useRef } from 'react';

interface DynamicNoiseProps {
    opacity?: number;
}

export const DynamicNoise: React.FC<DynamicNoiseProps> = ({ opacity = 0.1 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let lastDrawTime = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const drawNoise = (time: number) => {
            const w = canvas.width;
            const h = canvas.height;

            // Continually dim the canvas every frame for an ultra-smooth fade
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, w, h);

            if (time - lastDrawTime > 100) { // Update dots every 100ms
                lastDrawTime = time;

                const noiseCanvas = document.createElement('canvas');
                noiseCanvas.width = 256;
                noiseCanvas.height = 256;
                const noiseCtx = noiseCanvas.getContext('2d', { alpha: true });

                if (noiseCtx) {
                    const PIXEL_SIZE = 4;
                    const radius = PIXEL_SIZE / 2;

                    for (let x = 0; x < 256; x += PIXEL_SIZE) {
                        for (let y = 0; y < 256; y += PIXEL_SIZE) {
                            if (Math.random() > 0.9) { // Sparse
                                noiseCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
                                noiseCtx.beginPath();
                                noiseCtx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
                                noiseCtx.fill();
                            }
                        }
                    }

                    // Draw the new dots on top with low opacity
                    ctx.globalAlpha = 0.6;
                    ctx.fillStyle = ctx.createPattern(noiseCanvas, 'repeat') || 'transparent';
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1.0;
                }
            }
            animationFrameId = requestAnimationFrame(drawNoise);
        };

        animationFrameId = requestAnimationFrame(drawNoise);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay z-0"
            style={{
                opacity,
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
        />
    );
};

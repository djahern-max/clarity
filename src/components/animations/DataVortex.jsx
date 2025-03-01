import React, { useEffect, useRef, useState } from 'react';

const DataVortex = () => {
  const canvasRef = useRef(null);
  const [jsonLines, setJsonLines] = useState([]);
  const animationFrameRef = useRef(null);

  // Generate random JSON snippet for visual effect
  useEffect(() => {
    const keys = [
      '"revenue":', '"expenses":', '"assets":', '"liabilities":',
      '"equity":', '"profit":', '"loss":', '"cashflow":',
      '"income":', '"capital":', '"tax":', '"interest":',
      '"depreciation":', '"amortization":', '"dividend":'
    ];

    const values = [
      '153280', '97500', '1250000', '458700',
      '791300', '55780', '0', '123450',
      '248900', '500000', '12340', '5670',
      '34560', '12340', '0'
    ];

    const lines = [];
    for (let i = 0; i < 15; i++) {
      const line = `  ${keys[i % keys.length]} ${values[i % values.length]},`;
      lines.push(line);
    }

    setJsonLines(lines);
  }, []);

  // Canvas animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 250;
    canvas.height = 250;

    // Center coordinates
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Array to store particles
    const particles = [];

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        size: Math.random() * 3 + 1,
        color: `hsl(${220 + Math.random() * 60}, 80%, ${50 + Math.random() * 40}%)`,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 100,
        speed: 0.01 + Math.random() * 0.02,
        opacity: 0,
        fadeIn: true,
        maxOpacity: 0.4 + Math.random() * 0.6
      });
    }

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.angle += particle.speed;

        // Calculate position based on angle and distance
        const x = centerX + Math.cos(particle.angle) * particle.distance;
        const y = centerY + Math.sin(particle.angle) * particle.distance;

        // Update opacity for fade effect
        if (particle.fadeIn) {
          particle.opacity += 0.01;
          if (particle.opacity >= particle.maxOpacity) {
            particle.fadeIn = false;
          }
        } else {
          particle.opacity -= 0.01;
          if (particle.opacity <= 0.1) {
            particle.fadeIn = true;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connecting line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = particle.color;
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Call next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Main spinning vortex */}
      <canvas
        ref={canvasRef}
        className="rounded-full"
        width="250"
        height="250"
      />

      {/* Floating JSON effect */}
      <div className="mt-4 relative h-24 w-full max-w-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-transparent pointer-events-none z-10"></div>

        <div className="animate-float-upward absolute top-0 left-0 w-full text-xs font-mono text-blue-300 opacity-60">
          {jsonLines.map((line, index) => (
            <div key={index} className="whitespace-nowrap" style={{ animationDelay: `${index * 0.2}s` }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataVortex;

import React, { useEffect, useRef } from 'react';

const DataVortex = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 200;
    canvas.height = 200;

    // Center coordinates
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Array to store particles
    const particles = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        size: Math.random() * 3 + 1,
        color: `hsl(${220 + Math.random() * 60}, 80%, ${50 + Math.random() * 40}%)`,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 80,
        speed: 0.01 + Math.random() * 0.02,
        opacity: 0,
        fadeIn: true,
        maxOpacity: 0.4 + Math.random() * 0.6
      });
    }

    // Animation loop
    let animationId;

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
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-full"
        width="200"
        height="200"
      />
    </div>
  );
};

export default DataVortex;

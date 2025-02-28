import React, { useEffect, useRef } from 'react';

const DataVortex = ({ isActive, onAnimationComplete, children }) => {
  const containerRef = useRef(null);
  const jsonRef = useRef(null);
  
  useEffect(() => {
    if (isActive && containerRef.current && jsonRef.current) {
      // Add vortex animation to the JSON container
      jsonRef.current.classList.add('animate-vortex');
      
      // Create the particle effect
      createVortexEffect();
      
      // Call the completion handler after animation finishes
      const timer = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onAnimationComplete]);
  
  const createVortexEffect = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const numParticles = 100;
    
    // Clear previous particles
    const existingParticles = container.querySelectorAll('.json-particle');
    existingParticles.forEach(p => p.remove());
    
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('json-particle');
      
      // Random starting position around the container
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 150;
      const startX = centerX + Math.cos(angle) * distance;
      const startY = centerY + Math.sin(angle) * distance;
      
      // All particles end at the center with some randomness
      const endX = centerX + (Math.random() * 20 - 10);
      const endY = centerY + (Math.random() * 20 - 10);
      
      // Set custom properties for the animation
      particle.style.setProperty('--x-start', `${startX}px`);
      particle.style.setProperty('--y-start', `${startY}px`);
      particle.style.setProperty('--x-end', `${endX}px`);
      particle.style.setProperty('--y-end', `${endY}px`);
      
      // Vary the animation duration and delay slightly
      const duration = 1 + Math.random() * 1.5;
      const delay = Math.random() * 0.5;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
    }
  };

  return (
    <div className="data-transformation-container" ref={containerRef}>
      <div 
        ref={jsonRef}
        className={`json-container ${isActive ? 'json-active' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

export default DataVortex;

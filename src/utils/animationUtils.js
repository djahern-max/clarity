/**
 * Utility functions for animations
 */

/**
 * Creates a vortex animation effect
 * @param {HTMLElement} container - The container element for the animation
 * @param {number} numParticles - Number of particles to create
 */
export const createVortexEffect = (container, numParticles = 100) => {
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
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

/**
 * Extract a color based on a value within a range
 * @param {number} value - Value to convert to color
 * @param {number} min - Minimum value in range
 * @param {number} max - Maximum value in range
 * @returns {string} RGB color string
 */
export const getColorFromValue = (value, min, max) => {
  // Map value to 0-1 range
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  // Generate color (blue to green to red gradient)
  if (normalized < 0.5) {
    // Blue to green (0 to 0.5)
    const ratio = normalized * 2;
    return `rgb(0, ${Math.floor(255 * ratio)}, ${Math.floor(255 * (1 - ratio))})`;
  } else {
    // Green to red (0.5 to 1)
    const ratio = (normalized - 0.5) * 2;
    return `rgb(${Math.floor(255 * ratio)}, ${Math.floor(255 * (1 - ratio))}, 0)`;
  }
};

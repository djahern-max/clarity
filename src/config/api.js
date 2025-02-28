const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://clarity.ryze.ai/api/financial'  
  : '/api/financial';                      

export default API_BASE;

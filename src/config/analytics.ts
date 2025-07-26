// Google Analytics Configuration
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics 4 Measurement ID
// Example: 'G-XXXXXXXXXX'

export const GA_MEASUREMENT_ID = process.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID';

// Enable analytics in production only
export const ENABLE_ANALYTICS = process.env.NODE_ENV === 'production' && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID';
// Google Analytics Configuration
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics 4 Measurement ID
// Example: 'G-XXXXXXXXXX'

export const GA_MEASUREMENT_ID = 'G-8JJ4K8LDWX';

// Enable analytics in production only
export const ENABLE_ANALYTICS = process.env.NODE_ENV === 'production' && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID';
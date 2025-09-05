import ReactGA from 'react-ga4';
import { GA_MEASUREMENT_ID, ENABLE_ANALYTICS } from '../config/analytics';

export const initGA = () => {
  if (!ENABLE_ANALYTICS) {
    console.log('Google Analytics disabled in development mode');
    return;
  }
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const trackPageView = (path: string) => {
  if (!ENABLE_ANALYTICS) return;
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (!ENABLE_ANALYTICS) return;
  ReactGA.event({
    action,
    category,
    label,
  });
};

// Track specific app events
export const trackCellCounting = (inputMode: string, totalCells: number) => {
  trackEvent('cell_counting', 'user_interaction', `${inputMode}_mode_${totalCells}_cells`);
};

export const trackMasterMixCalculation = (cellConcentration: number, inputMode?: string) => {
  const label = inputMode 
    ? `${inputMode}_mode_concentration_${cellConcentration}`
    : `concentration_${cellConcentration}`;
  trackEvent('master_mix_calculation', 'user_interaction', label);
};

export const trackMasterMixInputMode = (mode: 'hemocytometer' | 'manual') => {
  trackEvent('master_mix_input_mode', 'user_interaction', mode);
};

export const trackTabSwitch = (tab: string) => {
  trackEvent('tab_switch', 'navigation', tab);
};

export const trackModeSwitch = (mode: string) => {
  trackEvent('mode_switch', 'navigation', mode);
};

export const trackDarkModeToggle = (isDarkMode: boolean) => {
  trackEvent('dark_mode_toggle', 'user_preference', isDarkMode ? 'enabled' : 'disabled');
};

export const trackDataExport = (format: string) => {
  trackEvent('data_export', 'user_interaction', format);
};
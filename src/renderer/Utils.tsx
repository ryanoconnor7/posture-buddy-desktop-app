import _ from 'lodash';
import { InterventionMode } from './App';

export const transitionCSS = (t: string) => `webkit-transition: ${t};
-moz-transition: ${t};
-o-transition: ${t};
transition: ${t};`;

export function formatUrl(url: string) {
  if (url.includes('://')) {
    return url;
  } else if (!url.includes(' ') && url.includes('.')) {
    return 'https://' + url;
  } else {
    return 'http://google.com/search?q=' + encodeURIComponent(url);
  }
}

export function timeMinSec(timeMs: number) {
  let timeStr = '';
  const mins = timeMs / 1000 / 60;
  timeStr += `${mins.toFixed(0)}m`;
  const secs = (timeMs / 1000) % 60;
  timeStr += ` ${secs.toFixed(0)}s`;
  return timeStr;
}

export function timeSec(timeMs?: number) {
  if (timeMs === undefined || _.isNaN(timeMs)) return '--';
  return (timeMs / 1000).toFixed(1) + 's';
}

export function modeSummary(mode: InterventionMode | 'overall') {
  let raw = _.capitalize(mode);

  if (mode === 'overall') return raw;
  else if (mode === 'all') raw = 'Combined';
  else if (mode === 'off') raw = 'No';
  return `${raw} Feedback`;
}

export function feedbackMethodDisplay(mode: InterventionMode | 'overall') {
  let raw = _.capitalize(mode);

  if (mode === 'overall') return raw;
  else if (mode === 'all') raw = 'Visual + Haptic';
  else if (mode === 'off') raw = 'None';
  return `${raw}`;
}

export function feedbackMethodDisplayShort(mode: InterventionMode | 'overall') {
  return feedbackMethodDisplay(mode)
    .replace('Visual', 'Vis')
    .replace('Haptic', 'Hap')
    .replace('Extreme', 'Ext');
}

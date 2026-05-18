function toIsoString(timestamp: string) {
  return new Date(timestamp).toISOString();
}

export function formatUtcTime(timestamp: string) {
  return toIsoString(timestamp).slice(11, 19);
}

export function formatUtcHourMinute(timestamp: string) {
  return toIsoString(timestamp).slice(11, 16);
}

/**
 * Calculates the time remaining until midnight (00:00:00) of the next day
 * @returns Object with hours and minutes remaining until reset
 */
export function getTimeUntilMidnightReset() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  const hoursRemaining = Math.floor(msUntilMidnight / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));

  return {
    hours: hoursRemaining,
    minutes: minutesRemaining,
    totalMs: msUntilMidnight
  };
}

/**
 * Formats the time remaining as a readable string
 * @param hours - Hours remaining
 * @param minutes - Minutes remaining
 * @returns Formatted string like "4 hours 30 minutes"
 */
export function formatTimeRemaining(hours: number, minutes: number, language: string = 'en'): string {
  if (language === 'fr') {
    const hourText = hours === 1 ? 'heure' : 'heures';
    const minText = minutes === 1 ? 'minute' : 'minutes';
    return `${hours} ${hourText} ${minutes} ${minText}`;
  }
  
  const hourText = hours === 1 ? 'hour' : 'hours';
  const minText = minutes === 1 ? 'minute' : 'minutes';
  return `${hours} ${hourText} ${minutes} ${minText}`;
}

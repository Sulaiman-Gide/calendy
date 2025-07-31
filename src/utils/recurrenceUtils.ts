import { Event, RecurrenceRule } from '../types';
import { addDays, addWeeks, addMonths, addYears } from './dateUtils';

export const generateRecurringEvents = (
  originalEvent: Event,
  startDate: Date,
  endDate: Date,
): Event[] => {
  if (!originalEvent.isRecurring || !originalEvent.recurrenceRule) {
    return [originalEvent];
  }

  const events: Event[] = [];
  const rule = originalEvent.recurrenceRule;
  let currentDate = new Date(originalEvent.startDate);
  let count = 0;

  while (currentDate <= endDate && count < (rule.count || 999)) {
    if (currentDate >= startDate) {
      const eventInstance: Event = {
        ...originalEvent,
        id: `${originalEvent.id}_${count}`,
        startDate: currentDate.toISOString(),
        endDate: new Date(
          currentDate.getTime() +
            (new Date(originalEvent.endDate).getTime() -
              new Date(originalEvent.startDate).getTime()),
        ).toISOString(),
        originalEventId: originalEvent.id,
      };
      events.push(eventInstance);
    }

    // Calculate next occurrence
    currentDate = getNextOccurrence(currentDate, rule);
    count++;
  }

  return events;
};

const getNextOccurrence = (currentDate: Date, rule: RecurrenceRule): Date => {
  switch (rule.frequency) {
    case 'daily':
      return addDays(currentDate, rule.interval);
    case 'weekly':
      return addWeeks(currentDate, rule.interval);
    case 'monthly':
      return addMonths(currentDate, rule.interval);
    case 'yearly':
      return addYears(currentDate, rule.interval);
    default:
      return addDays(currentDate, 1);
  }
};

export const formatRecurrenceRule = (rule: RecurrenceRule): string => {
  const frequencyMap = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  };

  let text = `${frequencyMap[rule.frequency]}`;

  if (rule.interval > 1) {
    text += ` every ${rule.interval} ${
      rule.frequency === 'daily'
        ? 'days'
        : rule.frequency === 'weekly'
        ? 'weeks'
        : rule.frequency === 'monthly'
        ? 'months'
        : 'years'
    }`;
  }

  if (rule.count) {
    text += ` (${rule.count} times)`;
  } else if (rule.endDate) {
    text += ` until ${new Date(rule.endDate).toLocaleDateString()}`;
  }

  return text;
};

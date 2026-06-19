export const TOURNAMENT_TIME_ZONE = "America/Chicago";

export function formatDateRange(startDate: string, endDate: string) {
  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  });

  if (startDate === endDate) {
    return fmt.format(start);
  }

  return `${fmt.format(start)}-${fmt.format(end)}`;
}

export function formatGameTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TOURNAMENT_TIME_ZONE,
    weekday: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));
}

export function formatShortTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TOURNAMENT_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));
}

export function formatDay(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TOURNAMENT_TIME_ZONE,
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(new Date(date));
}

export function relativeFeedTime(date: string) {
  const diffMs = Date.now() - new Date(date).getTime();

  if (diffMs < 0) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric"
    }).format(new Date(date));
  }

  const minutes = Math.max(1, Math.round(diffMs / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(date));
}

function parseCalendarDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date(value);
  }

  return new Date(year, month - 1, day);
}

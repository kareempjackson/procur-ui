export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function monthShort(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(d);
}

export function formatShortDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatShortDateRange(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    // "Jan 20–24, 2026"
    return `${monthShort(start)} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }

  if (sameYear) {
    // "Jan 30 – Feb 2, 2026"
    return `${monthShort(start)} ${start.getDate()} – ${monthShort(end)} ${end.getDate()}, ${end.getFullYear()}`;
  }

  // "Dec 30, 2026 – Jan 2, 2027"
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

export function getEstimatedDeliveryRangeLabel(
  base: Date = new Date(),
  minDays: number = 3,
  maxDays: number = 7
): string {
  const start = addDays(base, minDays);
  const end = addDays(base, maxDays);
  return formatShortDateRange(start, end);
}



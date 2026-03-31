export function generateICS(params: {
  startDate: Date;
  endDate?: Date;
  title: string;
  description: string;
  location: string;
}): string {
  const { startDate, endDate, title, description, location } = params;
  const end = endDate || new Date(startDate.getTime() + 60 * 60 * 1000);

  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AutoAnkauf-Baden//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `UID:${Date.now()}@autoankauf-baden.de`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

'use client';

export function trackVisit() {
  fetch('/api/analytics/visit', { method: 'POST' }).catch(() => {});
}

export function trackCommand(command: string) {
  fetch('/api/analytics/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  }).catch(() => {});
}

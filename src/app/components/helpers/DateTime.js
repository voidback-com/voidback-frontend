'use client'


export function shortRelativeTime(date) {
  const hdate = require("human-date");

  const diff = hdate.relativeTime(date);

  if (diff.includes('ago')) {
    const parts = diff.split(' ');
    const value = parseInt(parts[0]);
    const unit = parts[1];

    if (unit.startsWith('year')) {
      return `${value}y`;
    } else if (unit.startsWith('month')) {
      return `${value}mo`;
    } else if (unit.startsWith('day')) {
      return `${value}d`;
    } else if (unit.startsWith('hour')) {
      return `${value}h`;
    } else if (unit.startsWith('minute')) {
      return `${value}m`;
    } else if (unit.startsWith('second')) {
      return `${value}s`;
    }
  } 

  return diff;
}


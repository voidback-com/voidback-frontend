'use client'


export function shortRelativeTime(date_str) {
  const date = new Date(date_str);
  const now = new Date();
  const diff_sec = Math.round((date - now) / 1000);
  const abs_diff = Math.abs(diff_sec);

  if (abs_diff < 60) {
    return `${abs_diff}s`;
  } else if (abs_diff < 3600) {
    return `${Math.round(abs_diff / 60)}m`;
  } else if (abs_diff < 86400) {
    return `${Math.round(abs_diff / 3600)}h`;
  } else if (abs_diff < 2592000) { // Less than 30 days
    return `${Math.round(abs_diff / 86400)}d`;
  } else if (abs_diff < 31536000) { // Less than a year
    return `${Math.round(abs_diff / 2592000)}mo`;
  } else {
    return `${Math.round(abs_diff / 31536000)}y`;
  }
}

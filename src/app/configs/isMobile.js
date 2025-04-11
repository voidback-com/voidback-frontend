

export const deviceIsMobile = () => {
  const userAgent = window.navigator.userAgent;
  return  /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
}



export const GOOGLE_ADS_ADD_TO_CART_SEND_TO = 'AW-17790987967/hGZQCJny5tIbEL_ds6NC';

// Event snippet for 添加到购物车 conversion page
// In your html page, add the snippet and call gtag_report_conversion when someone clicks on the chosen link or button.
export function gtag_report_conversion(url?: string) {
  if (typeof window === 'undefined') return false;

  let navigated = false;
  const callback = function () {
    if (navigated) return;
    navigated = true;
    if (typeof url !== 'undefined') {
      window.location.href = url;
    }
  };

  const gtag = (window as any)?.gtag as undefined | ((command: string, ...args: any[]) => void);
  if (typeof gtag !== 'function') {
    callback();
    return false;
  }

  gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_ADD_TO_CART_SEND_TO,
    event_callback: callback,
  });

  // Fallback navigation if the callback doesn't fire (e.g. ad blockers).
  if (typeof url !== 'undefined') {
    setTimeout(callback, 1000);
  }

  return false;
}

interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'other';
  os: string;
}

export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();

  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/ipad|tablet|kindle|silk/i.test(ua)) {
    deviceType = 'tablet';
  }

  let browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'other' = 'other';
  if (/chrome|crios|crmo/i.test(ua) && !/edge|opr|edg/i.test(ua)) {
    browser = 'chrome';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'firefox';
  } else if (
    /safari/i.test(ua) &&
    !/chrome|crios|crmo|edge|opr|edg/i.test(ua)
  ) {
    browser = 'safari';
  } else if (/edge|edg|opr/i.test(ua)) {
    browser = 'edge';
  }

  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac|macintosh/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

  return { deviceType, browser, os };
}

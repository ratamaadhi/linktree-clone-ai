interface ClickEvent {
  bioLinkId: string;
  bioPageId: string;
  url: string;
  timestamp: string;
  userAgent: string;
  referrer: string | null;
  screenWidth: number;
  screenHeight: number;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export class LinkTracker {
  private trackingEndpoint: string;
  private batchSize: number;
  private clickQueue: ClickEvent[] = [];
  private flushInterval: number;

  constructor(
    config: {
      trackingEndpoint?: string;
      batchSize?: number;
      flushInterval?: number;
    } = {}
  ) {
    this.trackingEndpoint = config.trackingEndpoint || '/api/v1/track-click';
    this.batchSize = config.batchSize || 10;
    this.flushInterval = config.flushInterval || 5000;
    this.setupBatchFlush();
  }

  trackClick(bioLinkId: string, bioPageId: string, url: string) {
    const clickEvent: ClickEvent = {
      bioLinkId,
      bioPageId,
      url,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || null,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      ...this.captureUTMParams(),
    };

    this.clickQueue.push(clickEvent);

    if (this.clickQueue.length >= this.batchSize) {
      this.flushQueue();
    }
  }

  private captureUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get('utm_source'),
      utmMedium: urlParams.get('utm_medium'),
      utmCampaign: urlParams.get('utm_campaign'),
    };
  }

  private setupBatchFlush() {
    setInterval(() => {
      if (this.clickQueue.length > 0) {
        this.flushQueue();
      }
    }, this.flushInterval);
  }

  private async flushQueue() {
    if (this.clickQueue.length === 0) return;

    const clicksToSend = [...this.clickQueue];
    this.clickQueue = [];

    try {
      await fetch(this.trackingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clicks: clicksToSend }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to track clicks:', error);
      this.clickQueue.unshift(...clicksToSend);
    }
  }

  trackAndNavigate(bioLinkId: string, bioPageId: string, url: string) {
    this.trackClick(bioLinkId, bioPageId, url);
    setTimeout(() => {
      window.location.href = url;
    }, 100);
  }
}

export const linkTracker = new LinkTracker();

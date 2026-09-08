import { useEffect } from "react";

const GOOGLE_ADS_ID = "AW-18334904972";
const GOOGLE_ADS_SCRIPT_ID = "google-ads-gtag";

type GoogleAdsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
  __bigBoysGoogleAdsConfigured?: boolean;
};

/** Loads the Google Ads base tag on pages that explicitly render this component. */
const GoogleAdsTag = () => {
  useEffect(() => {
    const googleWindow = window as GoogleAdsWindow;

    googleWindow.dataLayer = googleWindow.dataLayer || [];
    googleWindow.gtag = googleWindow.gtag || function gtag(...args: unknown[]) {
      googleWindow.dataLayer?.push(args);
    };

    if (!document.getElementById(GOOGLE_ADS_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_ADS_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
      document.head.appendChild(script);
    }

    if (!googleWindow.__bigBoysGoogleAdsConfigured) {
      googleWindow.gtag("js", new Date());
      googleWindow.gtag("config", GOOGLE_ADS_ID);
      googleWindow.__bigBoysGoogleAdsConfigured = true;
    }
  }, []);

  return null;
};

export default GoogleAdsTag;

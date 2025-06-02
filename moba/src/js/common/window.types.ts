// Base interface for shared window properties
export interface SharedWindowProperties {
  enableLogging?: boolean;
  inCordova?: boolean;
  tld?: string;
  useSharedWorker?: boolean;
}

// Additional window-specific properties
export interface AdditionalWindowProperties {
  gtag?: (command: string, action: string, params: any) => void;
  bbgmAds?: {
      cmd: Array<() => void>;
      refresh: () => void;
  };
  StripeCheckout?: {
      configure: (options: {
          key: string;
          image: string;
          token: (token: { id: string }) => Promise<void>;
      }) => void;
  };
  Stripe?: {
    setPublishableKey: (key: string) => void;
    card: {
        createToken: (
            card: {
                number: string;
                cvc: string;
                exp_month: string;
                exp_year: string;
            },
            callback: (status: number, response: {
                error?: { message: string };
                id?: string;
            }) => void
        ) => void;
    };
};
}

// Complete window properties interface
export interface WindowProperties extends SharedWindowProperties, AdditionalWindowProperties {}

// Extend the global Window interface
declare global {
  interface Window extends WindowProperties {}
}

// Environment interface that includes shared window properties and additional environment-specific properties
export interface Env extends SharedWindowProperties {
  heartbeatID: string;
  fromLocalStorage?: {
      changesRead: string | null;
      lastSelectedTid: string | null;
      nagged: string | null;
  };
}

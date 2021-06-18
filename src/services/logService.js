// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";

function init() {
  // Sentry.init({
  //   dsn: "https://05a0d0d8ba684e3c9cd76115c6b0f339@o861779.ingest.sentry.io/5821567",
  //   integrations: [new Integrations.BrowserTracing()],
  //   // Set tracesSampleRate to 1.0 to capture 100%
  //   // of transactions for performance monitoring.
  //   // We recommend adjusting this value in production
  //   tracesSampleRate: 1.0,
  //   });
}

function log(error) {
  console.error(error);
  // Sentry.captureException(error);
}

export default { init, log };

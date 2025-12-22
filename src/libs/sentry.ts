import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { NODE_ENV, SENTRY_DSN } from '../config';

export const initSentry = () => {
  // Only initiate in production
  if (NODE_ENV !== 'production') {
    console.log('Sentry not initialized: not in production environment.');
    return;
  }

  if (!SENTRY_DSN) {
    console.log('Sentry not initialized: SENTRY_DSN is not set.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV,

    // performance monitoring
    tracesSampleRate: 1.0, // capture 100% of transactions for performance monitoring

    // Profiling
    profileSessionSampleRate: 1.0, // capture 100% of profiling sessions
    integrations: [
      nodeProfilingIntegration(),
    ],

    // Don't send Personal Identifiable Information (PII)
    beforeSend(event) {
      // Remove sensitive data here if needed
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
      }
      return event;
    },
  });

  console.log('Sentry initialized.');
}

export { Sentry };
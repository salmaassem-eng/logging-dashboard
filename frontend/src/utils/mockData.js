// Helper to generate a mock API key
export const generateApiKey = () => {
  return 'pk_live_' + Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Default initial state for applications and their logs
export const initialApps = [
  {
    id: 'app-ecommerce',
    name: 'E-Commerce Checkout API',
    platform: 'Backend (Node.js/Express)',
    description: 'Core microservice handling cart, payments, and checkout operations.',
    apiKey: generateApiKey(),
    createdAt: '2026-02-14T08:30:00Z',
    metrics: {
      totalLogs: 48900,
      errorRate: 1.8, // %
      warningCount: 423,
      errorCount: 118,
    },
    logs: [
      {
        id: 'log-1',
        message: 'MongoNetworkError: failed to connect to server [localhost:27017] on first connect',
        level: 'critical',
        count: 42,
        firstOccurrence: '2026-05-20T10:15:00Z',
        lastOccurrence: '2026-05-24T16:45:12Z',
      },
      {
        id: 'log-2',
        message: 'Stripe API call failed: timeout after 10000ms during payment intent creation',
        level: 'error',
        count: 28,
        firstOccurrence: '2026-05-21T14:22:00Z',
        lastOccurrence: '2026-05-24T15:30:00Z',
      },
      {
        id: 'log-3',
        message: 'JWT verification failed: TokenExpiredError: jwt expired',
        level: 'warn',
        count: 245,
        firstOccurrence: '2026-05-18T09:00:00Z',
        lastOccurrence: '2026-05-24T17:05:00Z',
      },
      {
        id: 'log-4',
        message: 'Express Server listening on port 5000 in production mode',
        level: 'info',
        count: 6,
        firstOccurrence: '2026-05-18T08:00:00Z',
        lastOccurrence: '2026-05-23T12:00:00Z',
      },
      {
        id: 'log-5',
        message: 'DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default',
        level: 'warn',
        count: 178,
        firstOccurrence: '2026-05-18T08:00:05Z',
        lastOccurrence: '2026-05-24T17:10:00Z',
      },
      {
        id: 'log-6',
        message: 'Database query execution time exceeded threshold: SELECT * FROM products (340ms)',
        level: 'warn',
        count: 89,
        firstOccurrence: '2026-05-19T11:45:00Z',
        lastOccurrence: '2026-05-24T14:12:00Z',
      },
      {
        id: 'log-7',
        message: 'Failed to upload billing PDF receipt to AWS S3 bucket: Access Denied',
        level: 'error',
        count: 12,
        firstOccurrence: '2026-05-22T08:12:00Z',
        lastOccurrence: '2026-05-24T11:02:00Z',
      },
      {
        id: 'log-8',
        message: 'Redis connection lost. Reconnecting in 2000ms...',
        level: 'critical',
        count: 15,
        firstOccurrence: '2026-05-23T04:30:00Z',
        lastOccurrence: '2026-05-24T16:00:00Z',
      },
      {
        id: 'log-9',
        message: 'User signup completed successfully for user_id=usr_90a811c',
        level: 'info',
        count: 1250,
        firstOccurrence: '2026-05-18T08:30:00Z',
        lastOccurrence: '2026-05-24T17:09:00Z',
      },
      {
        id: 'log-10',
        message: 'Promo code invalid or expired: SAVE50 applied by user_id=usr_3310ff',
        level: 'debug',
        count: 310,
        firstOccurrence: '2026-05-18T08:45:00Z',
        lastOccurrence: '2026-05-24T16:55:00Z',
      },
      {
        id: 'log-11',
        message: 'Inventory level critical: SKU "SHIRT-BLUE-L" count = 3',
        level: 'warn',
        count: 4,
        firstOccurrence: '2026-05-23T10:10:00Z',
        lastOccurrence: '2026-05-24T09:15:00Z',
      },
      {
        id: 'log-12',
        message: 'Braintree webhook signature verified for transaction event',
        level: 'info',
        count: 85,
        firstOccurrence: '2026-05-19T01:00:00Z',
        lastOccurrence: '2026-05-24T15:20:00Z',
      }
    ]
  },
  {
    id: 'app-portal',
    name: 'Customer Portal SPA',
    platform: 'Frontend (React/Vite)',
    description: 'Client dashboard facing consumers. Tracks UI interactions and runtime errors.',
    apiKey: generateApiKey(),
    createdAt: '2026-03-01T12:00:00Z',
    metrics: {
      totalLogs: 95400,
      errorRate: 0.9,
      warningCount: 812,
      errorCount: 64,
    },
    logs: [
      {
        id: 'log-p1',
        message: 'TypeError: Cannot read properties of undefined (reading \'map\') at CartPage.jsx:45',
        level: 'error',
        count: 43,
        firstOccurrence: '2026-05-19T09:00:00Z',
        lastOccurrence: '2026-05-24T16:20:00Z',
      },
      {
        id: 'log-p2',
        message: 'Failed to load resource: the server responded with a status of 404 (Not Found) for /assets/missing-banner.png',
        level: 'warn',
        count: 720,
        firstOccurrence: '2026-05-18T08:00:00Z',
        lastOccurrence: '2026-05-24T17:11:00Z',
      },
      {
        id: 'log-p3',
        message: 'Uncaught (in promise) DOMException: Playback prevented by autoplay policy',
        level: 'debug',
        count: 92,
        firstOccurrence: '2026-05-18T10:30:00Z',
        lastOccurrence: '2026-05-24T14:45:00Z',
      },
      {
        id: 'log-p4',
        message: 'Slow interaction detected on button.btn-checkout: 520ms total duration',
        level: 'warn',
        count: 92,
        firstOccurrence: '2026-05-20T11:00:00Z',
        lastOccurrence: '2026-05-24T13:10:00Z',
      },
      {
        id: 'log-p5',
        message: 'LocalStorage quota exceeded. Falling back to memory cache.',
        level: 'error',
        count: 21,
        firstOccurrence: '2026-05-21T06:12:00Z',
        lastOccurrence: '2026-05-24T08:50:00Z',
      }
    ]
  },
  {
    id: 'app-dispatcher',
    name: 'Notification Service',
    platform: 'Serverless (AWS Lambda)',
    description: 'Subsystem triggering automated SMS, email, and push notifications.',
    apiKey: generateApiKey(),
    createdAt: '2026-04-10T15:45:00Z',
    metrics: {
      totalLogs: 12000,
      errorRate: 0.4,
      warningCount: 38,
      errorCount: 15,
    },
    logs: [
      {
        id: 'log-d1',
        message: 'Twilio API limit reached: queue full. Retrying in exponential backoff...',
        level: 'warn',
        count: 32,
        firstOccurrence: '2026-05-20T12:00:00Z',
        lastOccurrence: '2026-05-24T16:30:00Z',
      },
      {
        id: 'log-d2',
        message: 'SendGrid error: SMTP authentication failed. Check API key permissions.',
        level: 'critical',
        count: 15,
        firstOccurrence: '2026-05-22T09:00:00Z',
        lastOccurrence: '2026-05-24T10:15:00Z',
      },
      {
        id: 'log-d3',
        message: 'Firebase Cloud Messaging payload warning: badge count must be integer',
        level: 'warn',
        count: 6,
        firstOccurrence: '2026-05-19T14:00:00Z',
        lastOccurrence: '2026-05-24T12:00:00Z',
      }
    ]
  }
];

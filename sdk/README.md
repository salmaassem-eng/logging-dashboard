# LogVault Client Server SDK

The offical Node.js client-side Server SDK for ingesting logs into the **LogVault** centralized telemetry dashboard.

---

## Installation

Since the package is designed to be published, you can install it locally by targeting the folder directory:

```bash
npm install /path/to/logging-dashboard/sdk
```

---

## Quick Start Integration

```javascript
import LogVault from 'logvault-sdk';

// 1. Initialize the SDK with your developer API key and application name
LogVault.init(
  'pk_live_d36b85e0ca213b29c99182390aefd721', // Developer API key from dashboard
  'checkout-api',                             // Application name (no spaces)
  'http://localhost:5000'                      // (Optional) custom LogVault server url
);

// 2. Logging events using helpers
async function processOrder(order) {
  try {
    LogVault.info(`Starting order processing for order_id=${order.id}`);
    
    if (order.amount > 1000) {
      LogVault.warn(`Large transaction amount: $${order.amount} for order_id=${order.id}`);
    }
    
    // Simulate error
    throw new Error('Database transaction timeout after 5000ms');

  } catch (err) {
    // Log exception
    const res = await LogVault.error(`Failed to process order: ${err.message}`);
    console.log('Ingestion Response:', res);
  }
}
```

---

## API Methods Documentation

### `init(apiKey, appName, [serverUrl])`
Configures the client SDK globally.
*   `apiKey` (String, required): Developer credential.
*   `appName` (String, required): Unique application name registered in the LogVault Workspace. Space characters are rejected.
*   `serverUrl` (String, optional): Target LogVault ingestion URL. Defaults to `http://localhost:5000`.

### `log(message, level)`
Ingests a custom log event manually.
*   `message` (String, required): Log text or stack trace.
*   `level` (String, required): Must be `'INFO'`, `'WARN'`, or `'ERROR'`.

### `info(message)`
Short-hand helper for `log(message, 'INFO')`.

### `warn(message)`
Short-hand helper for `log(message, 'WARN')`.

### `error(message)`
Short-hand helper for `log(message, 'ERROR')`.

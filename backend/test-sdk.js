import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import Developer from './src/models/Developer.js';
import Application from './src/models/Application.js';
import Log from './src/models/Log.js';
import userRouter from './src/routes/user.js';
import appRouter from './src/routes/application.js';
import errorHandler from './src/middleware/error.js';
import LogVault from '../sdk/index.js';

// Load env vars
dotenv.config();

// Override port and DB for testing
const TEST_PORT = 5001;
const TEST_DB = 'mongodb://127.0.0.1:27017/logvault_test';
process.env.MONGODB_URI = TEST_DB;
process.env.JWT_SECRET = 'test_secret_12345';
process.env.NODE_ENV = 'test';

const runTest = async () => {
  console.log('🧪 Starting LogVault End-to-End Integration Test...\n');

  let server;
  try {
    // 1. Connect to test DB
    await mongoose.connect(TEST_DB);
    console.log('✅ Connected to Test MongoDB database.');

    // Clear test database collections
    await Promise.all([
      Developer.deleteMany({}),
      Application.deleteMany({}),
      Log.deleteMany({}),
    ]);
    console.log('🧹 Cleaned test database collections.');

    // 2. Create Test Developer
    const testDev = await Developer.create({
      username: 'tester',
      email: 'test@logvault.dev',
      password: 'password123',
    });
    console.log(`👤 Created test developer. API Key: ${testDev.apiKey}`);

    // 3. Create Test Application
    const testAppName = 'checkout-service';
    const testApp = await Application.create({
      name: testAppName,
      developer: testDev._id,
    });
    console.log(`📦 Created test application: '${testApp.name}' owned by developer.`);

    // 4. Start Express Server
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/users', userRouter);
    app.use('/api/applications', appRouter);
    app.use(errorHandler);

    server = app.listen(TEST_PORT, () => {
      console.log(`🚀 Test server listening on port ${TEST_PORT}.`);
    });

    // 5. Initialize Server SDK
    console.log('\n📦 Initializing LogVault Client SDK...');
    LogVault.init(testDev.apiKey, testApp.name, `http://localhost:${TEST_PORT}`);
    console.log('✅ SDK Initialized.');

    // 6. Push logs via SDK
    console.log('\n📥 Injecting logs via SDK...');
    
    // Log INFO message
    console.log('- Sending INFO log...');
    let res = await LogVault.info('Payment checkout initialized for user_id=usr_505');
    if (!res.success) throw new Error(`Log failed: ${res.error}`);

    // Log WARN message
    console.log('- Sending WARN log...');
    res = await LogVault.warn('Response latency high (1200ms) on /api/checkout');
    if (!res.success) throw new Error(`Log failed: ${res.error}`);

    // Log ERROR message
    console.log('- Sending ERROR log...');
    res = await LogVault.error('Database connection timed out during payment confirmation');
    if (!res.success) throw new Error(`Log failed: ${res.error}`);

    // Send identical duplicate ERROR message to test count increment / deduplication
    console.log('- Sending duplicate ERROR log...');
    res = await LogVault.error('Database connection timed out during payment confirmation');
    if (!res.success) throw new Error(`Log failed: ${res.error}`);

    // Send another identical duplicate ERROR message
    console.log('- Sending duplicate ERROR log (3rd time)...');
    res = await LogVault.error('Database connection timed out during payment confirmation');
    if (!res.success) throw new Error(`Log failed: ${res.error}`);

    console.log('✅ Telemetry ingestion completed.');

    // 7. Verify Log documents in Database
    console.log('\n🔍 Querying database directly to verify deduplication states...');
    const logDocuments = await Log.find({ application: testApp._id });
    console.log(`Total unique log documents in DB: ${logDocuments.length} (Expected: 3)`);

    logDocuments.forEach((doc) => {
      console.log(`- [${doc.level}] Message: "${doc.message}"`);
      console.log(`  Count: ${doc.count} ${doc.count === 3 && doc.level === 'ERROR' ? '🔥 (Deduplication Success: count is 3!)' : ''}`);
      console.log(`  Last Updated: ${doc.updatedAt.toISOString()}`);
    });

    if (logDocuments.length !== 3) {
      throw new Error(`Test failed: Expected 3 unique log documents, found ${logDocuments.length}`);
    }

    const dbErrorLog = logDocuments.find(l => l.level === 'ERROR');
    if (!dbErrorLog || dbErrorLog.count !== 3) {
      throw new Error(`Test failed: Expected duplicate ERROR log count to be 3, got ${dbErrorLog ? dbErrorLog.count : 'null'}`);
    }

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉\n');

  } catch (error) {
    console.error(`\n❌ Integration Test Failed: ${error.message}\n`);
  } finally {
    // 8. Cleanup and close connections
    if (server) {
      server.close(() => {
        console.log('🔌 Test server shut down.');
      });
    }
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
};

runTest();

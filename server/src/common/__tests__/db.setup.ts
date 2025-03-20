import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';

let mongod: MongoMemoryServer | null = null;
let connection: Connection | null = null;

/**
 * Initializes an in-memory MongoDB instance for testing.
 * - Creates a single MongoDB memory server for all tests.
 * - Establishes a Mongoose connection to the memory server.
 *
 * @returns {Promise<Connection>} The initialized Mongoose connection.
 */
export const initTestDB = async (): Promise<Connection> => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
  }
  if (!connection) {
    const uri = mongod.getUri();
    connection = (await mongoose.connect(uri)).connection;
  }
  return connection;
};

/**
 * Closes the in-memory MongoDB instance and cleans up resources.
 * Ensures that all connections are properly closed.
 */
export const closeTestDB = async (): Promise<void> => {
  if (connection) {
    await connection.dropDatabase();
    await connection.close();
    connection = null;
  }
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
};

/**
 * Resets the database by deleting all records from all collections.
 * Ensures a clean slate for each test.
 * Not used for now since we only read the mock/database
 */
export const resetDatabase = async (): Promise<void> => {
  if (!connection || !connection.db) {
    throw new Error('Database connection is not initialized.');
  }

  const collections = await connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
};

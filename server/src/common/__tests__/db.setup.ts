import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { Item, ItemSchema } from '../../modules/items/schemas/item.schema';

let mongod: MongoMemoryServer;
let connection: Connection;
let model: Model<any>;

/**
 * Initializes an in-memory MongoDB instance for testing.
 *
 * - Creates a new MongoDB memory server.
 * - Establishes a Mongoose connection to the memory server.
 * - Creates a Mongoose model based on the `Item` schema.
 *
 * @returns {Promise<Model<Item>>} The initialized Mongoose model for testing.
 */
export const initTestDB = async (): Promise<Model<Item>> => {
  mongod = await MongoMemoryServer.create();
  connection = (await connect(mongod.getUri())).connection;
  model = connection.model(Item.name, ItemSchema);
  return model;
};

/**
 * Closes the in-memory MongoDB instance and cleans up resources.
 *
 * - Drops the test database.
 * - Closes the Mongoose connection.
 * - Stops the memory server.
 *
 * @returns {Promise<void>} Resolves when the database is successfully closed.
 */
export const closeTestDB = async (): Promise<void> => {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
};

/**
 * Resets the database by deleting all records from the test collection.
 *
 * @returns {Promise<void>} Resolves when the database is cleared.
 */
export const resetDatabase = async (): Promise<void> => {
  await model.deleteMany({});
};

import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { Item, ItemSchema } from '../../modules/items/schemas/item.schema';

let mongod: MongoMemoryServer;
let connection: Connection;
let model: Model<any>;

export const initTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  connection = (await connect(mongod.getUri())).connection;
  model = connection.model(Item.name, ItemSchema);
  return model;
};

export const closeTestDB = async () => {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
};

export const resetDatabase = async () => {
  await model.deleteMany({});
};

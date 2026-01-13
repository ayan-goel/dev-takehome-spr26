import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "crisis-compass";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(DB_NAME);

  return cachedDb;
}

export async function getCollection(collectionName: string) {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}

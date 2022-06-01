import { openDB, deleteDB } from 'idb/with-async-ittr';

export async function getCache(dbName, expirationTime) {
  try {
    const db = await openDB(dbName, 1);
    // Get all the articles in date order:
    let expiration = (await db.getAllFromIndex('expiration', 'timestamp'))[0]
      .timestamp;
    if (!expiration || new Date().getTime() - expiration > expirationTime)
      return;
    let data = await db.getAllFromIndex(dbName, 'id');
    return data;
  } catch (e) {
    console.log(e);
  }
}
export async function setCache(dbName, data) {
  try {
    await deleteDB(dbName);
    const db = await openDB(dbName, 1, {
      upgrade(db) {
        // Create a store of objects
        const store = db.createObjectStore(dbName, {
          // The 'id' property of the object will be the key.
          keyPath: 'id',
          // If it isn't explicitly set, create a value by auto incrementing.
          autoIncrement: true
        });
        // Create an index on the 'date' property of the objects.
        store.createIndex('id', 'id');
        const store2 = db.createObjectStore('expiration', {
          // The 'id' property of the object will be the key.
          keyPath: 'timestamp',
          // If it isn't explicitly set, create a value by auto incrementing.
          autoIncrement: false
        });

        store2.createIndex('timestamp', 'timestamp');
      }
    });
    await db.add('expiration', { timestamp: new Date().getTime() });
    data.forEach(async (item) => {
      // Add an article:
      await db.add(dbName, {
        ...item
      });
    });
  } catch (e) {
    console.log(e);
  }
}

import PouchDB from "pouchdb";

const db = new PouchDB("src/server/mydatabase");

export async function addStock(name) {
  try {
    const exists = await db.get(name);
    if (exists) {
      console.log("exists");
      return;
    }

  } catch (error) {
    if (error.status === 404) {
      await db.put({
        _id: name,
        name: name,
        date: new Date().toISOString(),
      });
      console.log("Success");
    } else {
      console.error("Error", error);
    }
  }
}

export async function getStock() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}

export async function deleteStock(name) {
  try {
    const doc = await db.get(name); // Fetch the document first
    await db.remove(doc);  // Remove requires the full document
    console.log("Stock removed:", name);
  } catch (error) {
    console.error("Error removing stock:", error.name, error.message);
    throw error; // It's better to throw the error to handle it appropriately in the server response
  }
}
export async function deleteAllStocks() {
  try {
    // Retrieve all documents in the database
    const allDocs = await db.allDocs({ include_docs: true });  // Ensure documents are included
    for (let i = 0; i < allDocs.rows.length; i++) {
      const doc = allDocs.rows[i].doc;
      db.remove(doc);
    }
    console.log("Success");
  } catch (error) {
    // Handle the error
    console.error("Error deleting all stocks:", error);
  }
}
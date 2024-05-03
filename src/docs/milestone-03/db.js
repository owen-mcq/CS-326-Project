const db = new PouchDB("mydatabase");

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

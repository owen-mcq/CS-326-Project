const db = new PouchDB("mydatabase");

export async function addStock(name) {
  try {
    await db.put({
      _id: name,
      name: name,
      date: new Date().toISOString(),
    });
    console.log("Success");
  } catch (error) {
    console.error("Error", error);
  }
}

export async function getStock() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}

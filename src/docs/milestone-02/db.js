import PouchDB from "pouchdb";

const db = new PouchDB('mydatabase');


export async function addStock(name){
   const time = new Date.toISOString();
   await db.put({_id:name, time});
}


export async function getStock(){
   const result = await db.allDocs({ include_docs: true});
   return result.rows.map((row) => row.doc);
}

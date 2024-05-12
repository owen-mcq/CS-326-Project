import express from "express";
import logger from "morgan";
import * as db from "./db.js";
import {getStock} from "./db.js";


const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/client'));



app.use(logger("dev"));
app.get('/stock.html/:ticker', (req, res) => {
    res.redirect(`/stock.html?ticker=${encodeURIComponent(req.params.ticker)}`);
});

app.post('/stock.html/:ticker', async (req, res) => {
    try {
        const symbol = req.params.ticker;
        db.addStock(symbol);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error adding stock to watchlist:", error);
        res.sendStatus(500);
    }
});

app.delete('/stock.html/:ticker', async (req, res) => {
    try {
        const symbol = req.params.ticker;
        await db.deleteStock(symbol);
        console.log(await getStock());
        res.sendStatus(200);
    } catch (error) {
        console.error("Error deleting:", error);
        res.sendStatus(500);
    }
});

app.get('/watchlist.html/', async (req, res) => {
    try {
        const allStocks = await db.getStock();
        res.json(allStocks);
    } catch (error) {
        console.error("Failed to retrieve stocks:", error);
        res.sendStatus(500);
    }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

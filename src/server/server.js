import express from 'express';
import logger from 'morgan';

const app = express();
const port = 3000;

app.use(logger('dev'));

// Handling specific stock requests and redirecting with a ticker parameter
app.get('/stock/:ticker', (req, res) => {
    // Redirect to the stock.html with a ticker query parameter
    res.redirect(`/stock.html?ticker=${encodeURIComponent(req.params.ticker)}`);
});

// Serve static files from the client directory
app.use(express.static('src/client'));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

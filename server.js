// импортираме express (ES Modules)
import express from 'express';
// импортираме cors (ES Modules)
import cors from 'cors';
// го импортираме books.js рутерот
import booksRouter from './books.js';

// dotenv овозможува читање на enviroment variables od .env фајлот
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
    })
)

app.use((req, res, next) => {
    console.log(req.method, req.path)
    next()
})

app.use(express.json());

app.use('/books', booksRouter);

// test route
app.get('/', (req, res) => {
    res.send('Server is working');
})

// Поракава ќе се испечати во терминалот и така ќе знаеме дека работи
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})
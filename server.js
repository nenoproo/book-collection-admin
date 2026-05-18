// импортираме express (ES Modules)
import express from 'express';
// импортираме cors (ES Modules)
import cors from 'cors';
// го импортираме books.js рутерот
import booksRouter from './books.js';

// dotenv овозможува читање на enviroment variables od .env фајлот
import dotenv from 'dotenv';
dotenv.config();

const app = express();
// PORT од environment (Render) ако постои, инаку 3000 за локален development
// секој hosting сервис ти дава PORT преку environment variable
const PORT = process.env.PORT || 3000;

// CORS е пакет што ни дава middleware за Express.js.
// CORS му кажува на пребарувачот да дозволи фронтенд-от од овие origins да праќа request-и кон бекенд апи-то (API endpoints)
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

// test route за дали работи серверот
app.get('/', (req, res) => {
    res.send('Server is working');
})

// Поракава ќе се испечати во терминалот (не во browser!) и така ќе знаеме дека работи
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})
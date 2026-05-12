// express пакет што го инсталираме и импортираме
import express from 'express';
// исто најпрвин треба да го инсталираме пакетот npm install mongodb и импортираме MongoDB client за конекција со базата и ObjectId за работа со document IDs, oд истиот пакет
import { MongoClient, ObjectId } from 'mongodb';

// создава нов мини експрес рутер
const router = express.Router();

// url за http:// адреси а uri за mongodb:// и слично
// oвој url е за локален MongoDB
// const uri = 'mongodb://127.0.0.1:27017';

// овој uri е за конекција до Atlas
const uri = 'mongodb+srv://nenokings_db_user:Q0rqOPDoxxh4wYsP@cluster0.4nyefgj.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0';
// креираме MongoDB client преку кој backend-от ќе комуницира со базата
const client = new MongoClient(uri);

// GET request за /books route (крајниот endpoint е /books)
router.get('/', async (req, res) => {
  try {
    // конекција со MongoDB. client.connect() враќа Promise (асинхрона операција) а await го “resolve-ира” Promise-от и функцијата не продолжува понатака се додека не се отствари конекцијата
    await client.connect();

    // database: library
    const db = client.db('library');

    // collection: books
    const booksCollection = db.collection('books');

    // земи ги сите книги (документи), find({}) во MongoDB враќа cursor, не готов array.
    // toArray() ги претвора резултатите во JavaScript array
    const books = await booksCollection.find({}).toArray();

    // res.json() го претвора JavaScript array-от во JSON response
    // и го праќа до frontend
    res.json(books);
  } catch (error) {
    console.error(error);
    // враќаме 500 (Internal Server Error) и JSON error response до frontend
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// клиентот праќа барање до серверот за да додаде нова книга
router.post('/', async (req, res) => {

  try {
    await client.connect();

    const { title, author, genre, pages, language, year, publisher } = req.body;
    // креира нормален JavaScript објект само што користи шортхенд запис (само keys)
    const newBook = {
      title,
      author,
      genre,
      pages,
      language,
      year,
      publisher,
    };

    // database: library
    const db = client.db('library');
    // collection: books
    const booksCollection = db.collection('books');
    // newBook објектот (книгата) со методов ја ставаме во колекцијата, чекаме и го сочувуваме резултато
    const result = await booksCollection.insertOne(newBook);
    // result сега ни е документ
    res.status(201).json({
      message: 'New book added succesfully',
      book: newBook,
      id: result.insertedId,
    });

    console.log(newBook);
  } catch (error) {
    console.error(error);

    // server error response
    res.status(500).json({
      error: 'Failed to add new book',
    });
  }
});

// клиентот праќа барање до серверот за да избрише конкретна книга
router.delete('/:id', async (req, res) => {
  try {
    // database: library
    const db = client.db('library');
    // collection: books
    const booksCollection = db.collection('books');

    // го бришеме документот чиј _id се совпаѓа со id-то од URL параметарот (параметарот што го праќа фронтенд преку URL: http://localhost:3000/books/${id})
    await booksCollection.deleteOne({
      _id: new ObjectId(req.params.id)
    })

    // враќаме success response до фронтенд
    res.json({ message: 'Book deleted successfully'})

  } catch (error) {
    console.error(error);
    // враќаме 500 (Internal Server Error) и JSON error response до frontend
    res.status(500).json({ error: 'Failed to delete book'})
  }
})

export default router;

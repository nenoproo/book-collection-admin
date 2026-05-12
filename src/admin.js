import axios from 'axios';

const addBookBtn = document.getElementById('add-book-btn');
const cancelBtn = document.getElementById('cancel-btn');
const logoutBtn = document.getElementById('logout-btn');
const form = document.getElementById('add-book-form');
let isAddBookFormOpen = false;
const header = document.getElementById('header');
const table = document.getElementById('table');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
// const descriptionInput = document.getElementById('description');
const pagesInput = document.getElementById('pages');
const yearInput = document.getElementById('year');
const languageInput = document.getElementById('language');
const publisherInput = document.getElementById('publisher');
const tbody = document.getElementById('books-table-body');

// функција за прикажување / криење на формата за додавање книга
const toggleAddBookForm = () => {
  isAddBookFormOpen = !isAddBookFormOpen;
  if (isAddBookFormOpen) {   
    form.classList.remove('hidden');
    header.classList.add('hidden');
    table.classList.add('hidden');
  } else {
    form.classList.add('hidden');
    header.classList.remove('hidden');
    table.classList.remove('hidden');
  }
};

// повикување на функцијата за прикажување / криење на формата за додавање книга
addBookBtn.addEventListener('click', () => {
  console.log('Add Book Button is clicked!');
  toggleAddBookForm();
});

// функција за одлогирање од Book database manager
logoutBtn.addEventListener('click', () => {
  window.location.href = '/index.html';
});

// function to fetch data
const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/books');
    const books = res.data;
    console.log(books);

    // тука ја предавам како аргумент books var и ради тоа има пристап потоа renderBooks()
    renderBooks(books);
  } catch (error) {
    console.error('Error fetching data!', error);
  }
};

fetchData();

// function to render and show each book. Тука ја дефинирам а во fetchData() ја повикувам
const renderBooks = (books) => {
  const tbody = document.getElementById('books-table-body');

  // мапирај низ books и за секој book направи table row
  tbody.innerHTML = books
    .map(
      (book, i) => `<tr>
        <td class="px-4 py-2 w-16">${i + 1}</td>
        <td class="px-4 py-2">${book.title}</td>
        <td class="px-4 py-2">${book.author}</td>
        <td class="px-4 py-2">${book.genre}</td>
        <td class="px-4 py-2">${book.year}</td>
        <td class="px-4 py-2">${book.pages}</td>
        <td class="px-4 py-2">${book.language}</td>
        <td class="px-4 py-2">${book.publisher}</td>
        <td class="px-4 py-2">
            <div class="flex gap-2">
              <button
              // book._id е id-то од документот монго што го генерира
              data-id="${book._id}"
              class="p-2 border border-gray-200 hover:border-gray-400 rounded-md text-gray-900 cursor-pointer delete-btn">
                Delete
              </button>
            </div>
          </td>
    </tr>`,
    )
    .join(``);
};

// function to delete or edit a specific book (tr).
tbody.addEventListener('click', async (e) => {
  // ако кликнатиот child елемент во tbody е delete копчето, го земаме неговиот data-id во променлива
  if (e.target.classList.contains('delete-btn')) {
    // од тој делете копче елемент земи го data-id="book._id" (data-id и dataset.id се директно поврзани) тоа е конкретното _id што го генерира монгодб
    const id = e.target.dataset.id;

    try {
      await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE',
      });
      // откога ќе се причека да се ресолвира фечот, повлечи ја датата одновно (освежи ја)
      fetchData();
    } catch (error) {
      console.error('Error deleting book', error);
    }
  }
});

// function to post new book on the server
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // now we read values from inputs
  const title = titleInput.value;
  const author = authorInput.value;
  const genre = genreInput.value;
  const pages = pagesInput.value;
  const language = languageInput.value;
  const year = yearInput.value;
  const publisher = publisherInput.value;

  // fetch with two arguments, првиот аргумент е урл/патека до books рутерот а вториот е конфигурациски објект, каде секој key/value проперти кажува што да прави феч
  fetch('http://localhost:3000/books', {
    // го конфигурираме да прати/запише податоци на сервер
    method: 'POST',
    // mу велиме на серверот дека податоците ќе се во JSON текст формат
    headers: {
      'Content-Type': 'application/json',
    },
    // во бодито на хттп барањето во stringify() ја ставаме содржината што сакаме да ја пратиме до серверот, во овој случај JavaScript објект, и целиот овој објект се конвертира во JSON текст и се праќа како таков до серверот
    body: JSON.stringify({
      title,
      author,
      genre,
      pages,
      language,
      year,
      publisher,
    }),
  })
    // after the fetch we chain
    .then((response) => response.json())
    .then((data) => {
      console.log('Response from server', data);
    });
});

cancelBtn.addEventListener('click', () => {
  isAddBookFormOpen = !isAddBookFormOpen;
  form.classList.add('hidden');
  header.classList.remove('hidden');
  table.classList.remove('hidden');
});

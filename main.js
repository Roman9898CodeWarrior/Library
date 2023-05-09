const books = document.querySelector(".books-cards");

let myLibrary = [
  {
    title: 'Book1',
    author: 'Some dude',
    pages: 500,
    read: true
  }
];

function createBookElement(el, content, className) {
    const element = document.createElement(el);
    element.textContent = content;
    element.setAttribute("class", className);
    return element;
} 

function createBookItem(book, index) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("id", index);
    bookItem.setAttribute("key", index);
    bookItem.setAttribute("class", "card book");
    bookItem.appendChild(
      createBookElement("h1", `Title: ${book.title}`, "book-title")
    );
    bookItem.appendChild(
      createBookElement("h1", `Author: ${book.author}`, "book-author")
    );
    bookItem.appendChild(
      createBookElement("h1", `Pages: ${book.pages}`, "book-pages")
    );
    // bookItem.appendChild(createReadElement(bookItem, book));
    // bookItem.appendChild(createBookElement("button", "X", "delete"));
    // bookItem.appendChild(createIcons());
    // bookItem.appendChild(createEditIcon(book));
  
    // bookItem.querySelector(".delete").addEventListener("click", () => {
    //   deleteBook(index);
    // });
  
    books.insertAdjacentElement("afterbegin", bookItem);
}

function renderBooks() {
  books.textContent = "";
  myLibrary.map((book, index) => {
    createBookItem(book, index);
  });
}

renderBooks()


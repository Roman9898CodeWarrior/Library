const books = document.querySelector(".books-cards");

let myLibrary = [];

let booksNumber = document.querySelector(".books-t-number");
booksNumber.textContent = 0;

let readBooks = document.querySelector(".books-r-number");

const clearButton = document.querySelector(".options-button");

clearButton.addEventListener("click", () => {
  myLibrary = [];
  books.textContent = "";
  booksNumber.textContent = 0;
  readBooks.textContent = 0;
});

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = Math.floor(Math.random() * 1000000);
}

function addBookToLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
  saveAndRenderBooks();
}

const addBookForm = document.querySelector(".add-book-form");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  let newBook = {};
  for (let [name, value] of data) {
    if (name === "status") {
      if (value === "read") {
        newBook["status"] = true;
      } else {
        newBook["status"] = false;
      }
    } else {
      newBook[name] = value.slice(0, 35) || "";
    }
  }

  {
    addBookToLibrary(
      newBook["book-title"],
      newBook["book-author"],
      newBook["book-pages"],
      newBook["status"]
    );
  }

  addBookForm.reset();
  // booksNumber.textContent = myLibrary.length;
});

function addLocalStorage() {
  // localStorage => save things in key value pairs - key = library : myLibrary
  myLibrary = JSON.parse(localStorage.getItem("library")) || [];
  saveAndRenderBooks();
}

function deleteBook(index) {
  myLibrary.splice(index, 1);
  saveAndRenderBooks();
}

function createReadElement(bookItem, book) {
  let read = document.createElement("div");
  read.setAttribute("class", "book-read");
  read.appendChild(createBookElement("h1", "Read?", "book-read-title"));
  let input = document.createElement("input");
  input.type = "checkbox";
  input.addEventListener("click", (e) => {
    if (e.target.checked) {
      bookItem.setAttribute("class", "card book read-checked");
      book.read = true;
      saveAndRenderBooks();
    } else {
      bookItem.setAttribute("class", "card book read-unchecked");
      book.read = false;
      saveAndRenderBooks();
    }
  });
  if (book.read) {
    input.checked = true;
    bookItem.setAttribute("class", "card book read-checked");
  }
  read.appendChild(input);
  return read;
}

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
  bookItem.appendChild(createReadElement(bookItem, book));
  bookItem.appendChild(createBookElement("button", "X", "delete"));

  bookItem.querySelector(".delete").addEventListener("click", () => {
    deleteBook(index);
  });

  books.insertAdjacentElement("afterbegin", bookItem);
}

function countReadBooks() {
  let readBooksNum = 0;
  myLibrary.forEach((book) => {
    if (book.read === true) {
      readBooksNum += 1;
    }
  });
  readBooks.textContent = readBooksNum;
  console.log(readBooksNum);
}

function renderBooks() {
  books.textContent = "";
  myLibrary.map((book, index) => {
    createBookItem(book, index);
  });
}

function saveAndRenderBooks() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
  booksNumber.textContent = myLibrary.length;
  countReadBooks();
  renderBooks();
}

addLocalStorage();

const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
  const configObj = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    configObj.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return configObj;
};

const plugins = () => {
  const basePlugins = [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${filename("css")}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "app"),
        },
      ],
    }),
  ];

  if (isProd) {
    basePlugins.push(
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        cache: true,
        imageminOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            [
              "svgo",
              {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                ],
              },
            ],
          ],
        },
      })
    );
  }

  return basePlugins;
};

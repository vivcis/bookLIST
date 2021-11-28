//to view borrowed books
// to review all the books in the Library

//book class: reps a book:
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class: handle UI class
class UI {
  static displayBooks() {
    // const StoredBooks = [
    //   {
    //     title: "If Tomorrow Comes",
    //     author: "Sidney Sheldon",
    //     isbn: "123456"
    //   },
    //   {
    //     title: "The Chef",
    //     author: "Dan Brown",
    //     isbn: "123456"
    //   }
    // ];
    // const books = StoredBooks;

    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class= "btn btn-danger 
    btn-sm delete">X</a></td>`;

    //to append the rows to the list
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //alert vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}
//store class: handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//event: add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //prevent default or actual submit
  e.preventDefault();

  //get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill all fields", "danger");
  } else {
    //instantiate book
    const book = new Book(title, author, isbn);

    // console.log(book);

    //add book to ui
    UI.addBookToList(book);

    //add book to store
    Store.addBook(book);

    //show success message for adding a book
    UI.showAlert("Book Added", "success");

    //clear field
    UI.clearFields();
  }
});

//event: remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  //remove book from UI
  // console.log(e.target)
  UI.deleteBook(e.target);

  //remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show success message for adding a book
  UI.showAlert("Book Removed", "success");
});

//Book Class : Represent a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>
                    `;
        list.appendChild(row);

    }
    static clearField() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            if (confirm('Are You Sure You Want to delete this'))
                el.parentElement.parentElement.remove();
        }
    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // vainsh in 3 seconds
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000)

    }

}
//Store Class: Handles Storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBooks(book){
        const books = Store.getBooks();
        console.log(typeof books);
        books.push(book);
        //console.log(JSON.stringify(books));
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn === isbn)
            books.splice(index,1);
        })
        localStorage.setItem('books',JSON.stringify(books));
    }
}

//Event: Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    // Prevent Default Values
    e.preventDefault();
    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate 
    if (title === '' || author === '' || isbn === '') {
        // alert('Please All the Fields');
        UI.showAlert('Please Fill all the Fields', 'danger');
    }
    else {
        //Instatiate a Book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add Book to localStorage
        Store.addBooks(book);

        //Clear Fields
        UI.clearField();

        // show success msg
        UI.showAlert('Book Added Successfully', 'success');
    }


})
//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // delete book from UI

    UI.deleteBook(e.target);

    //delet book from localstorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // show delete alert msg
    UI.showAlert('Book Deleted Successfully', 'info');
})
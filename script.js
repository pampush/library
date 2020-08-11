function Library() {
  this.myLibrary = new Map();
  this.sortLib = new Map(); // bad decision
}

Library.prototype.addBookToLibrary = function(book) {
  if(!book)
    return;
  const key = Date.now();
  this.myLibrary.set(key, book);
  this.sortLib.set(key, book);
}

Library.prototype.deleteBook = function(index) {
   if(typeof(index) != 'number')
    index = +index;
  this.myLibrary.delete(index);
  this.sortLib.delete(index);
}

Library.prototype.sortBooks = function(callback) {
  //for big amount of items we need to pagination and slicing map/array;
  this.sortLib = new Map([...this.myLibrary.entries()].sort((a, b) => b[1].hasRead - a[1].hasRead)) // true first
    //return (a[1].hasRead === b[1].hasRead)? 0: a[1].hasRead? -1: 1;
}

Library.prototype.changeBook = function(bookStatusNode) {
  let parent = bookStatusNode;
  while(parent.classList != 'main-item')
    parent = parent.parentNode;
  let book = library.myLibrary.get(+parent.dataset.index);
  
  bookStatusNode.classList.remove(`main-item__readstatus-${book.hasRead}`);
  book.hasRead = !book.hasRead;
  bookStatusNode.classList.add(`main-item__readstatus-${book.hasRead}`)
}

Library.prototype.render = function(parent) {
  if(!parent)
    return;
  
  while(parent.hasChildNodes()) 
    parent.removeChild(parent.lastChild);

  let library = this.myLibrary;
  if(parent.dataset.sorted == 'true')
    library = this.sortLib;

  for(let [key, book] of library) { 
    parent.innerHTML += 
    `<div class="main-item" data-index="${key}">
      <div class="main-item__delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 24 24">
          <path class="st0" d="M0,0h24v24H0V0z" fill="none"></path>
          <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M17,13H7v-2h10V13z"></path>
        </svg>
        </div>
        <h1>${book.title}</h1>
        <h2>${book.author}</h2>
        <div class="main-item__pages">${book.numberOfPages} pages</div>
        <div class="main-item__readstatus-container">
          <div class="main-item__readstatus main-item__readstatus-${book.hasRead}"></div>
        </div>
    </div>`;
    /* const div = document.createElement('div'),
          divDel = document.createElement('div'),
          divStatusContainer = document.createElement('div'),
          divStatus = document.createElement('div'),
          divPages = document.createElement('div'),
          h1 = document.createElement('h1'), 
          h2 = document.createElement('h2');


    h1.append(book.title);
    h2.append(book.author);

    divDel.classList.add('main-item__delete');
    divDel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width:"20" height="20" fill="red" viewBox="0 0 24 24">
    <path class="st0" d="M0,0h24v24H0V0z" fill="none"/>
    <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M17,13H7v-2h10V13z"/>
    </svg>`;

    divStatusContainer.classList.add('main-item__readstatus-container');
    divStatus.classList.add('main-item__readstatus');
    divStatus.classList.add(`main-item__readstatus-${book.hasRead}`);
    divStatusContainer.append(divStatus);

    divPages.append(`${book.numberOfPages} pages`);
    divPages.classList.add('main-item__pages');

    div.classList.add('main-item');
    div.setAttribute('data-index', key);
    div.append(divDel, h1, h2, divPages, divStatusContainer);
    parent.append(div); */
  }
}

function Book(title, author, numberOfPages, hasRead, ...rest) {
  this.title = title;
  this.author = author;
  this.numberOfPages = numberOfPages;
  this.hasRead = hasRead;
}


function getFormData(form) {
  const book = {};
  let checkedFlag = false;
  for(let item of form.elements) {
    if(item.type == 'text')
      book[item.name] = item.value; 
    /* change radio with tumbler. that is for learning */
    if(item.type == 'radio' && !checkedFlag) {
      if(item.checked) { 
        checkedFlag = true;
        if(item.value == 'true')
          book[item.name] = true;
        else
          book[item.name] = false;
      }
      else
        book[item.name] = false;
    }
  }
  return book;
}

const createBookButton = document.querySelector('button[value="createBook"]'),
      sortBookButton = document.querySelector('button[value="sort"]'),
      booksContainer = document.querySelector('.grid-container__main'),
      modalBox = document.querySelector('.modal'),
      modalBoxForm = document.querySelector('.modal-form'),
      //bookItem = document.querySelector('.main-item'),
      library = new Library(); // init with localStorage

createBookButton.addEventListener('click',  () => { 
  modalBox.style.display = 'block'; 
  modalBox.querySelector('input').focus(); // first input 
});

sortBookButton.addEventListener('click', (e) => { 
  if(booksContainer.dataset.sorted == 'true') {
    sortBookButton.style.backgroundColor = "red";
    booksContainer.setAttribute('data-sorted', 'false');
  }
  else {
    sortBookButton.style.backgroundColor = "green";
    booksContainer.setAttribute('data-sorted', 'true');
    library.sortBooks();
  } 
  library.render(booksContainer);
});

modalBoxForm.addEventListener('submit', (e) => {
  e.preventDefault(); // client-server disabled 
  const data = getFormData(e.target); 
  const book = new Book(...Object.values(data)); 
  library.addBookToLibrary(book); 
  library.render(booksContainer);
  modalBox.style.display = 'none';  
  modalBoxForm.reset();
});

booksContainer.addEventListener('click', (e) => {
  if(e.target.classList == 'main-item__delete') {
    library.deleteBook(e.target.parentNode.dataset.index); // or remove a single item instead?
    library.render(booksContainer);
  }else
  if(e.target.classList[0] == 'main-item__readstatus') {
    library.changeBook(e.target);
  }else
  if(e.target.classList == 'main-item') {
  }
})


let obj = new Book('title', 'author', '123', true);
library.addBookToLibrary(obj);
library.render(booksContainer);



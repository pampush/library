function Library() {
  this.myLibrary = new Map();
}

Library.prototype.addBookToLibrary = function(book) {
  if(!book)
    return;
  this.myLibrary.set(Math.floor(Math.random()*Date.now()), book);
}

Library.prototype.deleteBook = function(index) {
  if(typeof(index) != 'number')
    index = +index;
  this.myLibrary.delete(index);
}

Library.prototype.render = function(parent, library) {
  while(parent.hasChildNodes()) 
    parent.removeChild(parent.lastChild);

  if(!(library && parent))
    return;

  for(let [key, book] of library) { 
    const div = document.createElement('div'),
          divDel = document.createElement('div'),
          h1 = document.createElement('h1'), 
          h2 = document.createElement('h2');
    
    h1.append(book.title);
    h2.append(book.author);
    divDel.classList.add('main-item__delete');
    div.classList.add('main-item');
    div.setAttribute('data-index', key);
    div.append(divDel, h1, h2);
    parent.append(div);
  }
}

function Book(title, author, numberOfPages, hasRead, ...rest) {
  this.title = title;
  this.author = author;
  this.numberOfPages = numberOfPages;
  this.hasRead = hasRead;
  //this.id = Book.prototype.generateID();
}

Book.prototype.generateID = function() {
  return Math.floor(Math.random()*1000);
}

function getFormData(form) {
  const book = {};
  let checkedFlag = false;
  for(let item of form.elements) {
    if(item.type == 'text')
      book[item.name] = item.value; 
    if(item.type == 'radio' && !checkedFlag) {
      if(item.checked) { 
        checkedFlag = true;
        book[item.name] = item.value;
      }
      else
        book[item.name] = item.value;
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
      library = new Library();

createBookButton.addEventListener('click',  () => { 
  modalBox.style.display = 'block'; 
  modalBox.querySelector('input').focus(); // first input 

});

modalBoxForm.addEventListener('submit', (e) => {
  e.preventDefault(); // client-server disabled 
  const data = getFormData(e.target); 
  const book = new Book(...Object.values(data)); 
  library.addBookToLibrary(book); 
  library.render(booksContainer, library.myLibrary);
  modalBox.style.display = 'none';
  modalBoxForm.reset();
  /* check out formData object */
});

booksContainer.addEventListener('click', (e) => {
  if(e.target.classList == 'main-item__delete') {
    library.deleteBook(e.target.parentNode.dataset.index);
    library.render(booksContainer, library.myLibrary);
  }
})



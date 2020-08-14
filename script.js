function Library() {
  this.myLibrary = new Map();
  this.sortLib = new Map(); // bad approach?
}

Library.prototype.addBookToLibrary = function(...book) {
  if(!book)
    return;
  let index = 0;
  for(let item of book) {
    const key = Date.now()+index; 
    this.myLibrary.set(key, item);
    this.sortLib.set(key, item);
    localStorage.setItem(key, JSON.stringify(item))
    index++;
  }
}

/* code getter/setter */
Library.prototype.getBook = function(index) {
  if(typeof(index) != 'number')
    index = +index;
  return this.myLibrary.get(index);
}

Library.prototype.initLibrary = function(key, book) {
  if(!book)
    return;
  
    this.myLibrary.set(key, book);
    this.sortLib.set(key, book);   
}

Library.prototype.deleteBook = function(index) {
   if(typeof(index) != 'number')
    index = +index;
  this.myLibrary.delete(index);
  this.sortLib.delete(index);
  localStorage.removeItem(index);
}

/** 
 * since render() func renders book items backwards (new item at the beginning), this func should sort 
 * items backwards also 
 */ 
Library.prototype.sortBooks = function(callback) {
   // false first to render true first
  this.sortLib = new Map([...this.myLibrary.entries()].sort((a, b) => a[1].readStatus - b[1].readStatus))
    //return (a[1].readStatus === b[1].readStatus)? 0: a[1].readStatus? -1: 1;
}

Library.prototype.changeBook = function(bookStatusNode) {
  let parent = bookStatusNode;
  while(parent.classList != 'main-item')
    parent = parent.parentNode;
  let book = this.myLibrary.get(+parent.dataset.index);
  
  bookStatusNode.classList.toggle('false');
  book.readStatus = !book.readStatus;
  localStorage.setItem(+parent.dataset.index, JSON.stringify(book));
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
    parent.innerHTML = 
    `<div class="main-item" data-index="${key}">
      <div class="main-item__delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0028" viewBox="0 0 24 24">
          <path class="st0" d="M0,0h24v24H0V0z" fill="none"></path>
          <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M17,13H7v-2h10V13z"></path>
        </svg>
        </div>
        <h1>${book.title}</h1>
        <h2>${book.author}</h2>
        <div class="main-item__pages">${book.numberOfPages} pages</div>
        <div class="main-item__readstatus-container">
          <div class="main-item__readstatus ${book.readStatus?'':false}"></div>
        </div>
    </div>` + parent.innerHTML;
  }
}

function Book(title, author, numberOfPages, genre, description, readStatus, ...rest) {
  this.title = title;
  this.author = author;
  this.numberOfPages = numberOfPages;
  this.genre = genre;
  this.description = description;
  this.readStatus = readStatus;
}

function getFormData(form) {
  const book = {};
  for(let item of form.elements) {
    if(item.type == 'text')
      book[item.name] = item.value; 
    if(item.type == 'checkbox') {
      if(item.checked)
        book.readStatus = true;
      else
        book.readStatus = false;
    }
  }
  return book;
}

const createBookButton = document.querySelector('button[value="createBook"]'),
      sortBookButton = document.querySelector('.header-sort'),
      booksContainer = document.querySelector('.grid-container__main'),
      modalBox = document.querySelector('.modal'),
      modalBoxForm = document.querySelector('.modal-form'),
      sideBox = document.querySelector('.grid-container__side');
      library = new Library();
createBookButton.addEventListener('click',  () => { 
  modalBox.style.display = 'block'; 
  modalBox.querySelector('input').focus(); // first input 
});

sortBookButton.addEventListener('click', (e) => {
  if(e.target.classList.contains('active'))
    return;
  for(let node of e.target.parentNode.children)
    if(node.classList.contains('active')) {
      node.classList.remove('active');
      break;
    }
  
  e.target.classList.add('active');
  
  if(e.target.value == 'default') {
    booksContainer.setAttribute('data-sorted', 'false');
  } else
  if(e.target.value == 'read-status') {
    booksContainer.setAttribute('data-sorted', 'true');
    library.sortBooks();    
  } else
  { ; }
   
/* if we have big amount of items 
  if(e.target.value == 'default') {
    sortBookButton.querySelector(`button[value='${sortBookButton.dataset.sortoption}']`).classList.remove('active');
    e.target.classList.add('active');
    sortBookButton.setAttribute('data-sortoption', `${e.target.value}`);
    booksContainer.setAttribute('data-sorted', 'false');
  } else
  if(e.target.value == 'read-status') {
    sortBookButton.querySelector(`button[value='${sortBookButton.dataset.sortoption}']`).classList.remove('active');
    e.target.classList.add('active');
    sortBookButton.setAttribute('data-sortoption', `${e.target.value}`);
    booksContainer.setAttribute('data-sorted', 'true');
    library.sortBooks();
  } else
  if(e.target.value == 'smth')
    ; */

  library.render(booksContainer);
});

modalBoxForm.addEventListener('submit', (e) => {
  e.preventDefault(); // client-server disabled 
  const data = getFormData(e.target); 
  modalBox.style.display = 'none';  
  const book = new Book(...Object.values(data)); 
  library.addBookToLibrary(book); 
  library.render(booksContainer);
  modalBoxForm.reset();
});

modalBoxForm.addEventListener('click', (e) => {
  if(e.target.value == 'close') {
    modalBox.style.display = 'none';
    modalBoxForm.reset();
  }
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
    let book = library.getBook(e.target.dataset.index);
    if(sideBox.dataset.index == e.target.dataset.index || !sideBox.dataset.index)
      sideBox.classList.toggle('hidden');
    else
      sideBox.classList.remove('hidden');

    sideBox.setAttribute('data-index', e.target.dataset.index);
    setTimeout(() => {
      sideBox.firstElementChild.innerHTML = `
        <h1>Title</h1>
        <div>${book.title}</div>
        <h1>Author</h1>
        <div>${book.author}</div>
        <h1>Description</h1>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, enim eum excepturi adipisci modi aliquid repellat tempora ex quae eos error ducimus ratione facere reprehenderit ipsa fugiat ullam nihil? Delectus.</div>`;
      }, 200);
  } else {
      sideBox.classList.add('hidden');
    }
})

sideBox.addEventListener('touchstart', startTouch);
sideBox.addEventListener('touchmove', moveTouch);

let initialX = null;
  let initialY = null;

  function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  };

  function moveTouch(e) {
    if (initialX === null) {
      return;
    }

    if (initialY === null) {
      return;
    }

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;

    let diffX = initialX - currentX;
    let diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        console.log("swiped left");
      } else {
        // swiped right
        sideBox.classList.add('hidden');
      }  
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        console.log("swiped up");
      } else {
        // swiped down
        console.log("swiped down");
      }  
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
  };

/**
 *  books init of localStorage   
*/ 
for(let [key, item] of Object.entries(localStorage)) {
  library.initLibrary(+key, new Book(...Object.values(JSON.parse(item))));    
}

library.render(booksContainer);

function Library() {
  this.myLibrary = [];
}

Library.prototype.addBookToLibrary = function(book) {
  if(!book)
    return;
  this.myLibrary.push(book);
}

Library.prototype.render = function(parent, book) {
  /* not list */
  if(!(book && parent))
    return
  const div = document.createElement('div'), ul = document.createElement('ul'),
        h1 = document.createElement('h1'), h2 = document.createElement('h2');
  
  h1.append(book.title);
  h2.append(book.author);
  
  /*let spanArr = [];
  
   for(const [key, value] of Object.entries(book)) {
    let span = document.createElement('span');
    span.append(key + ': ' + value);
    spanArr.push(span);
   
  }*/
   
  div.classList.add('main-item');
  div.append(h1,h2);
  parent.append(div);
  /* const arr = ["div", "ul", 'li'];
  let el = arr.reduceRight((el, n) => {
    let d = document.createElement(n)
    d.appendChild(el)
    return d
  }, document.createTextNode("Text Here"))
  
  document.getElementById('container').appendChild(el) */
}

function Book(title, author, numberOfPages, hasRead, ...rest) {
  this.title = title;
  this.author = author;
  this.numberOfPages = numberOfPages;
  this.hasRead = hasRead;
  // the constructor...
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
/* const addBookToLibrary = function() {
  // do stuff here
}

const render = function() {

} */

const createBookButton = document.querySelector('button[value="createBook"]'),
      sortBookButton = document.querySelector('button[value="sort"]'),
      booksContainer = document.querySelector('.grid-container__main'),
      modalBox = document.querySelector('.modal'),
      modalBoxForm = document.querySelector('.modal-form'),
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
  library.render(booksContainer, book);
  modalBox.style.display = 'none';
  modalBoxForm.reset();
  /* check out formData object */
});




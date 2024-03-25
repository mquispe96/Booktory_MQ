import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import { useComponentVisible } from "./useComponentVisible.js";

export default function App() {
  const [bookID, setBookID] = useState(() => {
    const storedBookID = localStorage.getItem('bookID');
    return storedBookID ? JSON.parse(storedBookID) : 3;
  });
  const [bookInfo, setBookInfo] = useState({
    title: '',
    author: '',
    url: '',
    price: '',
    stock: 'In Stock'
  });
  const [bookList, setBookList] = useState(() => {
    const storedBookList = localStorage.getItem('bookList');
    return storedBookList ? JSON.parse(storedBookList) : {
      0: {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR13g9vjRUOFDFNy484lZ1UCymtHeZDzUEH2RQDEMbQUA5o-PxhTljWd0kQp2A&s',
        price: '21.87',
        stock: 'In Stock'
      },
      1: {
        title: 'Moby-Dick',
        author: 'Herman Melville',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTCuTSR8AqrVQokI9QdUaHwggRSiCXE4ncWQ&usqp=CAU',
        price: '19.27',
        stock: 'In Stock'
      },
      2: {
        title: 'The Art of War',
        author: 'Sun Tzu',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRQ_6R3q3LP-EvbNArpMqBfQqc14MEL9ovYg&usqp=CAU',
        price: '4.99',
        stock: 'In Stock'
      }
    };
  });
  const [bookDisplay, setBookDisplay] = useState([]);
  const [messageDisplay, setMessageDisplay] = useState('');
  const [updateBookID, setUpdateBookID] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [bookDetails, setBookDetails] = useState([]);
  const [sortBy, setSortBy] = useState('id a-b');
  const [searchBy, setSearchBy] = useState({
    by: 'title',
    look: ''
  });

  useEffect(() => {
    localStorage.setItem('bookList', JSON.stringify(bookList));
    createInvetoryDisplay();
  }, [bookList, sortBy, searchBy.look])


  useEffect(() => {
    localStorage.setItem('bookID', JSON.stringify(bookID));
  }, [bookID])

  const updateList = () => {
    const {title, author, price} = bookInfo;
    if(title && author && price){
      setMessageDisplay('success');
      setBookList(prevBookList =>({...prevBookList, [bookID]: bookInfo}));
      setBookInfo({
        title: '',
        author: '',
        url: '',
        price: '',
        stock: 'In Stock'
      });
      setBookID(prevBookID => prevBookID + 1);
    }
    else{
      setMessageDisplay('invalid');
    }
    setTimeout(() => {
      setMessageDisplay('');
    }, 2000);
  }

  const createInvetoryDisplay = () => {
    const display = [];
    let sortedBookListKeys = []
    const [category, direction] = sortBy.split(' ');
    let listOfKeys = undefined;
    if(searchBy.look === ''){
      listOfKeys = Object.keys(bookList);
    }
    else{
      listOfKeys = Object.keys(bookList).filter(key => {
        const fieldValue = bookList[key][searchBy.by].toLowerCase();
        return fieldValue.includes(searchBy.look);
      })
    }
    if(category === 'id'){
      if(direction === 'a-b'){
        sortedBookListKeys = listOfKeys.sort((a, b) => a - b);
      }
      else{
        sortedBookListKeys = listOfKeys.sort((a, b) => b - a);
      }
    }
    else if(category === 'title'){
      if(direction === 'a-b'){
        sortedBookListKeys = listOfKeys.sort((a, b) => bookList[a].title.localeCompare(bookList[b].title));
      }
      else{
        sortedBookListKeys = listOfKeys.sort((a, b) => bookList[b].title.localeCompare(bookList[a].title));
      }
    }
    else if(category === 'author'){
      if(direction === 'a-b'){
        sortedBookListKeys = listOfKeys.sort((a, b) => bookList[a].author.localeCompare(bookList[b].author));
      }
      else{
        sortedBookListKeys = listOfKeys.sort((a, b) => bookList[b].author.localeCompare(bookList[a].author));
      }
    }
    else if(category === 'stock'){
      if(direction === 'a-b'){
        sortedBookListKeys = listOfKeys.sort((a, b) => bookList[a].stock.localeCompare(bookList[b].stock));
      }
      else{
        sortedBookListKeys = listOfKeys.sort((a, b) => bookList[b].stock.localeCompare(bookList[a].stock));
      }
    }
    else if(category === 'price'){
      if(direction === 'a-b'){
        sortedBookListKeys = listOfKeys.sort((a, b) => bookList[a].price - bookList[b].price);
      }
      else{
        sortedBookListKeys = listOfKeys.sort((a, b) => bookList[b].price - bookList[a].price);
      }
    }
    for(const key of sortedBookListKeys){
      const { title, author, url, price, stock } = bookList[key];
      display.push(<div key={key} className = 'bookInfo'>
        <div className = 'img'>
          <img src = {(/^https:\/\/encrypted.+/).test(url) ? url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-_1dfk_DXSabBEiXoeHZxumOfsR6pawfgQ&usqp=CAU'} alt = 'Book Cover'/>
        </div>
        <div className = 'info'>
          <p className = 'info__title'>{title}</p>
          <p className = 'info__author'>{author}</p>
          <p className = 'info__stock' style = {{ background: stock === 'In Stock' ? 'rgb(35,129, 0)' : 'rgb(238,4,5)' }}>{stock}</p>
          <p className = 'info__price'>${Number(price).toFixed(2)}</p>
        </div>
        <div className = 'btns'>
          <i onClick = {() => detailsDisplay(key)} className = 'fa-solid fa-circle-info btns__more'></i>
          <i onClick = {() => updateBookFields(key)} className = 'fa-regular fa-pen-to-square btns__edit'></i>
          <i onClick = {() => deleteBook(key)} className = 'fa-solid fa-trash-can btns__delete'></i>
        </div>
      </div>);
    }
    setBookDisplay(display);
  }

  const updateBookFields = bookID => {
    setUpdateBookID(bookID);
    setSelectedBook(bookList[bookID]);
  }

  const updateBook = () => {
    const updateBookList = {...bookList};
    updateBookList[updateBookID] = selectedBook;
    setUpdateBookID('');
    setSelectedBook('');
    setBookList(updateBookList);
    setMessageDisplay('update');
    setTimeout(() => {
      setMessageDisplay('');
    }, 2000);
  }

  const deleteBook = bookID => {
    const updateBookList = {...bookList};
    delete updateBookList[bookID];
    setBookList(updateBookList);
  }

  const formatMessage = inputField => {
    if(inputField === 'title'){
      setMessageDisplay('title');
    }
    if(inputField === 'author'){
      setMessageDisplay('author');
    }
    if(inputField === 'url'){
      setMessageDisplay('url');
    }
    if(inputField === 'price'){
      setMessageDisplay('price');
    }
    setTimeout(() => {
      setMessageDisplay('');
    }, 3000);
  }

  const detailsDisplay = bookID => {
    const display = [];
    const { title, author, url, price, stock } = bookList[bookID];
    display.push(<div key={bookID} className = 'bookDetails-window'>
        <div className = 'img'>
          <img src = {(/^https:\/\/encrypted.+/).test(url) ? url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-_1dfk_DXSabBEiXoeHZxumOfsR6pawfgQ&usqp=CAU'} alt = 'Book Cover'/>
        </div>
        <div className = 'info'>
          <p className = 'info__title'>{title}</p>
          <p className = 'info__author'>{author}</p>
          <p className = 'info__stock' style = {{ background: stock === 'In Stock' ? 'rgb(35,129, 0)' : 'rgb(238,4,5)' }}>{stock}</p>
          <p className = 'info__price'>${Number(price).toFixed(2)}</p>
        </div>
        <div>
          <p onClick = {() => setIsComponentVisible(false)} className = 'bookDetails-window__close-window'>Close</p>
        </div>
      </div>);
    setBookDetails(display);
    setIsComponentVisible(true);
  }

  return (
    <>
      <section className = 'header'>
        <p>Booktory</p>
      </section>
      <section className = 'form'>
      {!updateBookID && 
            <form className = 'form-fields' onSubmit={(e) => {e.preventDefault(); updateList();}}>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-quote-left'></i>
              <input type='text' placeholder='Title' name = 'title' value = {bookInfo.title} onChange = {(e) => setBookInfo({...bookInfo, title: e.target.value})} autoComplete = 'off' onClick={() => formatMessage('title')}/>
            </div>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-feather-pointed'></i>
              <input type='text' placeholder='Author' name = 'author' value = {bookInfo.author} onChange = {(e) => setBookInfo({...bookInfo, author: e.target.value})} autoComplete = 'off' onClick={() => formatMessage('author')}/>
            </div>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-link'></i>
              <input type='url' placeholder='Image URL' name = 'url' value = {bookInfo.url} onChange = {(e) => setBookInfo({...bookInfo, url: e.target.value})} onInvalid={(e) => e.preventDefault()} autoComplete = 'off' onClick={() => formatMessage('url')}/>
            </div>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-dollar-sign'></i>
              <input type='tel' placeholder='Price' name = 'price' value = {bookInfo.price} onChange = {(e) => setBookInfo({...bookInfo, price: e.target.value})} autoComplete = 'off' onClick={() => formatMessage('price')}/>
            </div>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-cubes-stacked'></i>
              <select value = {bookInfo.stock} onChange = {(e) => setBookInfo({...bookInfo, stock: e.target.value})}>
                <option value = 'In Stock'>In Stock</option>
                <option value = 'Out of Stock'>Out of Stock</option>
              </select>
            </div>
            <button type = 'submit' className = 'form-fields__submit-btn'>Add Book</button>
          </form>}
        {updateBookID &&
          <form className = 'form-fields' onSubmit={(e) => {e.preventDefault(); updateBook();}}>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-quote-left'></i>
              <input type='text' placeholder='Title' name = 'title' value = {selectedBook.title} onChange = {(e) => setSelectedBook({...selectedBook, title: e.target.value})} autoComplete = 'off'/>
            </div>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-feather-pointed'></i>
              <input type='text' placeholder='Author' name = 'author' value = {selectedBook.author} onChange = {(e) => setSelectedBook({...selectedBook, author: e.target.value})} autoComplete = 'off'/>
            </div>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-link'></i>
              <input type='url' placeholder='Image URL' name = 'url' value = {selectedBook.url} onChange = {(e) => setSelectedBook({...selectedBook, url: e.target.value})} autoComplete = 'off'/>
            </div>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-dollar-sign'></i>
              <input type='tel' placeholder='Price' name = 'price' value = {selectedBook.price} onChange = {(e) => setSelectedBook({...selectedBook, price: e.target.value})} autoComplete = 'off'/>
            </div>
            <div className = 'form-fields__input'>
              <i className = 'fa-solid fa-cubes-stacked'></i>
              <select value = {selectedBook.stock} onChange = {(e) => setSelectedBook({...selectedBook, stock: e.target.value})}>
                <option value = 'In Stock'>In Stock</option>
                <option value = 'Out of Stock'>Out of Stock</option>
              </select>
            </div>
            <button type='submit' className = 'form-fields__submit-btn'>Save Changes</button>
          </form>}
        <div className = 'form__messages'>
          {messageDisplay === 'invalid' && <p className = 'invalid'>Please fill out all fields!</p>}
          {messageDisplay === 'success' && <p className = 'success'>Book added successfully!</p>}
          {messageDisplay === 'title' && <p className = 'format'>Title should be capitalize properly</p>}
          {messageDisplay === 'author' && <p className = 'format'>Names should be capitalize properly</p>}
          {messageDisplay === 'url' && <p className = 'format'>Make sure to copy Image URL</p>}
          {messageDisplay === 'price' && <p className = 'format'>Price should be numbers</p>}
          {messageDisplay === 'update' && <p className = 'success'>Book updated!</p>}
        </div>
      </section>
      <section className = 'BooksBy'>
        <div>
          <label htmlFor="searchBy">Search By:</label>
          <select id="searchBy" value={searchBy.by} onChange={(e) => setSearchBy({...searchBy, by: e.target.value})}>
            <option value = 'title'>Title</option>
            <option value = 'author'>Author</option>
          </select>
          <input type = 'search' placeholder='Search' name = 'search' value = {searchBy.look} onChange = {(e) => setSearchBy({...searchBy, look: e.target.value.toLowerCase()})} autoComplete = 'off'/>
        </div>
        <div>
          <label htmlFor="sortBy">Sort By:</label>
          <select id="sortBy" value = {sortBy} onChange = {(e) => setSortBy(e.target.value)}>
            <option value = 'id a-b'>Oldest - Newest</option>
            <option value = 'id b-a'>Newest - Oldest</option>
            <option value = 'title a-b'>Title A - Z</option>
            <option value = 'title b-a'>Title Z - A</option>
            <option value = 'author a-b'>Author A - Z</option>
            <option value = 'author b-a'>Author Z - A</option>
            <option value = 'stock a-b'>In Stock</option>
            <option value = 'stock b-a'>Out of Stock</option>
            <option value = 'price a-b'>Price Low - High</option>
            <option value = 'price b-a'>Price High - Low</option>
          </select>
        </div>
      </section>
      <section className = 'inventory-list'>
        {bookDisplay}
      </section>
      {isComponentVisible && <section ref={ref}>
          {bookDetails}
      </section>}
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('container'));
root.render(<App />);
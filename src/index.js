import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import { useComponentVisible } from "./Components/useComponentVisible.js";
import AddBookForm from './Components/addBookForm.js';
import UpdateBookForm from './Components/updateBookForm.js';

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
        stock: 'In Stock',
        dateAdded: '3/21/2024'
      },
      1: {
        title: 'Moby-Dick',
        author: 'Herman Melville',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTCuTSR8AqrVQokI9QdUaHwggRSiCXE4ncWQ&usqp=CAU',
        price: '19.27',
        stock: 'In Stock',
        dateAdded: '3/21/2024'
      },
      2: {
        title: 'The Art of War',
        author: 'Sun Tzu',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRQ_6R3q3LP-EvbNArpMqBfQqc14MEL9ovYg&usqp=CAU',
        price: '4.99',
        stock: 'In Stock',
        dateAdded: '3/21/2024'
      }
    };
  });

  const [inventoryDisplay, setInventoryDisplay] = useState([]);
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
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US');
      setBookList(prevBookList =>({...prevBookList, [bookID]: bookInfo}));
      setBookList(prevBookList => ({
          ...prevBookList,
          [bookID]: {
              ...bookInfo,
              dateAdded: formattedDate
          }
      }));
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
    let bookListKeys = undefined;
    const [category, direction] = sortBy.split(' ');
    if(searchBy.look === ''){
      bookListKeys = Object.keys(bookList);
    }
    else{
      bookListKeys = Object.keys(bookList).filter(key => {
        const fieldValue = bookList[key][searchBy.by].toLowerCase();
        return fieldValue.includes(searchBy.look);
      })
    }
    if(category === 'id'){
      if(direction === 'a-b'){
        bookListKeys = bookListKeys.sort((a, b) => a - b);
      }
      else{
        bookListKeys = bookListKeys.sort((a, b) => b - a);
      }
    }
    else if(category === 'price'){
      if(direction === 'a-b'){
        bookListKeys = bookListKeys.sort((a, b) => bookList[a].price - bookList[b].price);
      }
      else{
        bookListKeys = bookListKeys.sort((a, b) => bookList[b].price - bookList[a].price);
      }
    }
    else{
      if(direction === 'a-b'){
        bookListKeys = bookListKeys.sort((a, b) => bookList[a][category].localeCompare(bookList[b][category]));
      }
      else{
        bookListKeys = bookListKeys.sort((a, b) => bookList[b][category].localeCompare(bookList[a][category]));
      }
    }
    setInventoryDisplay(bookListKeys.map(key => {
      const { title, author, url, price, stock } = bookList[key];
      return (
        <div key={key} className = 'bookInfo'>
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
        </div>
      )
    }));
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
    const { title, author, url, price, stock, dateAdded } = bookList[bookID];
    setBookDetails(
      <div key={bookID} className = 'bookDetails-window'>
        <div className = 'img'>
          <img src = {(/^https:\/\/encrypted.+/).test(url) ? url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8-_1dfk_DXSabBEiXoeHZxumOfsR6pawfgQ&usqp=CAU'} alt = 'Book Cover'/>
        </div>
        <div className = 'info'>
          <p className = 'info__title'>{title}</p>
          <p className = 'info__author'>{author}</p>
          <p className = 'info__date'>Date Added: {dateAdded}</p>
          <p className = 'info__stock' style = {{ background: stock === 'In Stock' ? 'rgb(35,129, 0)' : 'rgb(238,4,5)' }}>{stock}</p>
          <p className = 'info__price'>${Number(price).toFixed(2)}</p>
        </div>
        <div>
          <p onClick = {() => setIsComponentVisible(false)} className = 'bookDetails-window__close-window'>Close</p>
        </div>
      </div>
    );
    setIsComponentVisible(true);
  }

  return (
    <>
      <section className = 'header'>
        <p>Booktory</p>
      </section>

      <section className = 'form'>
        {!updateBookID && <AddBookForm updateList = {updateList} bookInfo = {bookInfo} setBookInfo = {setBookInfo} formatMessage = {formatMessage}/>}
        
        {updateBookID && <UpdateBookForm updateBook = {updateBook} selectedBook = {selectedBook} setSelectedBook = {setSelectedBook}/>}
       
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
        {inventoryDisplay}
      </section>

      {isComponentVisible && <section ref={ref}>
          {bookDetails}
      </section>}
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('container'));
root.render(<App />);
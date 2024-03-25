import React from 'react';

const AddBookForm = ({updateList, bookInfo, setBookInfo, formatMessage}) => {
    return (
        <>
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
            </form>
        </>
    )
}

export default AddBookForm;
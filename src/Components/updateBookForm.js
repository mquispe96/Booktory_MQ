import React from 'react';

const UpdateBookForm = ({updateBook, selectedBook, setSelectedBook}) => {
    return (
        <>
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
            </form>
        </>
    )
}

export default UpdateBookForm;
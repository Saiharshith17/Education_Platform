import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './AllBooks.css';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch books from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return (
    <div className="books-loading">
      <div className="loader"></div>
      <p>Loading books...</p>
    </div>
  );

  return (
    <div className="books-list">
      {books.map(book => (
        <Link
          key={book._id}
          to={`/books/${book._id}`}
          state={{ book }} // Pass book data to detail page
          className="book-card-link"
        >
          <div className="book-card">
            <img
              src={book.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image'}
              alt={book.title}
              className="book-img"
            />
            <h4 className="book-title">{book.title}</h4>
            <p className="book-authors">{book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
            <p className="book-date">{book.publishedDate || 'No Date'}</p>
            <button className="book-cart-btn" onClick={e => {e.preventDefault(); alert(`Added "${book.title}" to cart!`);}}>Add to Cart</button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BooksList;
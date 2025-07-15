import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './AllBooks.css';
import { useBooksData } from "../src/store/booksContext.jsx";
import { useAuth } from "../src/store/auth"; 
const BooksList = () => {
  const { books, setBooks } = useBooksData();
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const [cartIds, setCartIds] = useState([]);
  

  const fetchBooks = async () => {
     if (books && books.length > 0) {
    console.log('Books already loaded, skipping fetch.');
    return;
  }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL_LOCAL}/api/books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch books from backend.');
    } finally {
      setLoading(false);
    }
  };
    const handleToggle = async (book) => {
  if (!book) return;
  const baseUrl = import.meta.env.VITE_API_BASE_URL_LOCAL;
  const url = `${baseUrl}/api/cart/toggle-book-cart/${book._id}`;


  console.log(url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      // Update local cartIds state if cart toggle
      
        setCartIds(prev => 
          prev.includes(book._id)
            ? prev.filter(id => id !== book._id)
            : [...prev, book._id]
        );
      
      alert(result.message);
    } else {
      alert(result.message || "Action failed.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong.");
  }
};

useEffect(() => {
  if (user && user.booksAdded) {
    setCartIds(user.booksAdded);
  }
}, [user]);





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
      {books.map(book => {
  const inCart = cartIds.includes(book._id);
  return (
    <Link
      key={book._id}
      to={`/books/${book._id}`}
      state={{ book }}
      className="book-card-link"
    >
      <div className="book-card">
        <img
          src={book.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image'}
          alt={book.title}
          className="book-img"
        />
        <h4 className="book-title">{book.title}</h4>
        <p className="book-authors">
          {book.authors ? book.authors.join(', ') : 'Unknown Author'}
        </p>
        <p className="book-date">{book.publishedDate || 'No Date'}</p>
        <button
          className={`book-cart-btn ${inCart ? "remove" : "add"}`}
          onClick={e => {
            e.preventDefault();
            handleToggle(book, "cart");
          }}
        >
          {inCart ? "🛒 Remove from Cart" : "🛒 Add to Cart"}
        </button>
      </div>
    </Link>
  );
})}

    </div>
  );
};

export default BooksList;
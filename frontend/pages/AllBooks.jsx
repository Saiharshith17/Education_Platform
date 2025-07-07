import React, { useEffect, useState } from 'react';
import './AllBooks.css';


const TOPICS = [
  "Programming",
  "Data Structures",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "DevOps",
  "Machine Learning",
  "Computer Science",
  "Data Structures and Algorithms",
  "Fundamentals of Computers",
  "Generative AI",
  "AI"
];
const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'AIzaSyBJnny5yn2tYE9oyp8RvFg4lycBQQ1ETuo';
  const QUERY = 'engineering';

  const fetchBooks = async () => {
    let allBooks = [];
    try {
      for (const topic of TOPICS) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(topic)}&maxResults=20&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.items) {
          allBooks = [...allBooks, ...data.items];
        }
      }
      setBooks(allBooks);
      console.log('Fetched books:', allBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    
  }, []);

  const addToCart = (book) => {
    // Replace with your cart logic
    alert(`Added "${book.volumeInfo.title}" to cart!`);
  };

  if (loading) return (
    <div className="books-loading">
      <div className="loader"></div>
      <p>Loading books...</p>
    </div>
  );

  return (
    <div className="books-list">
      {books.map(book => {
        const info = book.volumeInfo;
        return (
          <div key={book.id} className="book-card">
            <img
              src={info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image'}
              alt={info.title}
              className="book-img"
            />
            <h4 className="book-title">{info.title}</h4>
            <p className="book-authors">{info.authors ? info.authors.join(', ') : 'Unknown Author'}</p>
            <p className="book-date">{info.publishedDate || 'No Date'}</p>
            <button className="book-cart-btn" onClick={() => addToCart(book)}>Add to Cart</button>
          </div>
        );
      })}
    </div>
  );
};

export default BooksList;
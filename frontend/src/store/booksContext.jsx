// src/store/booksContext.js
import { createContext, useContext, useState, useEffect } from "react";

const BooksContext = createContext();

export const useBooksData = () => useContext(BooksContext);

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/books`);
        const data = await res.json();
        setBooks(data);
        console.log("Books fetched:", data);
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };

    fetchBooks();
  }, []); // fetch once on app load

  return (
    <BooksContext.Provider value={{ books, setBooks }}>
      {children}
    </BooksContext.Provider>
  );
};

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ExploreBooks.css";

// 👇 Just change this once for all cards
const CARD_WIDTH = 200; // Card width + gap
const CARD_WIDTH_SIZE = 210; 
export default function ExploreBooks({ books }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    const scrollEl = document.querySelector(".books-scroll");
    if (scrollEl) {
      scrollEl.style.transform = `translateX(-${index * CARD_WIDTH_SIZE}px)`;
    }
  };

  return (
    <section className="explore-books-section">
      <p className="brecommend-info">
        Discover curated books based on popular selections.
      </p>

      {books.length > 0 ? (
        <>
          <div className="books-carousel">
            <div className="books-scroll">
              {books.slice(0, 10).map((book, index) => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  state={{ book }}
                  className="book-card-link"
                >
                  <div
                    className="book-carousel-card"
                    style={{ "--delay": `${index * 0.15}s`,
                 width: `${CARD_WIDTH}px`, }}
                  >
                    <img
                      src={book.thumbnail || "https://via.placeholder.com/128x192?text=No+Image"}
                      alt={book.title}
                      className="book-img"
                    />
                    <div className="book-info">
                      <h5 className="book-title">{book.title}</h5>
                      <p className="book-author">{book.authors?.join(", ") || "Unknown Author"}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="carousel-dots">
            {books.slice(0, 10).map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
              ></span>
            ))}
          </div>
        </>
      ) : (
        <p className="empty-text">No recommended books available.</p>
      )}
    </section>
  );
}

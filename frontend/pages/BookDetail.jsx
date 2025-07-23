import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../src/store/auth";
import "./BookDetail.css";

const BookDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const book = state?.book;

  const { user, token } = useAuth();

  const [isRead, setIsRead] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [bookData, setBookData] = useState(book || null);
  const [loading, setLoading] = useState(!book);

  // Fetch book if not passed via state
  useEffect(() => {
    if (!book) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/books/${id}`)
        .then((res) => res.json())
        .then((data) => setBookData(data))
        .catch(() => setBookData(null))
        .finally(() => setLoading(false));
    }
  }, [book, id]);

  // Set read/cart state based on user
  useEffect(() => {
    if (!bookData || !user) return;
    const readIds = user.booksRead?.map((b) => b._id) || [];
    const addedIds = user.booksAdded?.map((b) => b._id) || [];
    setIsRead(readIds.includes(bookData._id));
    setIsInCart(addedIds.includes(bookData._id));
  }, [bookData, user]);


  useEffect(() => {
  if (!book || !user) return;
  setIsRead(user.booksRead?.includes(book._id));
  setIsInCart(user.booksAdded?.includes(book._id));
}, [book, user]);

  const handleToggle = async (type) => {
    if (!bookData) return;
    const url =
      type === "read"
        ? `${import.meta.env.VITE_API_BASE_URL}/api/cart/toggle-book-read/${bookData._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/cart/toggle-book-cart/${bookData._id}`;
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
        if (type === "read") setIsRead(!isRead);
        else setIsInCart(!isInCart);
        alert(result.message);
      } else {
        alert(result.message || "Action failed.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="book-detail-loading">
        <div className="loader"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div>
        <p>No book data found.</p>
        <button onClick={() => navigate("/books")}>Back to Books</button>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail-card">
        {/* LEFT: All details */}
        <div className="book-detail-info-section">
          <h1 className="book-detail-title">{bookData.title}</h1>
          <p className="book-detail-authors">
            <strong>Authors:</strong>{" "}
            {bookData.authors && bookData.authors.length > 0 ? bookData.authors.join(", ") : "Unknown"}
          </p>
          <p className="book-detail-publisher">
            <strong>Publisher:</strong> {bookData.publisher || "Unknown"}
          </p>
          <p className="book-detail-date">
            <strong>Published:</strong> {bookData.publishedDate || "Unknown"}
          </p>
          <p className="book-detail-pages">
            <strong>Pages:</strong> {bookData.pageCount || "N/A"}
          </p>
          <p className="book-detail-categories">
            <strong>Categories:</strong>{" "}
            {bookData.categories && bookData.categories.length > 0 ? bookData.categories.join(", ") : "N/A"}
          </p>
          <p className="book-detail-language">
            <strong>Language:</strong> {bookData.language?.toUpperCase() || "N/A"}
          </p>
          <p className="book-detail-sale">
            <strong>Saleability:</strong> {bookData.saleability || "N/A"}
            {bookData.isEbook !== undefined && (
              <> | <strong>eBook:</strong> {bookData.isEbook ? "Yes" : "No"}</>
            )}
          </p>
          <p className="book-detail-availability">
            <strong>PDF Available:</strong> {bookData.pdfAvailable ? "Yes" : "No"} |{" "}
            <strong>ePub Available:</strong> {bookData.epubAvailable ? "Yes" : "No"}
          </p>
           <div className="book-detail-actions">

            <button
              className={`book-read-btn ${isRead ? "remove" : "add"}`}
              onClick={() => handleToggle("read")}
            >
               {isRead ? "✔️ Unmark Read" : "📖 Mark as Read"}
            </button>
            <button
              className={`book-cart-btn ${isInCart ? "remove" : "add"}`}
              onClick={() => handleToggle("cart")}
            >
              {isInCart ? "🛒 Remove from Cart" : "🛒 Add to Cart"}
            </button>



          </div>
          {/* Book Preview */}
          {bookData.previewLink && (
            <div className="book-preview-embed">
              <strong>Preview:</strong>
              <iframe
                title="Book Preview"
                src={bookData.previewLink.replace("http://", "https://").replace(/&source=gbs_api$/, "") + "&output=embed"}
                width="100%"
                height="400"
                style={{ border: "1px solid #ccc", borderRadius: "8px", marginTop: "8px" }}
                allowFullScreen
              ></iframe>
            </div>
          )}
          <div className="book-detail-description">
            <strong>Description:</strong>
            <p>{bookData.description || "No description available."}</p>
          </div>
        </div>
        {/* RIGHT: Image and buttons */}
        <div className="book-detail-image-section">
          <img
            src={bookData.thumbnail || "https://via.placeholder.com/200x300?text=No+Image"}
            alt={bookData.title}
            className="book-detail-img"
          />
          <div className="book-detail-links">
            {bookData.previewLink && (
              <a href={bookData.previewLink} target="_blank" rel="noopener noreferrer" className="book-link-btn">
                Preview Book
              </a>
            )}
            {bookData.infoLink && (
              <a href={bookData.infoLink} target="_blank" rel="noopener noreferrer" className="book-link-btn">
                More Info
              </a>
            )}
            {bookData.canonicalVolumeLink && (
              <a href={bookData.canonicalVolumeLink} target="_blank" rel="noopener noreferrer" className="book-link-btn">
                Google Books Page
              </a>
            )}
            {bookData.webReaderLink && (
              <a href={bookData.webReaderLink} target="_blank" rel="noopener noreferrer" className="book-link-btn">
                Read Online
              </a>
            )}
          </div>
         
        </div>
      </div>
      <div className="book-detail-back">
        <button onClick={() => navigate("/books")} className="book-back-btn">
          ← Back to All Books
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
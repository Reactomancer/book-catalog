import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    authors: [],
    year: "",
    rating: "",
    isbn: "",
  });
  const bookCardStyles = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const firestore = getFirestore();
      const querySnapshot = await getDocs(collection(firestore, "books"));
      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addBook = async (event) => {
    event.preventDefault();

    if (newBook.title.trim() === "" || newBook.authors.length === 0) {
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "books"), newBook);
      setNewBook({
        title: "",
        authors: [],
        year: "",
        rating: "",
        isbn: "",
      });
      fetchBooks();
      console.log("Book added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await deleteDoc(doc(db, "books", id));
      fetchBooks();
      console.log("Book deleted with ID:", id);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const getRecommendedBook = () => {
    const currentTime = new Date().getFullYear();
    const eligibleBooks = books.filter((book) => {
      if (book.year && currentTime - book.year >= 3) {
        return true;
      }
      return false;
    });

    if (eligibleBooks.length === 0) {
      return null;
    }

    const highestRatedBooks = eligibleBooks.filter(
      (book) => book.rating !== undefined
    );

    if (highestRatedBooks.length === 0) {
      return null;
    }

    highestRatedBooks.sort((a, b) => b.rating - a.rating);

    const maxRating = highestRatedBooks[0].rating;
    const highestRatedAndRandomBooks = highestRatedBooks.filter(
      (book) => book.rating === maxRating
    );

    const randomIndex = Math.floor(
      Math.random() * highestRatedAndRandomBooks.length
    );
    return highestRatedAndRandomBooks[randomIndex];
  };

  const groupAndSortBooks = (books) => {
    const sortedBooks = [...books].sort(
      (a, b) => b.year - a.year || b.title.localeCompare(a.title)
    );
    const groups = {};
    sortedBooks.forEach((book) => {
      const groupYear = book.year || "No Year";
      if (!groups[groupYear]) {
        groups[groupYear] = [];
      }
      groups[groupYear].push(book);
    });
    return groups;
  };

  const bookGroups = groupAndSortBooks(books);
  const recommendedBook = getRecommendedBook();

  return (
    <div>
      <h1>Book Catalog</h1>
      <form onSubmit={addBook}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newBook.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="authors"
          placeholder="Authors (comma-separated)"
          value={newBook.authors}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="year"
          placeholder="Year (optional)"
          min="1800"
          value={newBook.year}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (0-10)"
          min="0"
          max="10"
          value={newBook.rating}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="isbn"
          placeholder="ISBN (optional)"
          value={newBook.isbn}
          onChange={handleInputChange}
        />
        <button type="submit">Add Book</button>
      </form>

      <h2>Recommended Book</h2>
      {recommendedBook ? (
        <div style={bookCardStyles}>
          <h4>{recommendedBook.title}</h4>
          <p>Authors: {recommendedBook.authors}</p>
          <p>ISBN: {recommendedBook.isbn}</p>
          <p>Rating: {recommendedBook.rating}</p>
        </div>
      ) : (
        <p>No recommended book found.</p>
      )}

      <h2>All Books</h2>
      {Object.entries(bookGroups).map(([year, books]) => (
        <div key={year}>
          <h3>{year}</h3>
          {books.map((book) => (
            <div key={book.id} style={bookCardStyles}>
              <h4>{book.title}</h4>
              <p>Authors: {book.authors}</p>
              {book.isbn && <p>ISBN: {book.isbn}</p>}
              {book.rating && <p>Rating: {book.rating}</p>}
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    id: "",
    title: "",
    authors: [],
    year: "",
    rating: "",
    isbn: "",
  });
  const [groupMode, setGroupMode] = useState("year");

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

    if (newBook.isbn && !validateISBN(newBook.isbn)) {
      console.error("Invalid ISBN");
      return;
    }

    try {
      const { title, authors, year, rating, isbn } = newBook;
      const bookToAdd = {
        title,
        authors: authors.split(",").map((author) => author.trim()),
        year,
        rating,
        isbn,
      };

      const docRef = await addDoc(collection(db, "books"), bookToAdd);
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

  const editBook = async (book) => {
    setNewBook({ ...book });
  };

  const updateBook = async (id) => {
    try {
      await updateDoc(doc(db, "books", id), newBook);
      setNewBook({
        id: "",
        title: "",
        authors: [],
        year: "",
        rating: "",
        isbn: "",
      });
      fetchBooks();
      console.log("Book updated with ID:", id);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const cancelEdit = () => {
    setNewBook({
      id: "",
      title: "",
      authors: [],
      year: "",
      rating: "",
      isbn: "",
    });
  };

  const validateISBN = (isbn) => {
    let regex = new RegExp(
      /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/
    );
    if (isbn == null) {
      return "false";
    }
    if (regex.test(isbn) === true) {
      return "true";
    } else {
      return "false";
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
    let sortedBooks = [...books];

    if (groupMode === "rating") {
      sortedBooks = sortedBooks.filter((book) => book.rating !== undefined);
      sortedBooks.sort((a, b) => b.rating - a.rating);
    } else if (groupMode === "author") {
      sortedBooks.sort((a, b) => a.authors[0].localeCompare(b.authors[0]));
    } else if (groupMode === "year") {
      sortedBooks.sort((a, b) => b.year - a.year);
    }

    const groups = {};
    sortedBooks.forEach((book) => {
      const groupKey = book[groupMode] || "No Value";
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(book);
    });
    return groups;
  };
  const changeGroupingMode = (mode) => {
    setGroupMode(mode);
  };

  useEffect(() => {
    changeGroupingMode("year");
  }, []);

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
          {recommendedBook.isbn && <p>ISBN: {recommendedBook.isbn}</p>}
          {recommendedBook.rating && <p>Rating: {recommendedBook.rating}</p>}
        </div>
      ) : (
        <p>No recommended book found.</p>
      )}

      <h2>All Books</h2>
      <div>
        <select
          value={groupMode}
          onChange={(e) => changeGroupingMode(e.target.value)}
        >
          <option value="year">Year</option>
          <option value="rating">Rating</option>
          <option value="author">Author</option>
        </select>
      </div>
      {Object.entries(bookGroups).map(([groupKey, books]) => (
        <div key={groupKey}>
          <h3>{groupKey}</h3>
          {books.map((book) => (
            <div key={book.id} style={bookCardStyles}>
              <h4>{book.title}</h4>
              <p>Authors: {book.authors}</p>
              {book.isbn && <p>ISBN: {book.isbn}</p>}
              {book.rating && <p>Rating: {book.rating}</p>}
              <button onClick={() => deleteBook(book.id)}>Delete</button>
              <button onClick={() => editBook(book)}>Edit</button>
            </div>
          ))}
        </div>
      ))}
      {newBook.id && (
        <div>
          <h3>Edit Book</h3>
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
          <button onClick={() => updateBook(newBook.id)}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;

package com.library.service;

import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    /**
     * Add a new book to the library
     */
    public Book addBook(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new RuntimeException("Book with ISBN " + book.getIsbn() + " already exists");
        }
        return bookRepository.save(book);
    }

    /**
     * Get all books
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * Get all available books
     */
    public List<Book> getAvailableBooks() {
        return bookRepository.findByAvailableTrue();
    }

    /**
     * Search books by title or author
     */
    public List<Book> searchBooks(String keyword) {
        return bookRepository.searchBooks(keyword);
    }

    /**
     * Get book by ID
     */
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    /**
     * Borrow a book
     */
    @Transactional
    public BorrowRecord borrowBook(Long bookId, User user) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.isAvailable()) {
            throw new RuntimeException("Book is not available for borrowing");
        }

        // Update book availability
        book.setAvailable(false);
        bookRepository.save(book);

        // Create borrow record
        BorrowRecord borrowRecord = new BorrowRecord(user, book);
        return borrowRecordRepository.save(borrowRecord);
    }

    /**
     * Return a book
     */
    @Transactional
    public BorrowRecord returnBook(Long bookId, User user) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BorrowRecord borrowRecord = borrowRecordRepository.findActiveBorrowByBookId(bookId)
                .orElseThrow(() -> new RuntimeException("No active borrow record found for this book"));

        if (!borrowRecord.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only return books that you have borrowed");
        }

        // Update borrow record
        borrowRecord.setReturnedAt(LocalDateTime.now());
        borrowRecordRepository.save(borrowRecord);

        // Update book availability
        book.setAvailable(true);
        bookRepository.save(book);

        return borrowRecord;
    }

    /**
     * Delete a book (Admin only)
     */
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.isAvailable()) {
            throw new RuntimeException("Cannot delete a borrowed book");
        }

        bookRepository.deleteById(id);
    }

    /**
     * Update a book (Admin only)
     */
    public Book updateBook(Long id, Book updatedBook) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(updatedBook.getTitle());
        book.setAuthor(updatedBook.getAuthor());
        book.setIsbn(updatedBook.getIsbn());

        return bookRepository.save(book);
    }
}
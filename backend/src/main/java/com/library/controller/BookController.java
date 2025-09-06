package com.library.controller;

import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.model.User;
import com.library.service.BookService;
import com.library.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
@Tag(name = "Books", description = "Book management APIs")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private UserService userService;

    @PostMapping
    @Operation(summary = "Add a new book", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> addBook(@Valid @RequestBody Book book, Authentication auth) {
        try {
            Book savedBook = bookService.addBook(book);
            return ResponseEntity.ok(savedBook);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    @Operation(summary = "Get all books")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available books")
    public ResponseEntity<List<Book>> getAvailableBooks() {
        return ResponseEntity.ok(bookService.getAvailableBooks());
    }

    @GetMapping("/search")
    @Operation(summary = "Search books by title or author")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(bookService.searchBooks(keyword));
    }

    @PostMapping("/{id}/borrow")
    @Operation(summary = "Borrow a book", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> borrowBook(@PathVariable Long id, Authentication auth) {
        try {
            User user = userService.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            BorrowRecord borrowRecord = bookService.borrowBook(id, user);
            return ResponseEntity.ok(borrowRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/return")
    @Operation(summary = "Return a book", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> returnBook(@PathVariable Long id, Authentication auth) {
        try {
            User user = userService.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            BorrowRecord borrowRecord = bookService.returnBook(id, user);
            return ResponseEntity.ok(borrowRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a book", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        try {
            Book updatedBook = bookService.updateBook(id, book);
            return ResponseEntity.ok(updatedBook);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a book", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.ok("Book deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
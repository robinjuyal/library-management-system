package com.library.repository;

import com.library.model.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    @Query("SELECT br FROM BorrowRecord br WHERE br.book.id = :bookId AND br.returnedAt IS NULL")
    Optional<BorrowRecord> findActiveBorrowByBookId(@Param("bookId") Long bookId);

    @Query("SELECT br FROM BorrowRecord br WHERE br.user.id = :userId AND br.returnedAt IS NULL")
    List<BorrowRecord> findActiveBorrowsByUserId(@Param("userId") Long userId);
}
package com.oliviergingras.portfolio.cvsubdomain.dataAccessLayer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "cv_files")
@Data
@NoArgsConstructor
public class CVFile {
    @Id
    @Column(name = "cv_id")
    private String cvId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Lob
    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(name = "file_data", nullable = false)
    private byte[] fileData;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    public CVFile(String fileName, byte[] fileData, Long fileSize) {
        this.cvId = java.util.UUID.randomUUID().toString();
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileSize = fileSize;
        this.uploadedAt = LocalDateTime.now();
        this.isActive = true;
    }
}

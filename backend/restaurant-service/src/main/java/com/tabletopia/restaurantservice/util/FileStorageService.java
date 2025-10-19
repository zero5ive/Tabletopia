package com.tabletopia.restaurantservice.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 파일 저장 유틸리티
 * 이미지 업로드 시 서버 로컬 디렉토리에 파일을 저장한다.
 * @author 김지민
 * @since 2025-10-10
 */
@Service
public class FileStorageService {

  @Value("${app.upload-dir}")
  private String uploadDir;

  public String save(MultipartFile file, String subDir) {
    try {
      String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
      Path dirPath = Paths.get(uploadDir, subDir);
      Files.createDirectories(dirPath);
      Path filePath = dirPath.resolve(fileName);
      file.transferTo(filePath.toFile());
      return "/uploads/" + subDir + "/" + fileName;
    } catch (IOException e) {
      throw new RuntimeException("파일 저장 실패: " + e.getMessage(), e);
    }
  }

  public void delete(String fileUrl) {
    try {
      if (fileUrl == null || fileUrl.isBlank()) return;

      String relativePath = fileUrl.replaceFirst("^/uploads/", "");
      Path filePath = Paths.get(uploadDir, relativePath);
      Files.deleteIfExists(filePath);
    } catch (IOException e) {
      throw new RuntimeException("파일 삭제 실패: " + e.getMessage(), e);
    }
  }
}

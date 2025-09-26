package com.tabletopia.realtimeservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class RealtimeServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(RealtimeServiceApplication.class, args);
  }

}

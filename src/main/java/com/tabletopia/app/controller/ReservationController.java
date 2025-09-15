package com.tabletopia.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReservationController {

    @GetMapping("/reservations/seats")
    public String seats(){
        return "redirect:/reservation/table.html";
    }
}

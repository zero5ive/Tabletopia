package com.tabletopia.realtimeservice.domain.reservation.dto;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConnectResponse {
    private String mySessionId;
    private Set<String> connectedUsers;
}

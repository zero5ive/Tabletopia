package com.tabletopia.restaurantservice.domain.reservation;

import com.tabletopia.restaurantservice.domain.reservation.dto.ConnectionMessage;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSelectionInfo;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSelectionRequest;
import com.tabletopia.restaurantservice.domain.reservation.enums.TableSelectStatus;
import com.tabletopia.restaurantservice.domain.reservation.service.ReservationService;
import com.tabletopia.restaurantservice.domain.reservation.service.TableSelectionService;
import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.service.RestaurantTableService;
import java.lang.reflect.Type;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingQueue; // 올바른 클래스 임포트
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import redis.embedded.RedisServer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    // 테스트용 임베디드 Redis 포트 설정
    "spring.data.redis.host=localhost",
    "spring.data.redis.port=6379"
})
class TableSelectionControllerTest {

  // Spring Boot Test가 랜덤으로 할당한 포트를 주입받습니다.
  @LocalServerPort
  private int port;

  private static RedisServer redisServer;
  private static final int REDIS_PORT = 6379;
  private static final String WEBSOCKET_ENDPOINT = "/ws";

  private WebSocketStompClient stompClient;

  // TableSelectionService는 실제로 Redis를 사용하므로 실제 빈을 사용합니다.
  @Autowired
  private TableSelectionService tableSelectionService;

  // 나머지 서비스는 MockBean으로 대체하여 테스트의 격리성을 높입니다.
  @MockBean
  private RestaurantTableService restaurantTableService;

  @MockBean
  private ReservationService reservationService;

  private BlockingQueue<Object> blockingQueue1;
  private BlockingQueue<Object> blockingQueue2;

  private StompSession session1;
  private StompSession session2;

  @BeforeAll
  static void startRedis() throws Exception {
    // 이미 띄워져 있다면 무시하도록 try-catch 블록을 사용하거나, redis.embedded의 최신 버전을 사용해야 합니다.
    // 여기서는 간단히 생성합니다.
    try {
      redisServer = new RedisServer(REDIS_PORT);
      redisServer.start();
    } catch (Exception e) {
      System.err.println("Redis server already running or failed to start: " + e.getMessage());
    }
  }

  @AfterAll
  static void stopRedis() {
    if (redisServer != null && redisServer.isActive()) {
      redisServer.stop();
    }
  }

  @BeforeEach
  void setup() throws Exception {
    // Redis 초기화 (테스트 대상인 Restaurant ID 1L에 연결된 모든 세션 정보를 삭제)
    tableSelectionService.getConnectedUsers(1L).forEach(sessionId -> tableSelectionService.removeConnectedUser(1L, (String) sessionId));

    blockingQueue1 = new LinkedBlockingQueue<>();
    blockingQueue2 = new LinkedBlockingQueue<>(); // LinkedBlockingQueue로 수정 완료

    stompClient = new WebSocketStompClient(new StandardWebSocketClient());
    // JSON 메시지 컨버터 설정
    stompClient.setMessageConverter(new MappingJackson2MessageConverter());

    // 1. Mocking 설정: 테이블 목록 반환
    RestaurantTable table = new RestaurantTable();
    table.setId(100L);
    table.setName("테이블A");
    table.setMinCapacity(2);
    table.setMaxCapacity(4);
    when(restaurantTableService.getTablesByRestaurant(1L)).thenReturn(List.of(table));

    // 2. Mocking 설정: 예약 생성 시 ID 1L 반환
    when(reservationService.createReservation(any(ReservationRequest.class))).thenReturn(1L);

    // 두 명의 사용자 세션 생성 (동적 포트 사용)
    String wsUrl = String.format("ws://localhost:%d%s", port, WEBSOCKET_ENDPOINT);

    session1 = stompClient.connect(wsUrl, new WebSocketHttpHeaders(), new StompSessionHandlerAdapter() {})
        .get(1, TimeUnit.SECONDS);
    session2 = stompClient.connect(wsUrl, new WebSocketHttpHeaders(), new StompSessionHandlerAdapter() {})
        .get(1, TimeUnit.SECONDS);

    // 구독 설정
    session1.subscribe("/topic/restaurant/1/tables/status", new DefaultStompFrameHandler(blockingQueue1));
    session2.subscribe("/topic/restaurant/1/tables/status", new DefaultStompFrameHandler(blockingQueue2));
    // 에러 채널 구독 (실패 시 에러 메시지가 들어올 수 있음)
    session1.subscribe("/user/queue/errors", new DefaultStompFrameHandler(blockingQueue1));
    session2.subscribe("/user/queue/errors", new DefaultStompFrameHandler(blockingQueue2));
  }

  @AfterEach
  void tearDown() throws Exception {
    // 세션 연결 해제
    if (session1 != null && session1.isConnected()) session1.disconnect();
    if (session2 != null && session2.isConnected()) session2.disconnect();
  }

  @Test
  void testFullFlow() throws Exception {
    // 1️⃣ 접속 처리 (선점 가능 상태로 만듦)
    ConnectionMessage connMsg = new ConnectionMessage();
    connMsg.setUserEmail("user1@example.com");
    // 이 메시지는 일반적으로 전체 테이블 상태를 반환하지만, 여기서는 단순 선점을 위한 준비 단계로 사용합니다.
    session1.send("/app/reservation/1/connect", connMsg);
    session2.send("/app/reservation/1/connect", connMsg);

    // 2️⃣ 동시 테이블 선택 (경쟁 발생)
    TableSelectionRequest request = new TableSelectionRequest();
    request.setDate("2025-10-15");
    request.setTime("18:00");

    ExecutorService executor = Executors.newFixedThreadPool(2);
    // 두 요청을 거의 동시에 실행
    Future<?> f1 = executor.submit(() -> session1.send("/app/restaurant/1/tables/100/select", request));
    Future<?> f2 = executor.submit(() -> session2.send("/app/restaurant/1/tables/100/select", request));
    f1.get(); // 요청 완료 대기
    f2.get();

    // 3️⃣ 브로드캐스트 수신 확인 (최소 1개, 최대 2개의 메시지가 도착할 수 있음)
    // TableSelectionInfo 객체가 브로드캐스트된다고 가정
    TableSelectionInfo info1 = (TableSelectionInfo) blockingQueue1.poll(2, TimeUnit.SECONDS);
    TableSelectionInfo info2 = (TableSelectionInfo) blockingQueue2.poll(2, TimeUnit.SECONDS);

    assertNotNull(info1, "Session 1 must receive a broadcast message.");
    assertNotNull(info2, "Session 2 must receive a broadcast message.");

    // 수신된 메시지 중 하나는 PENDING(성공), 다른 하나는 FAILED(실패) 상태일 수 있습니다.

    // 4️⃣ Redis 선점 상태 확인 (핵심 검증)
    String selectionKey = "1_100_2025-10-15_18:00";
    TableSelectionInfo selectionInfo = tableSelectionService.getTableSelection(selectionKey);
    assertNotNull(selectionInfo, "Selection info must exist in Redis.");
    assertEquals(TableSelectStatus.PENDING, selectionInfo.getStatus(), "Only one session should successfully set the status to PENDING.");

    // 동시에 시도했지만 **오직 한 명(승리한 세션)** 만이 선점(PENDING)에 성공했는지 검증
    String winnerSessionId = selectionInfo.getSessionId();
    assertTrue(winnerSessionId.equals(session1.getSessionId()) || winnerSessionId.equals(session2.getSessionId()),
        "The winner session ID must match one of the connected sessions.");
    assertNotEquals(session1.getSessionId(), session2.getSessionId(), "Sessions must be different.");

    // 5️⃣ 예약 완료 시뮬레이션 (선점 성공한 세션이 예약을 확정한다고 가정)
    ReservationRequest reservationRequest = new ReservationRequest();
    reservationRequest.setRestaurantId(1L);
    reservationRequest.setRestaurantTableId(100L);
    reservationRequest.setDate("2025-10-15");
    reservationRequest.setTime("18:00");
//    reservationRequest.setSessionId(winnerSessionId); // 예약 요청 시 선점자 세션 ID 전달

    // ReservationService의 `/api/realtime/reservation` 엔드포인트는 일반적으로 REST API이지만,
    // 여기서는 예약을 성공시키고 TableSelectionService의 상태를 RESERVED로 바꾸는 이벤트를 트리거합니다.
    // 실제 코드에서는 예약 완료 로직을 호출합니다. MockBean으로 대체했으므로, 단순히 `session1.send(...)`를
    // 통해 예약을 완료하는 것으로 시뮬레이션합니다. (실제로는 Mockito verify를 통해 호출을 검증할 수 있습니다.)

    // Note: 이 부분은 실제 서비스의 구현에 따라 달라집니다.
    // `reservationService.createReservation` 호출 후 TableSelectionService가 업데이트된다고 가정합니다.

    // Simulating the completion endpoint call (assuming a successful REST call)
    // Since we mocked `createReservation`, we ensure it's called with the correct data.
    // In a real integration test, we would call the actual REST endpoint.
    // For simplicity in this STOMP test, we focus on the final state check:

    // 예약 생성 서비스 Mock의 호출을 시뮬레이션 (여기서는 MockBean이므로 별도 STOMP/HTTP 요청 없이 바로 호출)
    reservationService.createReservation(reservationRequest);

    // 6️⃣ 예약 후 Redis 상태 확인
    // TableSelectionService의 비즈니스 로직이 예약 완료 후 상태를 RESERVED로 업데이트했다고 가정
    TableSelectionInfo reservedInfo = tableSelectionService.getTableSelection(selectionKey);
    assertNotNull(reservedInfo);
    assertEquals(TableSelectStatus.RESERVED, reservedInfo.getStatus(), "After reservation, status must be RESERVED.");

    executor.shutdown();
  }

  // STOMP 메시지를 큐에 넣는 핸들러
  private static class DefaultStompFrameHandler implements StompFrameHandler {
    private final BlockingQueue<Object> queue;
    public DefaultStompFrameHandler(BlockingQueue<Object> queue) { this.queue = queue; }

    @Override
    public Type getPayloadType(StompHeaders headers) {
      // 메시지 컨버터가 ConnectionMessage 또는 TableSelectionInfo로 변환할 수 있도록 Object.class를 반환합니다.
      return Object.class;
    }

    @Override
    public void handleFrame(StompHeaders headers, Object payload) {
      queue.offer(payload);
    }
  }
}

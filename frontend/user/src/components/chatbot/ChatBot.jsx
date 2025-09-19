import { useState, useEffect, useRef } from 'react';
import styles from './ChatBot.module.css';

export default function ChatBot() {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: '안녕하세요! 테이블토피아 도우미입니다<br/>레스토랑 예약이나 맛집 추천에 대해 도움드릴게요!', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const chatboxRef = useRef(null);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // 페이지 로드 후 3초 뒤에 미리보기 표시
    useEffect(() => {
        const previewTimeout = setTimeout(() => {
            if (!chatOpen) {
                setShowPreview(true);
            }
        }, 3000);

        return () => clearTimeout(previewTimeout);
    }, [chatOpen]);

    // 5초 후 미리보기 숨김
    useEffect(() => {
        if (showPreview) {
            const hidePreviewTimeout = setTimeout(() => {
                setShowPreview(false);
            }, 5000);
            return () => clearTimeout(hidePreviewTimeout);
        }
    }, [showPreview]);

    // 메시지 목록 변경 시 스크롤을 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 챗봇 외부 클릭 시 닫기
    useEffect(() => {
        function handleClickOutside(event) {
            if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
                setChatOpen(false);
            }
        }
        if (chatOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [chatOpen]);

    const toggleChat = () => {
        const newChatOpenState = !chatOpen;
        setChatOpen(newChatOpenState);
        setShowPreview(false); // 챗봇 버튼 클릭 시 미리보기 숨김

        if (newChatOpenState) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300); // 애니메이션 시간 고려
        }
    };

    const getBotResponse = (message) => {
        const responses = {
            '강남 맛집 추천': '강남 지역 인기 맛집을 추천드릴게요!<br>🍣 오마카세 청담 - 일식 오마카세<br>🥩 비스트로 라파엘 - 파인다이닝<br>🍜 미야의 정원 - 아시아 요리<br><br>더 자세한 정보가 필요하시면 말씀해주세요!',
            '오늘 예약 가능': '오늘 예약 가능한 레스토랑을 확인해드릴게요!<br><br>✅ 오마카세 청담 - 19:00, 21:00<br>✅ 미야의 정원 - 18:30, 20:00<br>❌ 비스트로 라파엘 - 예약 마감<br><br>예약을 원하시는 시간대를 알려주세요!',
            '데이트 코스': '로맨틱한 데이트 코스를 추천해드릴게요! 💕<br><br>🌅 점심: 미야의 정원 (분위기 좋은 아시아 요리)<br>☕ 오후: 근처 카페에서 디저트<br>🌃 저녁: 비스트로 라파엘 (파인다이닝)<br><br>특별한 날을 위한 완벽한 코스예요!'
        };
        return responses[message] || '죄송해요, 조금 더 구체적으로 말씀해주시면 더 정확한 답변을 드릴 수 있어요! 🙏<br><br>예를 들어:<br>• "강남 일식 맛집 추천"<br>• "2명 예약 가능한 곳"<br>• "특별한 날 레스토랑"<br>등으로 물어보세요!';
    };

    const handleSendMessage = (text) => {
        const userMessage = text.trim();
        if (!userMessage) return;

        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInputValue('');

        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
        }, 1000);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage(inputValue);
        }
    };

    return (
        <div className={styles.chatbotContainer} ref={chatboxRef}>
            {/* 미리보기 말풍선 */}
            <div className={`${styles.chatPreview} ${showPreview ? styles.show : ''}`}>
                <div className={styles.chatPreviewText}>궁금한 게 있으시면 물어보세요!</div>
            </div>

            {/* 채팅창 */}
            <div className={`${styles.chatbotWindow} ${chatOpen ? styles.show : ''}`}>
                <div className={styles.chatHeader}>
                    <h3>테이블토피아 도우미</h3>
                    <p>레스토랑 예약에 대해 궁금한 것을 물어보세요</p>
                </div>

                <div className={styles.chatMessages}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${styles[msg.sender]}`}
                            dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className={styles.quickResponses}>
                    <button className={styles.quickResponseBtn} onClick={() => handleSendMessage('강남 맛집 추천')}>강남 맛집 추천</button>
                    <button className={styles.quickResponseBtn} onClick={() => handleSendMessage('오늘 예약 가능')}>오늘 예약 가능</button>
                    <button className={styles.quickResponseBtn} onClick={() => handleSendMessage('데이트 코스')}>데이트 코스</button>
                </div>

                <div className={styles.chatInputArea}>
                    <div className={styles.chatInputContainer}>
                        <input
                            type="text"
                            ref={inputRef}
                            className={styles.chatInput}
                            placeholder="메시지를 입력하세요..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className={styles.chatSendBtn} onClick={() => handleSendMessage(inputValue)}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 챗봇 버튼 */}
            <button className={`${styles.chatbotButton} ${chatOpen ? styles.active : ''}`} onClick={toggleChat}>
                {chatOpen ? '✕' : '💬'}
            </button>
        </div>
    );
}

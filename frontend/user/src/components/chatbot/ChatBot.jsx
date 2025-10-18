import { useState, useEffect, useRef } from "react"
import axios from "axios"
import styles from "./ChatBot.module.css"

export default function ChatBot() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      text: "안녕하세요! 테이블토피아 도우미입니다<br/>지역 기반 맛집 추천을 도와드릴게요!",
      sender: "bot",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const chatboxRef = useRef(null)
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const previewTimeout = setTimeout(() => {
      if (!chatOpen) setShowPreview(true)
    }, 3000)
    return () => clearTimeout(previewTimeout)
  }, [chatOpen])

  useEffect(() => {
    if (showPreview) {
      const hidePreviewTimeout = setTimeout(() => {
        setShowPreview(false)
      }, 5000)
      return () => clearTimeout(hidePreviewTimeout)
    }
  }, [showPreview])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    function handleClickOutside(e) {
      if (chatboxRef.current && !chatboxRef.current.contains(e.target)) setChatOpen(false)
    }
    if (chatOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [chatOpen])

  const toggleChat = () => {
    const newState = !chatOpen
    setChatOpen(newState)
    setShowPreview(false)
    if (newState) setTimeout(() => inputRef.current?.focus(), 300)
  }

  const handleSendMessage = async (text) => {
    const userMessage = text.trim()
    if (!userMessage) return

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }])
    setInputValue("")

    try {
      const token = localStorage.getItem("accessToken")

      const res = await axios.post(
        "http://localhost:8002/api/chat",
        { message: userMessage },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )

      const botReply = res.data.reply
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }])
    } catch (err) {
      console.error("❌ 챗봇 요청 실패:", err)
      setMessages((prev) => [
        ...prev,
        { text: "서버 연결에 문제가 있어요 😢", sender: "bot" },
      ])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage(inputValue)
  }

  return (
    <div className={styles.chatbotContainer} ref={chatboxRef}>
      <div className={`${styles.chatPreview} ${showPreview ? styles.show : ""}`}>
        <div className={styles.chatPreviewText}>궁금한 게 있으시면 물어보세요!</div>
      </div>

      <div className={`${styles.chatbotWindow} ${chatOpen ? styles.show : ""}`}>
        <div className={styles.chatHeader}>
          <h3>테이블토피아 도우미</h3>
          <p>맛집 추천이 필요하신가요?</p>
        </div>

        <div className={styles.chatMessages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.message} ${styles[msg.sender]}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.quickResponses}>
          <button
            className={styles.quickResponseBtn}
            onClick={() => handleSendMessage("강남 맛집 추천")}
          >
            강남 맛집 추천
          </button>
          <button
            className={styles.quickResponseBtn}
            onClick={() => handleSendMessage("홍대 맛집 추천")}
          >
            홍대 맛집 추천
          </button>
          <button
            className={styles.quickResponseBtn}
            onClick={() => handleSendMessage("종로 맛집 추천")}
          >
            종로 맛집 추천
          </button>
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
            <button
              className={styles.chatSendBtn}
              onClick={() => handleSendMessage(inputValue)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button
        className={`${styles.chatbotButton} ${chatOpen ? styles.active : ""}`}
        onClick={toggleChat}
      >
        {chatOpen ? "✕" : "💬"}
      </button>
    </div>
  )
}

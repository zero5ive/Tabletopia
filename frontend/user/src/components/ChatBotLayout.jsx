import { Outlet } from 'react-router-dom';
import ChatBot from './chatbot/ChatBot';

const ChatBotLayout = () => {
  return (
    <>
      <Outlet />
      <ChatBot />
    </>
  );
};

export default ChatBotLayout;

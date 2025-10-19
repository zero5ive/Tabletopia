import { Outlet } from 'react-router-dom';
import ChatBot from './chatbot/ChatBot';
import Header from './header/Header';

const ChatBotLayout = () => {
  return (
    <>
      <Header/>
      <Outlet />
      <ChatBot />
    </>
  );
};

export default ChatBotLayout;

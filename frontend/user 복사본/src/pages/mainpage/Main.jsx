import styles from './Main.module.css';
import { Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import HeroSection from './heroSection/HeroSection';
import FoodCategory from './foodcategory/FoodCategory';
import LocationCategory from './locationcategory/LocationCategory';
import Advertisement from './advertisement/Advertisement';
import NewRestaurant from './newrestaurant/NewRestaurant';
import ChatBot from '../../components/chatbot/ChatBot';

export default function Main(){
    return(
        <>
            {/* Main Content */}
            <main className={styles.mainContainer}>
                {/* HeroSection */}
                <HeroSection/>
                {/* Categories */}
                <FoodCategory/>
                <LocationCategory/>

                {/* Restaurants */}
                {/* <Advertisement/> */}
                {/* <NewRestaurant/> */}
            </main>

            {/* 챗봇 */}
            <ChatBot/>
        </>
    )
}
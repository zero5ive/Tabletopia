import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import { MainHeader } from './MainHeader'
import { DetailHeader } from './DetailHeader'
import { WaitingStatus } from './WaitingStatus'

export default function Header({children}){
    return(
        <>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link to="/" className={styles.logo}>
                        <img src="/ChatGPT Image 2025년 10월 13일 오후 03_14_22-Photoroom.png" alt="Tabletopia Logo" className={styles.logoImage} />
                        테이블토피아
                    </Link>
                    <WaitingStatus/>
                    <MainHeader/>
                    {/* {<DetailHeader/>} */}
                </div>
            </header>
        </>
    )
}

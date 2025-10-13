import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import { MainHeader } from './MainHeader'
import { DetailHeader } from './DetailHeader'

export default function Header({children}){
    return(
        <>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link to="/" className={styles.logo}>테이블토피아</Link>
                    <MainHeader/>
                    {/* <DetailHeader/> */}
                </div>                      
            </header>
        </>
    )
}

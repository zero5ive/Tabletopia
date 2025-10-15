import styles from '../Main.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react';
import { getCategoryList } from '../../utils/RestaurantCategory'


export default function FoodCategory() {

    const [categoryList, setCategoryList] = useState([]);

    // 카테고리 아이콘 목록
    const categoryIcons = {
        '한식': '🍚',
        '중식': '🥢',
        '일식': '🍣',
        '양식': '🍝',
        '기타': '🍽️'
    };

    //카레고리 리스트 함수
    const fetchCategoryList = async () => {
        try {
            const response = await getCategoryList();
            console.log('카테고리 리스트', response);

            setCategoryList(response.data);
        } catch (error) {
            console.error('카테고리 조회 실패:', error);
        }
    }

    useEffect(() => {
        fetchCategoryList();
    }, [])

    return (
        <>
            <section>
                <h2 className={styles.sectionTitle}>어떤 음식이 드시고 싶으세요?</h2>
                <div className={styles.categoriesGrid}>
                    {categoryList.map(category => (
                        <Link 
                            key={category.id} 
                            to={`/restaurant/list?categoryId=${category.id}`} 
                            className={styles.noUnderline}
                        >
                            <div className={styles.categoryItem}>
                                <div className={styles.categoryIcon}>
                                    {categoryIcons[category.name]}
                                </div>
                                <div className={styles.categoryName}>
                                    {category.name}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    )
}
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './MyWaiting.module.css'
import { getBookmarks, deleteBookmark } from '../utils/UserApi'

export default function MyBookMark() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const pageSize = 10

    useEffect(() => {
        fetchBookmarks(currentPage)
    }, [currentPage])

    const fetchBookmarks = async (page) => {
        setLoading(true)
        try {
            const response = await getBookmarks(page, pageSize)
            const data = response.data
            console.log(response.data.content);
            if (data.success) {
                console.log('북마크 조회 성공:', {
                    현재페이지: page,
                    조회개수: data.data.content.length,
                    전체페이지: data.data.totalPages,
                    전체개수: data.data.totalElements
                })
                setBookmarks(data.data.content)
                setTotalPages(data.data.totalPages)
                setTotalElements(data.data.totalElements)
            } else {
                console.error('북마크 조회 실패:', data.message)
                setBookmarks([])
            }
        } catch (error) {
            console.error('북마크 조회 에러:', error)
            console.error('에러 상세:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            })
            setBookmarks([])
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo(0, 0)
    }

    const handleDeleteBookmark = async (bookmarkId) => {
        if (!window.confirm('이 북마크를 삭제하시겠습니까?')) {
            return
        }

        try {
            await deleteBookmark(bookmarkId)
            // 현재 페이지 데이터 다시 불러오기
            fetchBookmarks(currentPage)
        } catch (error) {
            console.error('❌ 북마크 삭제 실패:', error)
            alert('북마크 삭제에 실패했습니다.')
        }
    }

    const getDefaultImage = () => {
        return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=120&h=120&fit=crop'
    }


    return (
        <>
            <div className={styles['main-panel']}>
                <div className={styles['panel-header']}>
                    <h2 className={styles['panel-title']}>북마크</h2>
                </div>

                <div className={styles['bookmark-container']}>
                    {loading ? (
                        <div className={styles['loading']}>로딩중...</div>
                    ) : bookmarks.length === 0 ? (
                        <div className={styles['empty-state']}>
                            <div className={styles['icon']}>💕</div>
                            <h3>북마크한 레스토랑이 없습니다</h3>
                            <p>마음에 드는 레스토랑을 북마크해보세요!</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles['bookmarks-grid']}>
                                {bookmarks.map((bookmark, index) => (
                                    <Link
                                        key={bookmark.bookmarkId}
                                        to={`/restaurant/${bookmark.restaurantId}`}
                                        className={styles['bookmark-card']}
                                    >
                                        <div className={styles['bookmark-image']}>
                                            <img
                                        src={`${API_BASE_URL}/uploads/restaurants/${bookmark.mainImageUrl}`}
                                        alt={`썸네일 ${index + 1}`}
                                    />

                                            <button
                                                className={styles['bookmark-btn-overlay']}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleDeleteBookmark(bookmark.bookmarkId)
                                                }}
                                            >
                                                ❤️
                                            </button>
                                        </div>
                                        <div className={styles['bookmark-content']}>
                                            <h3 className={styles['bookmark-title']}>{bookmark.restaurantName}</h3>
                                            <p className={styles['bookmark-category']}>{bookmark.categoryName}</p>
                                            <p className={styles['bookmark-address']}>{bookmark.address}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* 페이지네이션 */}
                {!loading && totalPages > 1 && (
                    <div className={styles['pagination']}>
                        <button
                            className={styles['page-btn']}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            이전
                        </button>

                        <div className={styles['page-numbers']}>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles['page-number']} ${currentPage === index ? styles['active'] : ''}`}
                                    onClick={() => handlePageChange(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            className={styles['page-btn']}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            다음
                        </button>
                    </div>
                )}

                {/* 총 개수 표시 */}
                {!loading && totalElements > 0 && (
                    <div className={styles['total-count']}>
                        총 {totalElements}개의 북마크
                    </div>
                )}
            </div>
        </>
    )
}
import { useWebSocket } from '../contexts/WebSocketContext'

export default function NotificationPopup({ show, onClose }) {
    const { notifications } = useWebSocket()

    if (!show) return null

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">🔔 알림</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">
                        {notifications.length === 0 ? (
                            <div className="text-center text-muted py-4">
                                새로운 알림이 없습니다.
                            </div>
                        ) : (
                            <div className="notification-list">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`notification-item p-3 mb-2 rounded ${notification.type === 'WAITING_CALLED'
                                                ? 'bg-primary bg-opacity-10'           // 웨이팅 호출만 파란색
                                                : notification.read
                                                    ? 'bg-light bg-opacity-10'         
                                                    : 'bg-secondary bg-opacity-10'     
                                            }`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">
                                                    {notification.title}
                                                    {(
                                                        <span className="badge bg-primary ms-2">{notification.name}</span>
                                                    )}
                                                </h6>
                                                <p className="mb-1 text-muted">{notification.message}</p>
                                                <small className="text-muted">{notification.time}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
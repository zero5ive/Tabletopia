import './ImageGallery.css'

export default function ImageGallery(){
    return(
        <>
                    <div className="image-gallery">
                🍣 레스토랑 이미지
                <div className="gallery-nav">1/5</div>
                <div className="image-thumbs">
                    <div className="thumb active"></div>
                    <div className="thumb"></div>
                    <div className="thumb"></div>
                    <div className="thumb"></div>
                    <div className="thumb"></div>
                </div>
            </div>
        </>
    )
}
import ReviewCard from '../cards/ReviewCard'

export default function ReviewsTab(){
  const reviews = [
    {user:"김**님", score:5, content:"최고의 오마카세였습니다!", date:"2025.08.28"},
    {user:"이**님", score:5, content:"생일 기념으로 방문했는데 정말 만족스러웠어요.", date:"2025.08.25"},
    {user:"박**님", score:4, content:"음식은 훌륭했지만 조금 비쌌어요.", date:"2025.08.22"},
  ]
  return (
    <div className="tab-pane fade" id="reviews">
      <div className="row mb-4">
        <div className="col-md-8"><h4>리뷰 관리</h4></div>
        <div className="col-md-4">
          <select className="form-select">
            <option>전체 리뷰</option><option>5점 리뷰</option>
            <option>4점 리뷰</option><option>3점 리뷰</option>
            <option>2점 리뷰</option><option>1점 리뷰</option>
          </select>
        </div>
      </div>
      {reviews.map((r, idx)=>(
        <ReviewCard key={idx} {...r}/>
      ))}
    </div>
  )
}

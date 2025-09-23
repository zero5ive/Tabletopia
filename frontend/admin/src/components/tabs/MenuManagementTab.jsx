import MenuItemCard from '../cards/MenuItemCard'

export default function MenuManagementTab(){
  return (
    <div className="tab-pane fade" id="menu-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>메뉴 관리</h4>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMenuModal">
          <i className="fas fa-plus me-1"></i>메뉴 추가
        </button>
      </div>

      <div className="row">
        <MenuItemCard title="산삼녹용달인 간장왕갑계치킨식" desc="특별한 간장왕갑계치킨식" price="33,000원" status="판매중"/>
        <MenuItemCard title="국내산 암넘 꽃게장정식" desc="국내산 암넘 꽃게장정식" price="33,000원" status="판매중"/>
        <MenuItemCard title="어수꽃게탕" desc="시원한 국물 요리" price="23,000원" status="품절"/>
        <MenuItemCard title="어수 갈치조림100%국산" desc="국산 먹갈치와 계란" price="22,000원" status="판매중"/>
      </div>
    </div>
  )
}

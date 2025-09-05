   const { createApp, reactive, ref, onMounted, computed, nextTick } = Vue;

    createApp({
      setup() {
        // 상태 관리
        const restaurants = reactive([]);
        const searchWord = ref("");
        const selectedCategory = ref("전체");
        const sidebarCollapsed = ref(false);
        const showInfoPanel = ref(false);
        const selectedRestaurant = ref(null);
        const selectedIndex = ref(-1);

        // 지도 관련 변수들
        let map = null;
        let geocoder = null;
        const markers = reactive([]);
        const overlays = reactive([]);

        // 더미 데이터 (서버에서 가져올 때까지) - 좌표 포함
        const dummyData = [
          {
            mainTitle: "나쁜짬뽕",
            place: "경북 경산시 계양로35길 13",
            url: "https://naver.me/IIZSbxES",
            category: "중식",
            img: "./nazzam.jpg",
            lat: 35.8242,
            lng: 128.7539
          },
          {
            mainTitle: "푸른영대식당", 
            place: "경북 경산시 갑제길 18",
            url: "https://naver.me/Fk5Lh2CM",
            category: "한식",
            img: "./puyoung.jpg",
            lat: 35.8234,
            lng: 128.7545
          },
          {
            mainTitle: "카츠디나인",
            place: "경북 경산시 청운로 5", 
            url: "https://naver.me/F0KwVPcu",
            category: "일식",
            img: "./D9.jpg",
            lat: 35.8256,
            lng: 128.7532
          }
        ];

        // 필터링된 레스토랑 목록
        const filteredRestaurants = computed(() => {
          let filtered = restaurants;
          
          // 카테고리 필터
          if (selectedCategory.value !== '전체') {
            filtered = restaurants.filter(r => r.category === selectedCategory.value);
          }
          
          // 검색어 필터
          if (searchWord.value.trim()) {
            filtered = filtered.filter(r => 
              r.mainTitle.toLowerCase().includes(searchWord.value.toLowerCase()) ||
              r.place.toLowerCase().includes(searchWord.value.toLowerCase())
            );
          }
          
          return filtered;
        });

        // 지도 초기화
        const initMap = () => {
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(35.108, 129.036),
            level: 5
          };

          map = new kakao.maps.Map(container, options);
          geocoder = new kakao.maps.services.Geocoder();

          // 지도 컨트롤 추가
          const mapTypeControl = new kakao.maps.MapTypeControl();
          map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

          const zoomControl = new kakao.maps.ZoomControl();
          map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

          // 지도 클릭 시 패널 닫기
          kakao.maps.event.addListener(map, 'click', () => {
            closeInfoPanel();
          });
        };

        // 서버에서 레스토랑 목록 가져오기
        const getRestaurants = async () => {
          try {
            const response = await $.ajax({
              url: "http://localhost:8888/list",
              method: "get"
            });
            
            console.log("음식점 목록: ", response);
            restaurants.splice(0);
            response.forEach(element => {
              restaurants.push(element);
            });
            
            // 지도 마커 설정 (async 제거)
            setMapMarkers(restaurants);
            
          } catch (error) {
            console.error("데이터 로드 실패:", error);
            // 더미 데이터 사용 (좌표 데이터 추가)
            restaurants.splice(0);
            const dummyWithCoords = [
              {
                mainTitle: "나쁜짬뽕",
                place: "경북 경산시 계양로35길 13",
                url: "https://naver.me/IIZSbxES",
                category: "중식",
                img: "./nazzam.jpg",
                lat: 35.8242,
                lng: 128.7539
              },
              {
                mainTitle: "푸른영대식당",
                place: "경북 경산시 갑제길 18",
                url: "https://naver.me/Fk5Lh2CM",
                category: "한식",
                img: "./puyoung.jpg",
                lat: 35.8234,
                lng: 128.7545
              },
              {
                mainTitle: "카츠디나인",
                place: "경북 경산시 청운로 5",
                url: "https://naver.me/F0KwVPcu",
                category: "일식",
                img: "./D9.jpg",
                lat: 35.8256,
                lng: 128.7532
              }
            ];
            dummyWithCoords.forEach(element => {
              restaurants.push(element);
            });
            setMapMarkers(restaurants);
          }
        };

        // 지도 마커 설정
        const setMapMarkers = (data) => {
          // 기존 마커/오버레이 제거
          clearMarkers();

          for (let i = 0; i < data.length; i++) {
            try {
              // 서버에서 받은 좌표 데이터 사용 (lat, lng 또는 latitude, longitude)
              const lat = data[i].lat || data[i].latitude;
              const lng = data[i].lng || data[i].longitude;
              
              if (!lat || !lng) {
                console.warn('좌표 데이터가 없습니다:', data[i]);
                continue;
              }

              const coords = new kakao.maps.LatLng(lat, lng);

              // 마커 생성
              const marker = new kakao.maps.Marker({
                position: coords,
                map: map
              });

              // 커스텀 오버레이 생성
              const overlay = new kakao.maps.CustomOverlay({
                position: coords,
                content: `<div class="custom-overlay">${data[i].mainTitle}</div>`,
                yAnchor: 1.3
              });

              markers.push(marker);
              overlays.push(overlay);

              // 마커 클릭 이벤트
              kakao.maps.event.addListener(marker, 'click', () => {
                selectRestaurant(data[i], i);
              });

            } catch (error) {
              console.error('마커 생성 실패:', data[i], error);
            }
          }
        };

        // 주소를 좌표로 변환 (시, 도까지 있어야 함.) (더 이상 사용하지 않음)
        const getCoordsByAddress = (address) => {
          return new Promise((resolve, reject) => {
            geocoder.addressSearch(address, (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                resolve(coords);
              } else {
                reject(new Error('주소 변환 실패: ' + address));
              }
            });
          });
        };

        // 마커 제거
        const clearMarkers = () => {
          markers.forEach(marker => marker.setMap(null));
          overlays.forEach(overlay => overlay.setMap(null));
          markers.splice(0);
          overlays.splice(0);
        };

        // 레스토랑 선택 (카드 클릭 시)
        const selectRestaurant = (restaurant, index) => {
          selectedIndex.value = index;
          selectedRestaurant.value = restaurant;
          showInfoPanel.value = true;

          if (markers[index]) {
            // 해당 마커로 지도 이동 (정보창이 마커를 가려서 꺼둠)
            //map.panTo(markers[index].getPosition());
            showOverlay(index);
          }

          // 선택된 카드가 보이도록 스크롤
          nextTick(() => {
            const selectedCard = document.querySelector(`.result-card[data-index="${index}"]`);
            if (selectedCard) {
              selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        };

        // 오버레이 표시
        const showOverlay = (index) => {
          // 모든 오버레이 숨기기
          overlays.forEach(overlay => overlay.setMap(null));

          // 선택된 오버레이만 표시
          if (overlays[index]) {
            overlays[index].setMap(map);
          }
        };

        // 사이드바 토글
        const toggleSidebar = () => {
          sidebarCollapsed.value = !sidebarCollapsed.value;
        };

        // 카테고리 필터링
        const filterByCategory = (category) => {
          selectedCategory.value = category;
          closeInfoPanel();
          nextTick(() => {
            setMapMarkers(filteredRestaurants.value);
          });
        };

        // 검색
        const searchRestaurants = () => {
          nextTick(() => {
            setMapMarkers(filteredRestaurants.value);
          });
        };

        // 정보 패널 닫기
        const closeInfoPanel = () => {
          showInfoPanel.value = false;
          selectedRestaurant.value = null;
          selectedIndex.value = -1;
          overlays.forEach(overlay => overlay.setMap(null));
        };

        // 컴포넌트 마운트 시 실행
        onMounted(() => {
          initMap();
          getRestaurants();
        });

        return {
          restaurants,
          searchWord,
          selectedCategory,
          sidebarCollapsed,
          showInfoPanel,
          selectedRestaurant,
          selectedIndex,
          filteredRestaurants,
          selectRestaurant,
          toggleSidebar,
          filterByCategory,
          searchRestaurants,
          closeInfoPanel
        };
      }
    }).mount("#app");
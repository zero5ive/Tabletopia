# 🍽️ 테이블토피아 - 실시간 레스토랑 예약 & 웨이팅 플랫폼

## 🧭 목차
* [🚀 프로젝트 소개](#-프로젝트-소개)
* [🎯 핵심 기능 및 시연](#-핵심-기능-및-시연)
* [🛠️ 기술 스택](#-기술-스택)
* [🏗️ 시스템 아키텍처 및 설계](#-시스템-아키텍처-및-설계)
* [⚡ 트러블 슈팅 및 의사결정](#-트러블-슈팅-및-의사결정)
* [🏃 ZEROFIVE 팀](#-zerofive-팀)

<!--[💻 설치 및 실행 방법](#-설치-및-실행-방법)-->

## 🚀 프로젝트 소개

**일상 속 소소한 즐거움, 외식.**

하지만 맛집을 **찾고, 예약하고, 웨이팅하는 과정**은 여전히 **불편함**으로 가득합니다.

### 😵 혹시 이런 경험, 해본 적 있으신가요?

* **🍽️ "오늘 저녁 뭐 먹지?"**
    * 네이버, 인스타그램, 카카오맵을 오가며 맛집을 찾지만, 정작 **지금 예약 가능한 곳인지 알 수가 없고...**
* **⏰ "예약 가능한 시간이 언제지? 자리는 어디지?"**
    * 전화 예약은 영업시간에만 가능하고, **원하는 자리를 선택할 수 없어 답답하고...**
* **🪑 "결제 직전에 '이미 선택된 좌석입니다'?"**
    * 좌석을 고르고, 결제를 클릭하는 순간 뜨는 **"이미 선택된 좌석입니다."** 한 마디에 처음부터 다시 시작해야 하는 짜증나는 경험...
* **🚶 "웨이팅 몇 팀이나 남았지?"**
    * 내 차례가 언제인지, **얼마나 더 기다려야 하는지** 알 수 없어 막연하고...
* **🔍 "이 식당 분위기는 어때?"**
    * 광고성 리뷰와 오래된 정보들 사이에서 **진짜 방문 후기를 찾기란 너무 어렵고...**

<br>

✨ **테이블토피아는 이런 불편함을 모두 해결하는 데서 시작했습니다.**

---

## 🎯 핵심 기능 및 시연

테이블토피아는 사용자 및 사장님 모두에게 **최적화된 외식/운영 경험**을 제공합니다.

### 1. 📱 실시간 테이블 현황 확인 (No More '이선좌'!)
https://github.com/user-attachments/assets/0652af43-5253-4e0c-a17d-7e684d8bca22

* **WebSocket + Redis 기반 실시간 동기화**
* 다른 사용자가 좌석을 홀드하는 즉시 반영됩니다.
* **보이는 좌석 = 예약 가능한 좌석**을 보장합니다.

### 2. ⚡ 스마트 웨이팅 시스템
https://github.com/user-attachments/assets/32df2fbc-057e-4f8c-9937-c0763e7a786a

* **대기팀 실시간 반영**으로 현재 내 앞에 몇 팀이 있는지 정확하게 확인합니다.
* **입장 알림 기능을 제공**하여 내 차례가 되면 자동으로 알림을 받아 식당 앞에서 **줄 설 필요가 없습니다.**

### 3. 🤖 AI 기반 맞춤 추천
https://github.com/user-attachments/assets/d154198c-bd43-4929-9baf-30891779eef7

* **취향·상황 기반 음식점 추천**
* **OpenAI API 활용**으로 사용자에게 가장 적합한 식당을 찾아줍니다.

### 4. ⭐ 즐겨찾기 및 실제 방문자 리뷰
https://github.com/user-attachments/assets/74a6eb7c-3340-41fc-b026-b73281d33c3b

* 좋아하는 식당을 즐겨찾기로 저장해둘 수 있습니다.
* **방문자 인증 기반**의 신뢰 가능한 후기만 제공하여 정확한 정보를 얻을 수 있습니다.

### 5. 📊 통합 매장 관리 시스템 (사장님용)
https://github.com/user-attachments/assets/6ef975df-6c27-43cc-9f9b-81d6414ba164

https://github.com/user-attachments/assets/19fc5d71-8e14-4a61-ac08-140c1d857280

* 매장 관리 + 예약 + 웨이팅 + 테이블 관리가 **하나의 시스템으로 통합**됩니다.
* 사장님을 위한 **올인원 운영 솔루션**입니다.

---

## 🛠️ 기술 스택

#### Front-End
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
#### Back-End
![Java](https://img.shields.io/badge/Java-007396?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)
![Apache Tomcat](https://img.shields.io/badge/Apache%20Tomcat-F8DC75?style=flat-square&logo=apache-tomcat&logoColor=black)
#### Database & ORM
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![JPA](https://img.shields.io/badge/JPA/Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
#### 개발 환경 (Development Environment)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white)
![macOS](https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=flat-square&logo=intellij-idea&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=flat-square&logo=gradle&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-BC0000?style=flat-square&logo=lombok&logoColor=white)
#### 형상 관리 (Version Control)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=flat-square&logo=jira&logoColor=white)
#### 외부 API (External APIs)
![Google Maps](https://img.shields.io/badge/Google%20Maps-4285F4?style=flat-square&logo=googlemaps&logoColor=white)
![Toss Payments](https://img.shields.io/badge/Toss%20Payments-0064FF?style=flat-square&logo=visa&logoColor=white)
![ChatGPT](https://img.shields.io/badge/OpenAI%20API-412991?style=flat-square&logo=openai&logoColor=white)
#### 인프라 (Infrastructure)
![Naver Cloud](https://img.shields.io/badge/Naver%20Cloud-03C75A?style=flat-square&logo=naver&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-4F4F4F?style=flat-square&logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## 🏗️ 시스템 아키텍처 및 설계

### 🗂️ 시스템 구조
<img width="1100" height="837" alt="image" src="https://github.com/user-attachments/assets/1e2bb526-7aac-4010-98ef-a94a6493442c" />

### 🔁 CD/CD 자동 배포 파이프라인
<img width="1495" height="274" alt="image" src="https://github.com/user-attachments/assets/4eae41ea-76e0-4e0a-8894-919bea8ffcb7" />

### 🗄️ ERD
<img width="4700" height="3406" alt="Tabletopia (1)" src="https://github.com/user-attachments/assets/5276ff52-d907-46ba-9dfb-df7904da8b86" />

### 🎯 유즈케이스 다이어그램
<img width="1517" height="893" alt="image" src="https://github.com/user-attachments/assets/fe5064da-ac09-4c26-8c9b-746ba4f0ce17" />


---

## ⚡ 트러블 슈팅 및 의사결정 
- **인증 방식 선택 기록 (JWT vs 세션)** [(Wiki)](https://github.com/zero5ive/Tabletopia/wiki/%EC%9D%B8%EC%A6%9D-%EB%B0%A9%EC%8B%9D-%EC%84%A0%ED%83%9D-%EA%B8%B0%EB%A1%9D-(JWT-vs-%EC%84%B8%EC%85%98))
    - **문제**: User-Service와 Realtime-Service가 분리된 환경에서, 매 요청마다 인증 서버를 거치면 발생하는 **네트워크 오버헤드** 우려.
    - **해결**: **JWT** 를 도입하고, 각 서비스가 Secret Key를 공유하여 토큰을 독립적으로 검증하는 구조 설계.
    - **결과**: 서비스 간 의존성을 줄이고, 별도의 네트워크 통신 없이 **서명(Signature) 검증**만으로 빠른 인증 처리를 구현.
- **테이블 선점에 Redis 도입하기** [(Wiki)](https://github.com/zero5ive/Tabletopia/wiki/Redis-%EA%B8%B0%EB%B0%98-%EC%8B%A4%EC%8B%9C%EA%B0%84-%ED%85%8C%EC%9D%B4%EB%B8%94-%EC%84%A0%EC%A0%90-%EC%8B%9C%EC%8A%A4%ED%85%9C)
    - **문제:** 다수의 사용자가 동시에 동일 좌석을 선택할 때 발생하는 **동시성 이슈**와 RDBMS 부하.
    - **해결:** **Redis**를 도입하여 실시간 좌석 선점(Hold) 시스템 구축.
    - **결과:** 인메모리의 빠른 속도와 **싱글 스레드 기반의 원자성**을 활용해 데이터 무결성 보장 및 DB 부하 최소화.

- **네이버 클라우드 배포 및 트러블 슈팅** [(Wiki)](https://github.com/zero5ive/Tabletopia/wiki/%EB%84%A4%EC%9D%B4%EB%B2%84-%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)
    - **배경**: 국내 사용자에게 최적화된 네트워크 속도와 초기 인프라 비용 효율성을 고려하여 **Naver Cloud Platform** 채택.
    - **구현**: **Docker & Docker Compose**를 활용하여 Spring Boot(App), MySQL(DB), Redis(Cache), React(Web) 컨테이너를 통합 관리하는 환경 구축.
    - **트러블 슈팅**: 배포 과정에서 발생한 한글 인코딩 깨짐, CORS 포트 매핑 문제, Nginx 라우팅 오류 등을 해결하고 문서화하여 운영 안정성 확보.


---
## 🏃 ZEROFIVE 팀
<table align="center"> 
  <tr> 
        <td align="center" width="150"> 
      <img src="https://github.com/sh-Dang.png" width="100" style="border-radius: 50%;"/><br/> 
      <b>이세형</b><br/> 
      <sub>
         로그인/회원가입<br>결제 연동
      </sub><br/> <!-- 담당 파트 추가 -->
           <br>
      <a href="https://github.com/sh-Dang">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/> 
      </a> 
    </td>
    <td align="center" width="150"> 
      <img src="https://github.com/yejeeni.png" width="100" style="border-radius: 50%;"/><br/> 
      <b>김예진</b><br/> 
      <sub>
         테이블 예약<br>
         Docker 배포 & NCP 인프라
      </sub><br/> <!-- 담당 파트 추가 -->
      <a href="https://github.com/yejeeni">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/> 
      </a> 
    </td> 
        <td align="center" width="150"> 
      <img src="https://github.com/Shypanda0119.png" width="100" style="border-radius: 50%;"/><br/> 
      <b>김지민</b><br/> 
      <sub>
         챗봇<br>
         관리자 페이지<br>
      </sub><br/> <!-- 담당 파트 추가 -->
      <a href="https://github.com/Shypanda0119">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/> 
      </a> 
    </td>
        <td align="center" width="150"> 
      <img src="https://github.com/dev-Kiwi7.png" width="100" style="border-radius: 50%;"/><br/> 
      <b>서예닮</b><br/> 
      <sub>
      웨이팅<br>
      마이페이지   <br>      
      </sub><br/> <!-- 담당 파트 추가 -->
      <a href="https://github.com/dev-Kiwi7">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/> 
      </a> 
    </td>
        <td align="center" width="150"> 
      <img src="https://github.com/yudinee.png" width="100" style="border-radius: 50%;"/><br/> 
      <b>성유진</b><br/> 
      <sub>
         웨이팅<br>
         메인/상세 페이지<br>
      </sub><br/> <!-- 담당 파트 추가 -->
      <a href="https://github.com/yudinee">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/> 
      </a> 
          </td>
  </tr>
</table>

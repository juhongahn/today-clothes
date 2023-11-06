# 오늘의 옷 (ver.2)
### 오늘 뭐 입고 나가지? 고민 끝! AI에 물어봐!  
'오늘의 옷'은 일간(기온, 미세먼지, 자외선 등), 주간 날씨 등을 바탕으로 GPT-3.5 Turbo 모델이 어떤 옷을 입어야 할지 추천해주는 서비스 입니다.
또한 **다른 지역의 날씨**, **관광지의 날씨** 등을 검색해 볼 수 도 있으며 옷을 추천 받을 때는 날씨 뿐만 아니라 **성별**, **퍼스널 컬러** 등 개인의 기호까지 고려합니다.  

## 📑서비스 주소
>https://www.today-clothes.xyz

## 🌟주요기능
### ⛅날씨 예보
- **일간 예보**
  - 시간별 날씨, 자외선 지수, 미세먼지, 일몰, 일출 시간 등을 제공합니다.
- **날씨 차트**
    - 온도 차트, 강수량, 강수확률 차트, 습도 차트
    - 차트 데이터를 클릭하면 그 시간의 날씨(자외선, 미세먼지, 일출/몰 시간 등)를 제공합니다.
- **날씨 검색**
  - 원하는 지역을 검색하면 해당 지역의 날씨를 제공해 줍니다.
- **관광지 추천**
  - 키워드에 따른 추천 관광지를 클릭하면 해당 관광지의 날씨를 제공해 줍니다.
- **주간 예보**
  - 10일간의 오전/오후 날씨를 제공합니다.

### 👍하루 옷차림 추천
- **현재 날씨**(최고/저 온도, 습도, 자외선, 강수...)와 성별, 퍼스널컬러와 같은 **개인 기호에** 따라서 **하루 옷차림을 추천**해 줍니다.
- 원하는 관광지나 검색한 위치의 날씨를 바탕으로도 옷을 추천 받을 수 있습니다.
## ⚒️기술 스택
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white)
![AWS Amplify](https://img.shields.io/badge/Amplify-FF9900?style=flat-square&logo=awsamplify&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/Lambda-FF9900?style=flat-square&logo=awslambda&logoColor=white)

## ↗️버전 1에서 추가된 점
- **Next.js 12에서 13으로 마이그레이션 및 app 디렉토리 사용**
- **타입스크립트 도입**
- 더 다양한 날씨 정보 추가
   - 미세먼지, 자외선, 일몰, 일출 시간, 주간 날씨 예보 등 다양한 날씨 정보 제공
- 날씨 차트 (Recharts)
  - **날씨**, **습도**, **강수 확률 및 강수량 차트** 추가하여 데이터 시각화
- 지역 검색 기능 추가
- 키워드에 따른 관광지 추천 기능 추가
- GPT-3.5 Turbo
  - 옷 추천 GPT method를 AWS Lambda로 추출
  - 옷 추천 응답을 stream으로 변경해 ux 개선(첫번째 응답까지 시간 10초 걸리던 것 -> 요청 바로 응답하도록 개선)
- 전역 상태 관리를 위해 redux-toolkit 도입
## 배운점
- Parallel and sequential data fetching pattern
  - 다른 종류의 공공 데이터 api를 받아서 처리할 때 Primise.all을 사용하여 waterfall을 방지했습니다.
  - 그리고 한 요청의 결과가 다른 요청의 파라미터가 될 때 의도적으로 sequential하게 데이터를 가져왔습니다.
- Lazy loading으로 이미지 최적화 및 컴포넌트 렌더링 최적화
  - 이미지 lazy loading: 최대 10개의 이미지를 2개만 로드하도록 해, 페이지 로드시간 개선했습니다.
  - 바로 사용하지 않는 컴포넌트의 경우 지연 로딩으로 렌더링 시간을 개선했습니다.
- 차트로 데이터 시각화
  - recharts.js 라이브러리 사용해서 날씨 데이터를 시각화 했습니다.
- OPEN AI Streaming
  - GPT가 응답을 전부 생성할 때 까지 기다리지 않고 Stream 형식을 적용해 바로바로 응답을 받을 수 있도록 했습니다.
- Redux-toolkit
  - 비동기 날씨 데이터를 전역적으로 관리하기 위해서 redux-toolkit thunk를 사용
- 공공데이터 포털 api사용 -> 요청에 필요한 데이터 처리
- 컴포넌트 별로 에러 바운더리를 두어 선언적으로 에러 관리
  - 특정 컴포넌트에 에러가 발생하면 해당 컴포넌트만 reset할 수 있도록 처리했습니다.

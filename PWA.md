# 📱 김비서 — PWA (Progressive Web App)

**김비서**를 PWA로 변환했습니다. 이제 홈 화면에 추가하여 네이티브 앱처럼 사용할 수 있습니다.

---

## 🎯 PWA 특징

✅ **홈 화면 추가** - 네이티브 앱처럼 설치
✅ **주소창 숨김** - 전체 화면 모드 (Standalone)
✅ **오프라인 지원** - Service Worker로 캐싱
✅ **빠른 로드** - 캐시된 리소스 사용
✅ **앱 아이콘** - 192x192, 512x512 아이콘
✅ **푸시 알림** - 향후 추가 가능

---

## 📁 PWA 파일 구조

```
P-pro/
├── manifest.json              # PWA 설정 파일
├── sw.js                      # Service Worker (오프라인 지원)
├── icon-192x192.png          # 홈 화면 아이콘
├── icon-192x192-maskable.png # Maskable 아이콘 (192x192)
├── icon-512x512.png          # 큰 화면용 아이콘
├── icon-512x512-maskable.png # Maskable 아이콘 (512x512)
├── index.html                # PWA 메타태그 추가됨
├── sw.js                      # Service Worker
└── PWA.md                     # 이 문서
```

### 파일별 역할

| 파일 | 역할 |
|------|------|
| **manifest.json** | PWA 메타데이터 (이름, 아이콘, 테마색) |
| **sw.js** | Service Worker - 오프라인 캐싱 |
| **icon-*.png** | 앱 아이콘 (여러 크기) |
| **index.html** | PWA 메타태그 포함 |

---

## 🚀 설치 방법

### 📱 모바일 (iOS/Android)

**Android Chrome:**
1. 앱 방문
2. 메뉴 (⋮) → "앱 설치" 또는 "홈 화면에 추가"
3. 확인

**iOS Safari:**
1. 앱 방문
2. 공유 버튼 (⤴️)
3. "홈 화면에 추가"
4. "추가"

### 💻 데스크톱

**Chrome/Edge:**
1. 주소창 옆 설치 아이콘 클릭
2. "앱 설치"
3. 확인

---

## manifest.json 설정

```json
{
  "name": "김비서 — 업무 대시보드",
  "short_name": "김비서",
  "display": "standalone",
  "theme_color": "#1a1a2e",
  "background_color": "#0d1117",
  "start_url": "/index.html",
  "scope": "/",
  "icons": [
    { "src": "/icon-192x192.png", "sizes": "192x192" },
    { "src": "/icon-512x512.png", "sizes": "512x512" }
  ]
}
```

**주요 설정:**
- `display: "standalone"` - 주소창 없이 앱처럼 실행
- `theme_color: "#1a1a2e"` - 상단 바 색상
- `icons` - 설치될 아이콘

---

## Service Worker (sw.js)

Service Worker가 다음을 처리합니다:

✅ **캐싱** - 첫 로드 시 필요한 파일 캐시
✅ **오프라인** - 캐시된 파일로 오프라인 사용
✅ **성능** - 캐시된 리소스로 빠른 로드
✅ **자동 업데이트** - 새 버전 배포 시 자동 갱신

**캐싱 전략:**
1. 요청 → 캐시 확인
2. 캐시 있음 → 즉시 반환
3. 캐시 없음 → 네트워크 요청
4. 응답 → 캐시에 저장

---

## 🔧 개발 시 주의사항

### HTTPS 필수
PWA는 HTTPS 환경에서만 작동합니다.
- ✅ Vercel 배포 (자동 HTTPS)
- ✅ localhost (로컬 개발)
- ❌ HTTP (비보안)

### Service Worker 업데이트
`sw.js`를 수정하면:
1. 배포 후 Service Worker 자동 갱신
2. 사용자는 새로고침(Ctrl+R) 필요
3. 캐시 버전: `v1` → `v2` 로 업데이트

---

## 📊 PWA 체크리스트

| 항목 | 상태 |
|------|------|
| Manifest.json 존재 | ✅ |
| Service Worker | ✅ |
| HTTPS 지원 | ✅ (Vercel) |
| 반응형 디자인 | ✅ |
| 홈 화면 아이콘 | ✅ |
| 테마 색상 | ✅ |
| 설명 메타데이터 | ✅ |

---

## 🧪 테스트

**Chrome DevTools에서 확인:**
1. F12 → Application 탭
2. Manifest 파일 확인
3. Service Workers 확인
4. Cache Storage 확인

**오프라인 테스트:**
1. DevTools → Network
2. "Offline" 체크
3. 앱 새로고침 → 캐시된 콘텐츠 표시됨

---

## 🔄 배포 후

Vercel에 푸시하면:
1. ✅ manifest.json 배포
2. ✅ sw.js 배포
3. ✅ 아이콘 배포
4. ✅ HTTPS 자동 적용
5. ✅ 사용자 설치 가능

**배포 URL:**
```
https://p-pro.vercel.app
```

---

## 📈 향후 기능

계획 중인 PWA 기능:

- 🔔 **푸시 알림** - 할 일 마감 알림
- 📝 **오프라인 편집** - 오프라인에서도 할 일 추가 후 동기화
- 🎵 **백그라운드 작업** - 정해진 시간에 백그라운드 동기화
- 📸 **카메라 접근** - 사진 기반 매출 입력
- 📍 **위치 정보** - 지역별 매출 지도

---

## 🚨 트러블슈팅

**Q: 설치 버튼이 안 보여요**
- A: HTTPS 환경 확인
- A: manifest.json이 올바른지 확인
- A: DevTools에서 오류 메시지 확인

**Q: 오프라인에서 안 돼요**
- A: Service Worker 등록 확인 (DevTools → Application)
- A: 캐시 항목 확인
- A: sw.js 파일 경로 확인

**Q: 변경사항이 반영 안 돼요**
- A: Ctrl+Shift+R (강력 새로고침)
- A: Service Worker 업데이트 대기
- A: Cache Storage 수동 삭제

---

**생성일:** 2026년 4월 8일
**PWA 버전:** 1.0.0
**Service Worker 버전:** v1

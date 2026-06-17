# HOW TO LIVE? — 웹 포트폴리오 사이트

## 폴더 구조

```
how-to-live/
├── index.html        ← 메인 HTML
├── style.css         ← 스타일
├── script.js         ← 기능 + 수정 가능한 텍스트 콘텐츠
│
├── audio/
│   ├── hover.mp3     ← 마우스 오버 소리
│   ├── click.mp3     ← 클릭 소리
│   └── transition.mp3← 화면 전환 소리
│
├── img/
│   ├── title.png           ← 타이틀 화면 이미지
│   ├── gameboard.png       ← 게임보드 이미지
│   ├── menu_1.png          ← 메뉴 버튼 1 (게임보드)
│   ├── menu_2.png          ← 메뉴 버튼 2 (게임 규칙)
│   ├── menu_3.png          ← 메뉴 버튼 3 (점수 카드)
│   ├── menu_4.png          ← 메뉴 버튼 4 (건물 카드)
│   ├── menu_5.png          ← 메뉴 버튼 5 (전하고 싶은 말)
│   ├── score_card_1.png    ← 점수 카드 앞면 1번
│   ├── ...
│   ├── score_card_35.png
│   ├── build_card_1.png    ← 건물 카드 앞면 1번
│   ├── ...
│   └── build_card_15.png
│
└── data/
    ├── rules.txt     ← 게임 규칙 텍스트 (직접 편집)
    └── message.txt   ← 전하고 싶은 말 텍스트 (직접 편집)
```

---

## 콘텐츠 수정 방법

### 이미지 교체
`img/` 폴더의 파일을 같은 이름으로 교체하면 자동 반영됩니다.

### 텍스트 수정
- `data/rules.txt` → 게임 규칙
- `data/message.txt` → 전하고 싶은 말

### 코드 내 텍스트 (script.js 상단)
```js
// 핫스팟 설명
const HOTSPOT_DESCRIPTIONS = { topLeft: "...", ... }

// 카드 소제목
const SCORE_TITLES = ["제목1", "제목2", ...]
const BUILD_TITLES = ["제목1", "제목2", ...]
```

---

## 로컬 실행 (VS Code Live Server)
1. `how-to-live/` 폴더를 VS Code에서 열기
2. `index.html` 우클릭 → "Open with Live Server"

## 배포 (GitHub Pages)
1. 저장소에 push
2. Settings → Pages → Branch 설정
3. `index.html`이 루트에 있으면 바로 동작

---

## 사운드 없이도 동작
audio 파일이 없으면 소리 없이 정상 작동합니다.

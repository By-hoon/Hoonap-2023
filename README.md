<h1 align="center">Hoonap-2023</h1>

[Hoonap](https://github.com/By-hoon/Hoonap) 업그레이드 버전

<br>

> ## 사용 스택

- Next
- Typescript
- Tailwind

<br>

> ## 디렉토리 구조

```bash
src
├── components
│   ├── common
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── Loading.tsx
│   │   └── Title.tsx
│   ├── create
│   │   ├── MapOption.tsx
│   │   ├── SaveImage.tsx
│   │   └── SavePath.tsx
│   ├── list
│   │   └── MapOption.tsx
│   ├── story
│   │   └── Preview.tsx
│   ├── user
│   │   └── MapOption.tsx
│   └── Map.tsx
└── context
│   └── authProvoider.ts
├── firebase
│   ├── auth
│   │   ├── checkUser.ts
│   │   ├── getUser.ts
│   │   ├── signIn.ts
│   │   ├── signOut.ts
│   │   └── signUp.ts
│   ├── firestore
│   │   ├── addData.ts
│   │   ├── getCollection.ts
│   │   ├── getDocument.ts
│   │   └── setData.ts
│   ├── storage
│   │   ├── addFile.ts
│   │   └── deleteFile.ts
│   ├── adminConfig.ts
│   └── config.ts
└── hooks
│   ├── useClickOutside.ts
│   ├── useMyLocation.ts
│   └── useUser.ts
├── pages
│   ├── story
│   │   ├── detail.ts
│   │   └── list.tsx
│   ├── user
│   │   └── detail.tsx
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── 404.tsx
│   ├── create.tsx
│   ├── gallery.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── signup.tsx
└── shared
│   └── constants.ts
└── styles
│   └── globals.css
└── utils
│   └── util.ts
```

<br>

> ## 구현 기능 목록

<br>

- 회원가입
- 로그인, 로그아웃

- 게시물 작성
  - 위치 지정(naver map api)
  - 사진 등록
  - 스토리 작성
- 게시물 목록
  - 지도에서 다각형 클릭
  - 스토리 미리보기
- 게시물 상세정보
- 갤러리(이미지 목록)
- 사용자 상세정보
- 에러 페이지
  <br>

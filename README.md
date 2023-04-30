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
│   │   └── Title.tsx
│   ├── create
│   │   ├── SaveImage.tsx
│   │   └── SavePath.tsx
│   └── Map.tsx
├── firebase
│   ├── firestore
│   │   ├── addData.ts
│   │   └── getData.ts
│   ├── storage
│   │   ├── addFile.ts
│   │   └── deleteFile.ts
│   └── config.ts
├── pages
│   ├── api
│   ├── story
│   │   └── list.tsx
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── create.tsx
│   └── index.tsx
└── styles
│   └── globals.css
```

<br>

> ## 구현 기능 목록

<br>

- 게시물 작성
  - 위치 지정(naver map api)
  - 사진 등록
  - 스토리 작성
- 게시물 목록
  <br>

<h1 align="center">Hoonap-2023</h1>

### 개발 기간

    2023.05. ~ 진행중

### 배포 주소

Vercel 배포: https://hoonap-2023.vercel.app/

### 개발 인원

단독 개발

### 프로젝트 개요

[Hoonap](https://github.com/By-hoon/Hoonap) 업그레이드 버전

<br>

## 시작 가이드

### 프로젝트 실행

    $ npm install
    $ npm run dev

<br>

## 기술 스택

### Environment

<img src="https://img.shields.io/badge/Visual studio code-007ACC?style=for-the-badge&logo=Visual studio code&logoColor=white">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

### Config

<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">

### Development

<img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white">
<img src="https://img.shields.io/badge/React-000000?style=for-the-badge&logo=React&logoColor=61DAFB">
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white">
<img src="https://img.shields.io/badge/Tailwind css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">

### Deploy

<img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">

<br>

## 주요 기능

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
- 게시물 수정
- 게시물 삭제
- 갤러리(이미지 목록)
- 사용자 상세정보
- 에러 페이지

<br>

## 디렉토리 구조

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
│   │   ├── deleteDocument.ts
│   │   ├── getDocument.ts
│   │   ├── getCollection.ts
│   │   ├── setData.ts
│   │   └── updateField.ts
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
│   │   ├── edit.ts
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

<h1 align="center">Hoonap-2023</h1>

### 개발 기간

    2023.05. ~ 2024.05

    현재는 필요한 부분이 있다면, 리팩토링·업데이트

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

- 사용자 정보

  - 프로필 이미지
  - 사용자 스토리맵
  - 사용자 스토리(이미지) 목록
  - 내 정보 수정
  - 활동 로그
    - 좋아요를 누른 사진들
    - 작성한 댓글들
  - 사용자 검색

- 스토리

  - 스토리 작성
    - 위치 지정(naver map api)
    - 사진 등록
    - 스토리 내용 입력
  - 스토리 열람
    - 스토리 목록
    - 갤러리(이미지 목록)
  - 스토리 위치 확인
  - 스토리 수정
  - 스토리 삭제
  - 이미지 좋아요(Like)
  - 이미지 순위

- 댓글

  - 댓글 작성
  - 댓글 수정
  - 댓글 삭제

- 단골
  - 단골 등록·취소

<br>

## 디렉토리 구조

```bash
src
├── components
│   ├── common
│   │   ├── Alert.tsx
│   │   ├── BasicImage.tsx
│   │   ├── Button.tsx
│   │   ├── Confirm.tsx
│   │   ├── Folding.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── Like.tsx
│   │   ├── Loading.tsx
│   │   └── Title.tsx
│   ├── create
│   │   ├── PartButton.tsx
│   │   ├── SaveImage.tsx
│   │   └── SavePath.tsx
│   ├── gallery
│   │   ├── CurrentImage.tsx
│   │   └── ImageCard.tsx
│   ├── hoc
│   │   └── withHead.tsx
│   ├── story
│   │   ├── comment
│   │   │   ├── Comment.tsx
│   │   │   ├── CommentInput.tsx
│   │   │   ├── CommentMenu.tsx
│   │   │   └── Comments.tsx
│   │   ├── DetailView.tsx
│   │   ├── MenuButton.tsx
│   │   ├── MoreMenu.tsx
│   │   ├── Preview.tsx
│   │   ├── StoryContents.tsx
│   │   ├── StoryHeader.tsx
│   │   └── StoryImages.tsx
│   ├── user
│   │   ├── NicknameForm.tsx
│   │   ├── ProfileImage.tsx
│   │   └── UserCard.tsx
│   ├── Best.tsx
│   ├── Map.tsx
│   └── MapOption.tsx
└── context
│   ├── authProvoider.tsx
│   └── popUpProvider.tsx
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
│   │   ├── deleteField.ts
│   │   ├── getCollection.ts
│   │   ├── getDocument.ts
│   │   ├── getPage.ts
│   │   ├── getSnapshot.ts
│   │   ├── setData.ts
│   │   └── updateField.ts
│   ├── storage
│   │   ├── add.ts
│   │   └── delete.ts
│   ├── adminConfig.ts
│   └── config.ts
└── hooks
│   ├── useClickOutside.ts
│   ├── useMyLocation.ts
│   ├── useRegular.ts
│   └── useUser.ts
├── pages
│   ├── story
│   │   ├── detail.tsx
│   │   ├── edit.tsx
│   │   └── list.tsx
│   ├── user
│   │   ├── detail.tsx
│   │   ├── edit.tsx
│   │   ├── log.tsx
│   │   ├── search.tsx
│   │   └── story.tsx
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── 404.tsx
│   ├── create.tsx
│   ├── gallery.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   └── welcome.tsx
└── shared
│   ├── alerts.ts
│   └── constants.ts
└── styles
│   └── globals.css
└── utils
│   └── util.ts
```

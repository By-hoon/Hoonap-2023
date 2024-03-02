export const title = {
  create: "스토리 생성",
  story: "스토리 상세정보",
  editStory: "스토리 수정",
  stories: "스토리 목록",
  gallery: "갤러리",
  user: "사용자 정보",
  userStory: "사용자 스토리",
  userEdit: "사용자 정보 수정",
};

export const headTitle = {
  main: "메인 페이지",
  storyList: "스토리 목록",
  storyEdit: "스토리 수정",
  storyDetail: "스토리 상세정보",
  userDetail: "사용자 상세정보",
  userStory: "사용자 스토리",
  userEdit: "사용자 정보 수정",
  create: "스토리 생성",
  gallery: "갤러리",
  login: "로그인",
  signup: "회원가입",
};

export const headDescription = {
  main: "메인 페이지 입니다.",
  storyList: "스토리 목록 페이지입니다.",
  storyEdit: "스토리 수정 페이지입니다.",
  storyDetail: "스토리 상세정보 페이지입니다.",
  userDetail: "사용자 상세정보 페이지입니다.",
  userStory: "사용자 스토리 페이지입니다.",
  userEdit: "사용자 정보 수정 페이지입니다.",
  create: "스토리 생성 페이지입니다.",
  gallery: "갤러리 페이지입니다.",
  login: "로그인 페이지입니다.",
  signup: "회원가입 페이지입니다.",
};

export const MAX_CONTENT_WIDTH = 1200;
export const GALLERY_PADDING = 10;
export const GALLERY_CARD_MARGIN_X = 5;

export const commentSortTypes = [
  { code: "latest", name: "최신 댓글" },
  { code: "earliest", name: "오래된 댓글" },
];

export const maxNicknameLength = 20;
export const nicknameInfo = "영문·숫자 20자, 한글 10자 제한";

export const nicknameFilter = ["욕설"];

export const alertTitle = {
  id: "아이디 오류",
  password: "비밀번호 오류",
  server: "서버 오류",
  unknown: "알 수 없는 오류",
  exp: "체험하기 오류",
  access: "접근 제한",
  input: "입력 오류",
  nickname: "닉네임 오류",
};

export const alertContent = {
  invalidId: "이미 있는 아이디입니다.",
  userNotFound: "없는 사용자입니다.",
  reconfirmEmail: "이메일 형식을 확인해 주세요.",
  reconfirmPassword: "비밀번호를 다시 확인해 주세요.",
  wrongPassword: "비밀번호를 확인해 주세요",
  successSignOut: "로그아웃에 성공하였습니다.",
  failedSignOut: "로그아웃에 실패하였습니다.",
  tryAgain: "잠시 후 다시 시도해 주세요.",
  unknown: "알 수 없는 오류가 발생하였습니다.",
  invalidExp: "체험하기에서 이용할 수 없는 기능입니다.",
  nothingStory: "스토리 정보가 없습니다.",
  noUser: "사용자 정보가 없습니다.",
  noMoreStory: "더 이상 불러올 스토리가 없습니다.",
  storyAfterImage: "스토리 작성은 이미지 입력 후 가능합니다.",
  expCreate: "체험 계정은 3개까지만 스토리 등록이 가능합니다.",
  sameCategory: "현재 적용되어있는 카테고리입니다.",
  requireValue: "입력은 필수입니다.",
  inValidNickname: "닉네임 형식을 확인해 주세요.",
  nicknameLength: "더 길게 닉네임을 설정할 수 없습니다.",
  nicknameFilter: "사용할 수 없는 단어가 포함되어 있습니다.",
};

export const confirmTitle = {
  signOut: "로그아웃 하시겠습니까?",
  deleteStory: "스토리를 삭제하시겠습니까?",
  editStory: "스토리를 수정하시겠습니까?",
  deleteRegularMy: "내가 등록한 단골을 취소하시겠습니까?",
  deleteRegularMe: "나를 등록한 단골을 삭제하시겠습니까?",
  deleteProfileImage: "현재 프로필 사진을 삭제하시겠습니까?",
};

export const confirmContent = {
  signOut: "로그인 페이지로 넘어갑니다.",
  deleteStory: "삭제된 스토리는 다시 복구할 수 없습니다.",
  editStory: "수정된 내용은 다시 복구할 수 없습니다.",
  deleteRegularMy: "취소 대상",
  deleteRegularMe: "삭제 대상",
  deleteProfileImage: "삭제된 사진은 다시 복구할 수 없습니다.",
};

export const expInfo = [
  "스토리는 3개까지 생성할 수 있어요",
  "체험하기에서 생성하신 스토리 정보들은 로컬에 저장돼요",
  "로그아웃을 해야 로컬에 저장된 정보들이 삭제돼요",
  "아래 기능들은 체험이 제한돼요",
];

export const addInfo = {
  expSubtitle: "체험 안내사항",
  expRestricts: ["내 정보 조회", "댓글"],
};

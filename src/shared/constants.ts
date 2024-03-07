export const TITLE = {
  CREATE: "스토리 생성",
  STORY: "스토리 상세정보",
  EDIT_STORY: "스토리 수정",
  STORIES: "스토리 목록",
  GALLERY: "갤러리",
  USER: "사용자 정보",
  USER_STORY: "사용자 스토리",
  USER_EDIT: "사용자 정보 수정",
};

export const HEAD_TITLE = {
  MAIN: "메인 페이지",
  STORY_LIST: "스토리 목록",
  STORY_EDIT: "스토리 수정",
  STORY_DETAIL: "스토리 상세정보",
  USER_DETAIL: "사용자 상세정보",
  USER_STORY: "사용자 스토리",
  USER_EDIT: "사용자 정보 수정",
  CREATE: "스토리 생성",
  GALLERY: "갤러리",
  LOGIN: "로그인",
  SIGNUP: "회원가입",
};

export const HEAD_DESCRIPTION = {
  MAIN: "메인 페이지 입니다.",
  STORY_LIST: "스토리 목록 페이지입니다.",
  STORY_EDIT: "스토리 수정 페이지입니다.",
  STORY_DETAIL: "스토리 상세정보 페이지입니다.",
  USER_DETAIL: "사용자 상세정보 페이지입니다.",
  USER_STORY: "사용자 스토리 페이지입니다.",
  USER_EDIT: "사용자 정보 수정 페이지입니다.",
  CREATE: "스토리 생성 페이지입니다.",
  GALLERY: "갤러리 페이지입니다.",
  LOGIN: "로그인 페이지입니다.",
  SIGNUP: "회원가입 페이지입니다.",
};

export const MAX_CONTENT_WIDTH = 1200;
export const GALLERY_PADDING = 10;
export const GALLERY_CARD_MARGIN_X = 5;
export const SAVE_IMAGE_MARGIN_X = 5;
export const CREATE_STORY_IMAGES_MARGIN_X = 5;

export const COMMENT_SORT_TYPES = [
  { CODE: "latest", NAME: "최신 댓글" },
  { CODE: "earliest", NAME: "오래된 댓글" },
];

export const MAX_NICKNAME_LENGTH = 20;
export const NICKNAME_INFO = "영문·숫자 20자, 한글 10자 제한";

export const NICKNAME_FILTERS = ["욕설"];

export const ALERT_TITLE = {
  ID: "아이디 오류",
  PASSWORD: "비밀번호 오류",
  SERVER: "서버 오류",
  UNKNOWN: "알 수 없는 오류",
  EXP: "체험하기 오류",
  ACCESS: "접근 제한",
  INPUT: "입력 오류",
  NICKNAME: "닉네임 오류",
};

export const ALERT_CONTENT = {
  INVALID_ID: "이미 있는 아이디입니다.",
  USER_NOT_FOUND: "없는 사용자입니다.",
  RECONFIRM_EMAIL: "이메일 형식을 확인해 주세요.",
  RECONFIRM_PASSWORD: "비밀번호를 다시 확인해 주세요.",
  WRONG_PASSWORD: "비밀번호를 확인해 주세요",
  SUCCESS_SIGNOUT: "로그아웃에 성공하였습니다.",
  FAILED_SIGNOUT: "로그아웃에 실패하였습니다.",
  TRY_AGAIN: "잠시 후 다시 시도해 주세요.",
  UNKNOWN: "알 수 없는 오류가 발생하였습니다.",
  INVALID_EXP: "체험하기에서 이용할 수 없는 기능입니다.",
  NOTHING_STORY: "스토리 정보가 없습니다.",
  NO_USER: "사용자 정보가 없습니다.",
  NO_MORE_STORY: "더 이상 불러올 스토리가 없습니다.",
  STORY_AFTER_IMAGE: "스토리 작성은 이미지 입력 후 가능합니다.",
  EXP_CREATE: "체험 계정은 3개까지만 스토리 등록이 가능합니다.",
  SAME_CATEGORY: "현재 적용되어있는 카테고리입니다.",
  REQUIRE_VALUE: "입력은 필수입니다.",
  INVALID_NICKNAME: "닉네임 형식을 확인해 주세요.",
  NICKNAME_LENGTH: "더 길게 닉네임을 설정할 수 없습니다.",
  NICKNAME_FILTER: "사용할 수 없는 단어가 포함되어 있습니다.",
};

export const CONFIRM_TITLE = {
  SIGN_OUT: "로그아웃 하시겠습니까?",
  DELETE_STORY: "스토리를 삭제하시겠습니까?",
  EDIT_STORY: "스토리를 수정하시겠습니까?",
  DELETE_REGULAR_MY: "내가 등록한 단골을 취소하시겠습니까?",
  DELETE_REGULAR_ME: "나를 등록한 단골을 삭제하시겠습니까?",
  DELETE_PROFILE_IMAGE: "현재 프로필 사진을 삭제하시겠습니까?",
};

export const CONFIRM_CONTENT = {
  SIGN_OUT: "로그인 페이지로 넘어갑니다.",
  DELETE_STORY: "삭제된 스토리는 다시 복구할 수 없습니다.",
  EDIT_STORY: "수정된 내용은 다시 복구할 수 없습니다.",
  DELETE_REGULAR_MY: "취소 대상",
  DELETE_REGULAR_ME: "삭제 대상",
  DELETE_PROFILE_IMAGE: "삭제된 사진은 다시 복구할 수 없습니다.",
};

export const EXP_INFO = [
  "스토리는 3개까지 생성할 수 있어요",
  "체험하기에서 생성하신 스토리 정보들은 로컬에 저장돼요",
  "로그아웃을 해야 로컬에 저장된 정보들이 삭제돼요",
  "아래 기능들은 체험이 제한돼요",
];

export const ADD_INFO = {
  EXP_SUBTITLE: "체험 안내사항",
  EXP_RESTRICTS: ["내 정보 조회", "댓글"],
};

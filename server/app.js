const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// 라우트 파일들
const analyzeRoute = require("./routes/analyze");
const userRoutes = require("./routes/user");
const kakaoAuthRoutes = require("./routes/kakao");
const moodmeterRoutes = require("./routes/moodRoutes");
const diaryRoutes = require("./routes/diaryRoutes");

require("./config/passport");

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 파싱 미들웨어
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱 미들웨어

app.use(
  cors({
    origin: ["https://maegeul.com", "http://localhost:3000"], // 프로덕션과 개발 환경 둘 다 허용
    credentials: true, // 쿠키, 인증 정보 포함 여부
  })
);

// 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret", // 환경 변수 사용
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // 프로덕션에서는 true
      domain: "maegeul.com", // 쿠키 도메인 설정
      httpOnly: true, // JavaScript에서 쿠키 접근을 막음
      sameSite: "Strict", // 동일한 사이트에서만 쿠키 전송
    },
  })
);

app.use("/uploads", express.static("uploads"));

// Passport 초기화 및 세션 설정
app.use(passport.initialize());
app.use(passport.session());

// 라우트 설정
app.use("/api/analyze", analyzeRoute); // AI 감정 분석 API

// 사용자 라우트 등록
app.use("/api", userRoutes); // '/api' 경로 하위에 사용자 관련 라우트를 등록

// Static file serving (for profile pictures)
app.use("/uploads", express.static("uploads")); // 정적 파일 경로 설정

app.use("/", kakaoAuthRoutes);

app.use("/api", moodmeterRoutes);

app.use("/api", diaryRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 업로드 폴더 경로 설정
const uploadPath = path.join(__dirname, "uploads");

// 폴더가 존재하지 않으면 생성
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

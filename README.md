# 동부 과학 수업나눔 기록실

동부 수업평가나눔교사단 과학분임의 월별 모임, 수업 사례, 성장 기록, 연수, 예산, 자료와 연말 자료집 원고를 관리하는 Next.js/Firebase 웹 애플리케이션입니다. 이름·비밀번호 로그인, 가입 승인, 역할 기반 접근, Firestore 실시간 목록, 반응형 화면과 인쇄 CSS를 포함합니다.

## 로컬에서 시작하기

1. Node.js 20 이상과 Git을 설치합니다.
2. `npm install`을 실행합니다.
3. `.env.example`을 `.env.local`로 복사합니다.
4. 아래 Firebase 콘솔 설정에서 얻은 값을 `.env.local`의 각 항목에 입력합니다.
5. `npm run dev`를 실행한 뒤 `http://localhost:3000`을 엽니다.

환경 값이 없을 때는 로그인 화면의 **설정 전 화면 미리보기**로 UI와 로컬 세션 내 기록 작성을 확인할 수 있습니다. 미리보기 데이터는 새로고침하면 사라지며 운영 데이터로 사용하지 않습니다.

## Firebase 연결

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트와 웹 앱을 만듭니다.
2. **Authentication → Sign-in method → 이메일/비밀번호**를 사용 설정합니다. Google 제공자는 필요하지 않습니다.
3. **Firestore Database**를 프로덕션 모드로, **Storage**를 생성합니다. 리전은 가능하면 서울과 가까운 `asia-northeast3`를 선택합니다.
4. 프로젝트 설정의 웹 앱 SDK 구성 값을 `.env.local`에 복사합니다. 서비스 계정 JSON이나 Admin SDK 키는 이 저장소와 브라우저 환경 변수에 절대 넣지 않습니다.
5. Firebase CLI에서 `firebase login`, `firebase use --add`를 실행한 뒤 `firebase deploy --only firestore:rules,firestore:indexes,storage`로 규칙과 인덱스를 배포합니다.
6. 로그인 화면에서 **처음 오셨나요? 가입 요청**을 선택하고 이름 `성소연`, 초기 비밀번호 `0000`으로 최초 계정을 만듭니다.
7. Firestore `users/{uid}` 문서에서 `approvalStatus`를 `approved`, `role`을 `admin`으로 **콘솔에서 한 번만** 변경합니다. 그 후에는 **관리자 로그인** 버튼이 이름을 자동으로 채워 줍니다. 비밀번호는 보안을 위해 자동 입력하거나 소스 코드에 저장하지 않습니다.
8. Firebase Password Authentication은 최소 6자를 요구하므로, 화면에서 입력한 4자리 초기 비밀번호는 인증 계층에서만 두 자리 패딩되어 전달됩니다. 화면에서는 요청한 `0000`을 그대로 사용합니다.
9. 이후 관리자는 사용자 승인 화면을 통해 가입 요청을 관리합니다. 모든 주요 쿼리는 `workspaceId`, `yearId`, `isDeleted`를 포함합니다.

## GitHub에 저장하기

```bash
git init
git add .
git commit -m "feat: build science lesson sharing archive"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

`.env.local`은 `.gitignore`에 포함되어 있습니다. GitHub에 환경 값이나 서비스 계정 키를 커밋하지 마세요.

## Vercel 배포

1. Vercel에서 **Add New → Project**를 눌러 GitHub 저장소를 가져옵니다.
2. Framework Preset이 Next.js인지 확인합니다.
3. **Settings → Environment Variables**에 `.env.example`의 7개 값을 Production, Preview, Development에 등록합니다.
4. Deploy를 실행합니다.
5. 배포된 `프로젝트명.vercel.app` 도메인을 Firebase Console의 **Authentication → Settings → Authorized domains**에 추가합니다.
6. 재배포 후 이름·비밀번호 로그인, 승인 대기, 관리자 승인, 작성/수정/조회 순으로 점검합니다.

## 데이터와 보안 원칙

- 가입자는 항상 `member`/`pending`으로 생성되며 클라이언트가 자신의 역할이나 승인 상태를 올릴 수 없습니다.
- 승인된 같은 workspace 사용자만 데이터를 읽습니다. 작성자는 자기 기록을, 관리자는 전체 기록을 수정할 수 있습니다.
- 완전 삭제 대신 `isDeleted`/`deletedAt`을 사용하는 소프트 삭제를 전제로 하며 Firestore 직접 삭제는 차단합니다.
- Storage는 사용자별 경로와 20MB 제한, 허용 MIME 유형을 강제합니다. 대용량 영상은 자료실에 외부 링크로 등록하세요.
- 날짜는 Firestore 서버 타임스탬프로 저장하고 화면에서는 `Asia/Seoul` 기준으로 포맷하도록 확장할 수 있습니다.

## 운영 전 확인

`npm run typecheck`, `npm run lint`, `npm run build`를 모두 통과시키고 Firebase Emulator 또는 별도 테스트 프로젝트에서 승인되지 않은 사용자·분임원·관리자 권한을 각각 검증하세요. 실제 Storage 요금제와 파일 한도, 백업 보관 정책도 학교 정책에 맞게 결정해야 합니다.

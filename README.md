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

### Vercel에서 `Firebase 연결 설정이 필요합니다`가 표시될 때

Vercel 프로젝트 연결과 Firebase 연결은 서로 별개입니다. GitHub를 Vercel에 연결해도 Firebase SDK 값은 자동으로 전달되지 않습니다.

1. Firebase Console → **프로젝트 설정 → 일반 → 내 앱 → SDK 설정 및 구성**에서 웹 앱의 `firebaseConfig`를 확인합니다. 웹 앱이 없다면 `</>` 버튼으로 먼저 생성합니다.
2. Vercel → 해당 프로젝트 → **Settings → Environment Variables**에서 `.env.example`과 이름이 정확히 같은 6개 `NEXT_PUBLIC_FIREBASE_*` 값과 `NEXT_PUBLIC_WORKSPACE_ID`를 등록합니다. 따옴표 없이 값만 붙여 넣습니다.
3. 각 변수의 Environment에서 최소한 **Production**을 선택합니다. Preview 주소에서도 시험하려면 **Preview**도 선택합니다.
4. Firebase Console → **Authentication → Sign-in method**에서 **이메일/비밀번호**를 활성화합니다.
5. 환경 변수는 이미 만들어진 배포에 반영되지 않습니다. 저장 후 Vercel에서 최신 커밋을 **Redeploy**합니다.
6. 화면의 경고에는 누락된 설정 키가 직접 표시됩니다. 모든 키를 설정했는데도 경고가 보이면 변수 이름의 오탈자와 배포 Environment를 확인합니다.

현재 `.env.example`에는 `extra-school-activity` Firebase 웹 앱의 공개 클라이언트 설정이 입력되어 있습니다. 로컬에서는 `cp .env.example .env.local`로 연결하고, Vercel에서는 파일을 업로드하는 대신 같은 값을 Environment Variables에 각각 등록하세요. Firebase 웹 API 키는 클라이언트 식별값이므로 데이터 권한은 API 키 비공개 여부가 아니라 이 저장소의 Firestore/Storage Rules와 사용자 승인 상태로 보호합니다.

### Vercel이 이전 코드를 다시 빌드할 때

Vercel의 빌드 로그에 표시되는 소스와 GitHub의 최신 소스가 다르면 캐시 문제가 아니라 **이전 Git 커밋을 재배포한 것**입니다. 이 저장소에서 관리자 패널 구문 오류가 수정된 최소 커밋은 `e7ce12b`입니다.

1. 로컬에서 `git log -1 --oneline`을 실행해 현재 커밋을 확인합니다.
2. `git push origin <현재-브랜치>`로 수정 커밋을 GitHub에 먼저 올립니다.
3. GitHub의 `app/page.tsx`에서 `AdminPanel` 내부가 `const usersQuery = ...`와 별도의 `return onSnapshot(...)` 형태인지 확인합니다.
4. Vercel **Settings → Git → Production Branch**가 방금 푸시한 브랜치와 같은지 확인합니다.
5. Vercel **Deployments**에서 `e7ce12b` 이후 커밋을 선택해 배포합니다. 실패했던 과거 Deployment의 **Redeploy** 버튼은 과거 커밋을 그대로 다시 빌드하므로 사용하지 않습니다.

### GitHub Pull requests에 `Revert` PR이 생겼을 때

제목이 `Revert "..."`인 PR은 수정본이 아니라 기존 변경을 **되돌리는 PR**입니다. 이를 병합하면 애플리케이션 코드가 제거되거나 이전 오류 상태로 돌아갈 수 있습니다.

1. `Revert "..."` 제목의 PR을 열고 **Close pull request**로 닫습니다. 병합하지 않습니다.
2. 원래 기능 PR을 열어 **Commits** 탭에서 최신 수정 커밋이 포함됐는지 확인합니다.
3. 최신 커밋이 없다면 수정한 로컬 브랜치를 GitHub에 push한 후, 해당 브랜치에서 기본 브랜치(`main`)를 대상으로 새 PR을 만듭니다.
4. 빨간 `✕ 1/2` 표시는 두 개의 상태 검사 중 하나가 실패했다는 의미입니다. PR의 **Checks** 탭 또는 **Details**를 눌러 실패한 Vercel 검사에서 배포 대상 커밋 SHA를 확인합니다.
5. 구문 수정 커밋 `e7ce12b`와 그 이후 커밋이 포함된 PR만 병합합니다. 병합 후 Vercel이 `main`의 새 커밋을 자동 배포하도록 합니다.

이 저장소의 GitHub Actions는 모든 PR에서 타입 검사, 린트 및 프로덕션 빌드를 실행합니다. PR의 **Build verification** 검사가 통과한 뒤 병합하면 Vercel에서 뒤늦게 구문 오류를 발견하는 일을 방지할 수 있습니다.

## 데이터와 보안 원칙

- 가입자는 항상 `member`/`pending`으로 생성되며 클라이언트가 자신의 역할이나 승인 상태를 올릴 수 없습니다.
- 승인된 같은 workspace 사용자만 데이터를 읽습니다. 작성자는 자기 기록을, 관리자는 전체 기록을 수정할 수 있습니다.
- 완전 삭제 대신 `isDeleted`/`deletedAt`을 사용하는 소프트 삭제를 전제로 하며 Firestore 직접 삭제는 차단합니다.
- Storage는 사용자별 경로와 20MB 제한, 허용 MIME 유형을 강제합니다. 대용량 영상은 자료실에 외부 링크로 등록하세요.
- 날짜는 Firestore 서버 타임스탬프로 저장하고 화면에서는 `Asia/Seoul` 기준으로 포맷하도록 확장할 수 있습니다.

## 운영 전 확인

`npm run typecheck`, `npm run lint`, `npm run build`를 모두 통과시키고 Firebase Emulator 또는 별도 테스트 프로젝트에서 승인되지 않은 사용자·분임원·관리자 권한을 각각 검증하세요. 실제 Storage 요금제와 파일 한도, 백업 보관 정책도 학교 정책에 맞게 결정해야 합니다.

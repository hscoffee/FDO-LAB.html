# 세계 무역 교실 — GitHub 백업·Cloudflare 예비 배포

기준: v94. 기존 사이트와 별개의 소스 사본입니다. 현재 게임방·학생 기록은 포함하지 않습니다.

이 사본은 독립 Cloudflare용 빌드와 Wrangler 배포 사전 검사(dry run)를 통과했습니다. 사용자의 실제 Cloudflare 계정 배포와 실기기 접속까지 확인한 상태는 아닙니다.

## 1. 준비

- GitHub 계정: https://github.com
- Cloudflare 계정: https://dash.cloudflare.com
- Windows용 GitHub Desktop: https://desktop.github.com
- 이 압축 파일을 다운로드하고 압축을 풉니다.

GitHub는 소스 보관, Cloudflare는 게임 서버 실행, D1은 게임방 저장 역할입니다.

## 2. Cloudflare에 게임방 데이터베이스 만들기

1. Cloudflare 로그인 → `Storage & databases` → `D1 SQL database` → `Create database`.
2. 이름: `trade-classroom-backup`.
3. 생성된 DB의 `Database ID`를 복사합니다.
4. 압축을 푼 폴더의 `wrangler.jsonc`를 메모장으로 엽니다.
5. `database_id`의 `00000000-0000-4000-8000-000000000000`만 복사한 ID로 바꾸고 저장합니다.
6. DB의 `Console`에서 아래 SQL을 붙여 넣고 `Execute`를 누릅니다.

```sql
CREATE TABLE IF NOT EXISTS rooms (
  code TEXT PRIMARY KEY NOT NULL,
  data TEXT NOT NULL,
  version INTEGER DEFAULT 0 NOT NULL
);
```

`binding`은 반드시 `DB` 그대로 둡니다. SQL은 함께 제공한 `schema.sql`과 같습니다.

## 3. GitHub에 소스 올리기 — GitHub Desktop 권장

1. https://github.com/new → 저장소 이름 `trade-classroom-backup` → `Private` 선택 → `Add a README file` 선택 → `Create repository`.
2. GitHub Desktop을 설치하고 같은 GitHub 계정으로 로그인합니다.
3. `File` → `Clone repository` → 방금 만든 저장소 선택 → `Clone`.
4. `Repository` → `Show in Explorer`로 복제된 저장소 폴더를 엽니다.
5. 압축을 푼 소스 폴더 **안의 내용 전체**를 저장소 폴더 안으로 복사합니다. 기존 README를 덮어써도 됩니다.
6. 저장소 최상위에서 `package.json`, `wrangler.jsonc`, `app`, `lib`, `public`이 바로 보여야 합니다. 소스 폴더 자체를 통째로 한 단계 안에 넣지 않습니다.
7. GitHub Desktop의 `Summary`에 `수업용 예비 배포`를 입력 → `Commit to main` → `Push origin`.

압축 파일 자체만 GitHub에 올리면 Cloudflare에서 빌드할 수 없습니다. 압축을 푼 파일을 올려야 합니다.
파일 수가 많으므로 브라우저 드래그 업로드보다 GitHub Desktop을 사용합니다.

## 4. Cloudflare와 GitHub 연결하기

1. Cloudflare → `Workers & Pages` → `Create application` → `GitHub` 연결.
2. GitHub 접근 권한은 `trade-classroom-backup` 저장소를 선택해 허용합니다.
3. 해당 저장소를 선택합니다. Pages가 아닌 **Worker**로 배포합니다.
4. 아래 값으로 설정합니다.

| 항목 | 입력값 |
| --- | --- |
| Worker 이름 / Project name | `trade-classroom-backup` |
| Production branch | `main` |
| Root directory | 저장소 최상위 `/` 또는 빈칸 |
| Build command | `pnpm run build` |
| Deploy command | `pnpm run deploy` |
| Build variable: `NODE_VERSION` | `24` |
| Build variable: `PNPM_VERSION` | `11.25.0` |

Worker 이름과 `wrangler.jsonc`의 `name`이 같아야 합니다.
빌드 변수는 최초 설정의 고급 항목이나 `Settings` → `Builds` → 빌드 변수에서 지정합니다. 처음에 입력할 곳이 없다면 배포 설정을 저장한 뒤 두 변수를 넣고 다시 빌드합니다.

5. `Save and Deploy`를 누르고 배포 로그가 성공할 때까지 기다립니다.
6. 제공된 `workers.dev` 주소로 접속합니다. 이 주소가 예비 게임 주소입니다.
7. 배포된 Worker의 `Bindings`에서 D1 바인딩 이름이 `DB`, 연결 대상이 만든 DB인지 확인합니다. 누락되어 있으면 `Add binding` → `D1 database` → 변수 이름 `DB` → 만든 DB 선택 후 다시 배포합니다.

## 5. 공개수업 전 확인

1. 예비 주소에서 교사 방을 만듭니다.
2. 실제 학생 태블릿 또는 별도 기기에서 같은 예비 주소로 접속해 입장합니다.
3. 나라 탐색 → 생산 → 무역 제안·수락 → 물자 도착을 확인합니다.
4. 가능하면 수업에 사용할 학교 Wi-Fi와 학생 수로 점검합니다.
5. 기존 주소와 예비 주소, 예비 주소 QR을 각각 보관합니다.

예비 주소의 방은 기존 사이트와 공유되지 않습니다. 전환할 때는 예비 사이트에서 새 방을 만들고 학생들이 새 QR로 다시 입장합니다.
Cloudflare 무료 플랜에도 사용 한도가 있습니다. 빌드 성공만으로 동시 접속과 수업 진행이 검증되는 것은 아닙니다.
이 사본은 기존 주소·배포 설정 문제에 대비하는 용도이며 Cloudflare 전체 장애를 피하는 독립 사업자 백업은 아닙니다.

## 6. 오류가 날 때

- `no such table: rooms`: D1 Console에서 위 SQL을 실행합니다.
- DB를 연결하지 못했다는 안내: 바인딩 `DB`와 `database_id`를 확인합니다.
- Worker name mismatch: Worker 이름을 `trade-classroom-backup`으로 맞춥니다.
- 패키지 설치/Node 오류: 빌드 변수 두 개와 `package.json`이 저장소 최상위에 있는지 확인합니다.
- 화면만 뜨고 방 생성이 안 됨: Pages로 배포했는지, D1 연결과 rooms 테이블이 있는지 확인합니다.

원래 사이트에서 이뤄지는 이후 수정은 이 사본으로 자동 반영되지 않습니다. GitHub에 올린 사본만 별도 관리됩니다.

## 확인한 공식 안내

- GitHub 저장소 생성: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- Cloudflare Git 연동: https://developers.cloudflare.com/workers/ci-cd/builds/
- Cloudflare 빌드 도구 버전: https://developers.cloudflare.com/workers/ci-cd/builds/build-image/
- D1 생성·연결·Console: https://developers.cloudflare.com/d1/get-started/

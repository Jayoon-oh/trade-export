# Trade Export — 수출 무역관리 시스템

견적부터 결제까지, 수출 업무 프로세스(Company → Quotation → Orders → Invoice → Shipment → PackingList → Payment)를 관리하는 풀스택 프로젝트입니다.

수출 업무를 진행하면서 발생하는 견적/인보이스 간 환율 불일치, 분할 인보이스 발행·분할 선적, 상태 변경 문제를 직접 다뤄보기 위해 만든 프로젝트입니다. 단순 CRUD보다 각 단계의 상태와 데이터 관계를 어떻게 제한할지에 초점을 맞췄습니다.

## 데모

![demo](./demo.gif)

## 핵심 기능

### 1. 파이프라인 흐름 관리
Company(거래처) → Quotation(견적) → Orders(오더) → Invoice(인보이스) → Shipment(선적) → PackingList(패킹리스트) → Payment(결제) 순으로 데이터가 이어지며, 이전 단계가 유효하지 않으면(취소 등) 다음 단계로 진행할 수 없도록 검증합니다.

### 2. 환율 일관성 (Exchange Rate Consistency)
- 견적(Quotation) 시점에 환율을 확정하고, Orders → Invoice로 그대로 전파
- 견적 없이 생성된 오더는 인보이스 발행 시점에 환율을 별도 입력받음
- 견적가와 인보이스 금액이 어긋나는 문제를 구조적으로 방지

<details>
<summary>설계 이유</summary>

인보이스 발행 시점마다 환율을 새로 입력받는 방식은, 같은 오더인데 견적 당시 안내한 금액과 실제 인보이스 금액이 달라질 수 있었습니다. 실무 경험을 바탕으로 견적 단계에서 환율을 확정하고, 이후 오더·인보이스 발행에서 동일한 환율을 사용하도록 설계했습니다.
</details>

### 3. 분할 처리 (Split Invoice / Split Shipment)
- 인보이스: 오더의 남은 품목 수량(`GET /orders/{id}/remaining-items`)을 기준으로 여러 차례 분할 발행
- 선적: 하나의 오더에 대해 여러 차수(1차, 2차…)의 선적 등록 가능

### 4. 상태 전이 가드 & 이력 관리
- 되돌릴 수 없는 상태 전이 차단 (배송완료 → 취소, 완료 → 변경 등)
- Shipment(`/shipments/{id}/history`) / Payment(`/payments/{id}/history`) 상태 변경 이력을 별도로 기록·조회

### 5. 데이터 검증
- CANCELLED 상태는 "존재하지만 무효"로 취급 — 단순 존재 여부가 아니라 유효 상태 여부로 검증 로직 통일
- 재고 초과 발행/선적 방지, 중복 등록 방지

### 6. PDF 문서 생성
- Invoice / Packing List / Quotation(Proforma Invoice) — 로고·서명 포함, 환율 반영 최종 금액으로 PDF 생성 (openhtmltopdf + Thymeleaf)

### 7. 대시보드
- 오더별 파이프라인 진행 상태를 퍼널 형태로 조회 (`/api/dashboard/pipeline-funnel`)

### 8. 인증
- JWT 기반 로그인/회원가입, Spring Security로 API 보호

## 기술 스택

**Backend**
- Java 17, Spring Boot
- Spring Security + JWT (jjwt)
- JPA / Hibernate, MySQL 8
- openhtmltopdf + Thymeleaf (PDF 생성)

**Frontend**
- React 19, TypeScript
- Tailwind CSS 4
- React Router v7
- Google Places Autocomplete (`@react-google-maps/api`, 주소 자동완성)

## 실행 방법

```bash
# Backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

## 화면 구성

| 도메인 | 주요 기능 |
|---|---|
| Login | JWT 로그인/회원가입 |
| Dashboard | 오더 파이프라인 퍼널, 오더 상세 패널 |
| Company | 거래처(Seller/Buyer/Forwarder/Carrier) 관리, 주소 자동완성 |
| Quotation | 견적 등록/수정/삭제, 환율 확정, PDF 다운로드 |
| Orders | 오더 등록(견적 연동/단독), 인보이스 발행 이력 |
| Invoice | 분할 발행(남은 수량 기준), PDF 다운로드, 취소 |
| Shipment | 분할 선적(N차), 상태 이력, 삭제 |
| PackingList | 선적 단위 패킹리스트 작성, PDF 다운로드 |
| Payment | 결제 상태 관리, 잔액 조회, 상태 이력, 삭제(PENDING만) |

---

<sub>포트폴리오 프로젝트 — 실무 무역 프로세스를 참고하여 개인 학습용으로 설계·구현했습니다.</sub>

// 리액트에서 두 훅을 쓸 거라서 한 줄에 같이 import
// useState — 컴포넌트 안에서 값을 기억해두는 도구
// useEffect — 화면이 그려진 뒤에 어떤 동작을 시키고 싶을 때 쓰는 도구
import { useState, useEffect } from 'react'

// 함수형 컴포넌트 선언 — App.jsx 가 <TeamIntro teamName=... members=... /> 로 호출하면 이 함수가 실행됨
// 매개변수 자리의 { teamName, members } 는 "props 객체에서 두 키를 바로 꺼내 쓰는" 구조분해 문법
function TeamIntro({ teamName, members }) {
  // useState(0) 호출 — 초기값 0 으로 상태 한 칸 만들기
  // 반환값은 [현재값, 업데이트 함수] 두 개짜리 배열 → 구조분해로 activeIdx / setActiveIdx 로 이름 붙임
  // activeIdx 의 의미: 지금 강조해서 보여줄 멤버의 인덱스 (0~3 사이 순환)
  const [activeIdx, setActiveIdx] = useState(0)

  // useEffect(콜백, 의존성배열) — 화면이 그려진 직후 콜백을 한 번 실행, 의존성이 바뀌면 다시 실행
  // 여기서는 3초 자동 슬라이드용 인터벌을 등록하려고 사용
  useEffect(() => {
    // setInterval(콜백, 간격ms) — 브라우저 API, 정한 간격마다 콜백을 계속 호출
    // 반환값은 타이머 ID (정수) → 나중에 clearInterval 로 끄려면 꼭 변수에 잡아둬야 함
    const timerId = setInterval(() => {
      // setActiveIdx 에 "값" 대신 "함수" 를 넘기면 React 가 직전 값을 인자로 넣어줌 (prev)
      // (prev + 1) — 인덱스 한 칸 다음으로
      // % members.length — 멤버 수로 나눈 나머지 → 끝(3)에서 +1=4 인데 4%4=0 이라 다시 처음으로 순환
      setActiveIdx((prev) => (prev + 1) % members.length)
      // 두 번째 인자 3000 — 단위는 ms 라서 3초마다 위 콜백 실행
    }, 3000)

    // useEffect 안에서 함수를 return 하면 그게 cleanup 함수
    // 호출 시점: ① 컴포넌트가 사라질 때, ② 의존성이 바뀌어 effect 가 다시 돌기 직전
    // clearInterval(timerId) — 위에서 만든 인터벌을 끔 → 타이머 중복 / 메모리 누수 방지
    return () => clearInterval(timerId)
    // 의존성 배열 [members.length] — 멤버 수가 바뀌면 modulo 기준값이 달라지니 effect 다시 등록
    // teamName 처럼 인터벌과 무관한 값은 일부러 제외 (괜히 재실행 안 시키려고)
  }, [members.length])

  // JSX 반환 — 이 컴포넌트가 그릴 화면 구조
  return (
    // 최상위 래퍼 div — padding 으로 안쪽 여백, fontFamily 로 기본 글꼴 지정
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      {/* h2 — 가장 큰 제목 자리, {teamName} 으로 prop 값을 동적으로 끼워 넣음 */}
      <h2 style={{ marginBottom: '8px' }}>👥 {teamName} 팀을 소개합니다</h2>
      {/* 안내 문구 — activeIdx 는 0부터라서 +1 해서 사람이 자연스럽게 읽는 1부터 표시 */}
      <p style={{ color: '#666', marginTop: 0 }}>
        3초마다 강조되는 멤버가 바뀝니다 ({activeIdx + 1} / {members.length})
      </p>

      {/* 카드 컨테이너 — flex 가로 배치, gap 으로 사이 간격, flexWrap 으로 좁으면 줄바꿈 */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
        {/* members.map((원소, 인덱스) => JSX) — 배열을 돌면서 카드 4장을 동적으로 생성 */}
        {members.map((name, idx) => (
          // key — React 가 리스트 항목을 식별하는 고유값
          // 백틱 템플릿 리터럴로 `이름-인덱스` 형태 → 동명이인이 있어도 idx 가 다르니 충돌 안 남
          <div
            key={`${name}-${idx}`}
            style={{
              // 안쪽 여백 — 위아래 16px / 좌우 20px
              padding: '16px 20px',
              // 모서리 둥글게 12px
              borderRadius: '12px',
              // 1px 짜리 옅은 회색 테두리
              border: '1px solid #ddd',
              // 카드 폭 통일하려고 최소 너비 지정
              minWidth: '120px',
              // 안쪽 텍스트 가운데 정렬
              textAlign: 'center',
              // 삼항 연산자 (조건 ? 참일때 : 거짓일때)
              // idx 가 현재 강조 인덱스면 노란색, 아니면 옅은 회색 배경
              background: idx === activeIdx ? '#ffe9a8' : '#fafafa',
              // 강조 카드만 그림자, 나머지는 'none' (그림자 없음)
              boxShadow: idx === activeIdx ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              // scale(1.05) — 5% 커지는 효과로 시선 끌기, 비강조는 1배 그대로
              transform: idx === activeIdx ? 'scale(1.05)' : 'scale(1)',
              // 위 속성이 바뀔 때 0.3초 부드럽게 전환 → 슬라이드 느낌
              transition: 'all 0.3s ease',
            }}
          >
            {/* 멤버 번호 — idx 가 0부터라서 +1 해서 #1, #2 ... 로 표시 */}
            <div style={{ fontSize: '12px', color: '#888' }}>#{idx + 1}</div>
            {/* 멤버 이름 — 18px 굵은 글씨로 한눈에 들어오게 */}
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 외부 파일에서 이 컴포넌트를 쓸 수 있게 default 로 내보내기
// 가져갈 때는 import TeamIntro from './sections/TeamIntro'
export default TeamIntro

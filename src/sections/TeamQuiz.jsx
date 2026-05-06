// 두 훅을 한 줄에 같이 import
// useState — 상태값 보관 (현재 문제 번호, 점수, 선택한 보기)
// useEffect — 부수효과 등록 (선택 후 1.5초 뒤 다음 문제로 자동 이동)
import { useState, useEffect } from 'react'

// 함수형 컴포넌트 선언, props 에서 teamName / members 두 값을 구조분해로 꺼냄
function TeamQuiz({ teamName, members }) {
  // 문제 데이터 — 객체 3개짜리 배열 리터럴
  // 각 객체: q (질문 문자열), answerIndex (members 배열에서의 정답 인덱스)
  // 보기 텍스트 자체는 여기 안 적고, 렌더링할 때 props.members 를 그대로 map 으로 그림
  const questions = [
    // members[3] 이 정답 — 인덱스 0~3 중 3번째 멤버
    { q: '반응속도가 제일 빠른 사람?', answerIndex: 3 },
    // 마찬가지로 members[3] 정답
    { q: '정병 연애를 했던 사람은?', answerIndex: 3 },
    // 역시 members[3] 정답
    { q: '연애 10번 넘게 한 사람?', answerIndex: 3 },
  ]

  // useState(0) — 초기값 0 으로 상태 생성
  // currentIndex 의미: 지금 풀고 있는 문제의 인덱스 (0 → 1 → 2 진행, 3 도달 시 결과 화면)
  const [currentIndex, setCurrentIndex] = useState(0)
  // useState(0) — 점수 누적용, 초기값 0
  // score 의미: 지금까지 맞춘 정답 개수
  const [score, setScore] = useState(0)
  // useState(null) — 아직 아무 보기도 안 누른 상태를 null 로 표현
  // selectedAnswer 의미: 방금 사용자가 누른 보기의 인덱스 (없으면 null)
  // null 여부로 "지금 답 보여주는 중인지" 구분 → useEffect 트리거 조건이기도 함
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // useEffect — selectedAnswer 가 바뀔 때마다 실행
  // 흐름: 사용자가 보기 클릭 → selectedAnswer 가 숫자로 세팅 → 1.5초 후 다음 문제로 넘기고 다시 null 로
  useEffect(() => {
    // 조기 리턴 — 아직 아무 답도 안 누른 상태(null)면 타이머 깔 필요 없음
    // 비교 연산자 === 는 타입까지 같이 비교하는 엄격 비교
    if (selectedAnswer === null) return

    // setTimeout(콜백, 지연ms) — 정해진 시간 뒤 콜백을 한 번만 실행
    // 반환값은 타이머 ID, clearTimeout 으로 끌 때 필요해서 변수에 보관
    const timerId = setTimeout(() => {
      // 함수형 업데이트 — prev 는 직전 currentIndex 값
      // prev + 1 → 다음 문제로 이동
      setCurrentIndex((prev) => prev + 1)
      // 다음 문제는 또 "아무것도 안 누른 상태" 로 시작해야 하니 null 로 리셋
      setSelectedAnswer(null)
      // 1500 — ms 단위, 1.5초 동안 정답/오답 색을 보여준 뒤 진행
    }, 1500)

    // cleanup 함수 — useEffect 가 다시 돌기 직전 또는 언마운트 직전 호출
    // clearTimeout(timerId) — 예약된 타이머가 살아있으면 취소
    // 안 정리하면: 컴포넌트가 사라진 뒤에 setState 호출 → 경고 + 잠재적 버그
    return () => clearTimeout(timerId)
    // 의존성 배열 [selectedAnswer] — 이 값이 바뀔 때만 effect 다시 평가
    // 답을 누른 그 순간 한 번만 타이머가 걸리는 구조
  }, [selectedAnswer])

  // 보기 버튼 클릭 핸들러 — 인자로 누른 보기의 인덱스를 받음
  const handleSelect = (idx) => {
    // 가드 — 이미 답을 누른 상태(null 이 아님)면 추가 클릭 무시 (점수 중복 방지)
    if (selectedAnswer !== null) return
    // questions[currentIndex] — 지금 문제 객체
    // .answerIndex — 그 문제의 정답 인덱스
    // === idx — 누른 인덱스랑 정답이 같은지 비교
    if (idx === questions[currentIndex].answerIndex) {
      // 정답이면 함수형 업데이트로 점수 +1
      setScore((prev) => prev + 1)
    }
    // 정답/오답 상관없이 누른 인덱스를 selectedAnswer 에 기록 → 위 useEffect 가 1.5초 뒤 다음 문제로
    setSelectedAnswer(idx)
  }

  // "다시 풀기" 버튼 핸들러 — 모든 상태를 초기값으로 되돌림
  const handleRestart = () => {
    // 첫 문제로
    setCurrentIndex(0)
    // 점수 초기화
    setScore(0)
    // 선택 기록 초기화
    setSelectedAnswer(null)
  }

  // 조건부 렌더링 — currentIndex 가 문제 개수 이상이면 결과 화면으로 분기
  // questions.length 는 3, 그래서 currentIndex 가 3 이 되는 순간 모든 문제를 다 푼 상태
  if (currentIndex >= questions.length) {
    return (
      // 결과 화면 래퍼 — 가운데 정렬
      <div style={{ padding: '24px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        {/* 결과 헤더 — 팀명 동적 삽입 */}
        <h2>🎉 {teamName} 팀 퀴즈 결과</h2>
        {/* 점수 표시 — 큰 글씨로 X / 3 형태 */}
        <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '16px 0' }}>
          {score} / {questions.length}
        </p>
        {/* 다시 풀기 버튼 — 클릭 시 handleRestart 호출 */}
        <button
          onClick={handleRestart}
          style={{
            padding: '10px 24px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #888',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          다시 풀기
        </button>
      </div>
    )
  }

  // 현재 문제 객체를 변수에 캐싱 — 아래에서 current.q / current.answerIndex 로 짧게 접근하려고
  const current = questions[currentIndex]

  // 일반(문제 풀이) 화면 렌더링
  return (
    // 래퍼 div — 좌우 정렬 기본(=왼쪽), 안쪽 여백 24px
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      {/* 헤더 — 팀명 표시 */}
      <h2>🧠 {teamName} 팀 퀴즈</h2>
      {/* 진행 상황 — currentIndex 0부터라 +1 해서 사람이 보기 좋은 1부터 표시 */}
      <p style={{ color: '#666' }}>
        문제 {currentIndex + 1} / {questions.length}
      </p>

      {/* 현재 문제 텍스트 — current.q 로 질문 본문 출력 */}
      <h3 style={{ marginTop: '16px' }}>Q. {current.q}</h3>

      {/* 보기 버튼 그리드 — 2열로 배치 (1fr 1fr → 가로를 같은 비율로 두 칸 분할) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        {/* members 배열을 map 으로 돌면서 보기 버튼 4개 생성 */}
        {/* (name, idx) — name 은 멤버 이름, idx 는 0,1,2,3 순서 */}
        {members.map((name, idx) => {
          // isSelected — 이 보기가 사용자가 방금 누른 보기인지 (idx 와 selectedAnswer 비교)
          const isSelected = selectedAnswer === idx
          // isCorrect — 이 보기가 정답인지 (idx 와 정답 인덱스 비교)
          const isCorrect = idx === current.answerIndex
          // showFeedback — 누구든 답을 누른 상태인지 (selectedAnswer 가 null 이 아니면 true)
          const showFeedback = selectedAnswer !== null
          // bg — 배경색 결정. 중첩 삼항 연산자로 4가지 케이스 처리:
          // ① 아직 답 안 누름(showFeedback false) → 흰색
          // ② 누른 상태 + 이 보기가 정답 → 초록 (정답 칸 강조)
          // ③ 누른 상태 + 이 보기가 사용자가 누른 오답 → 빨강
          // ④ 누른 상태 + 이 보기는 누르지도 정답도 아님 → 흰색
          const bg = !showFeedback
            ? '#fff'
            : isCorrect
              ? '#c8e6c9'
              : isSelected
                ? '#ffcdd2'
                : '#fff'

          return (
            // 보기 버튼 하나 — 백틱 템플릿으로 key 생성 (이름+idx 조합)
            <button
              key={`${name}-${idx}`}
              // 클릭 시 handleSelect(idx) 호출 — 화살표 함수로 idx 를 캡처해서 전달
              onClick={() => handleSelect(idx)}
              // disabled — 답을 이미 누른 상태면 모든 버튼 잠금 (1.5초 사이 추가 클릭 차단)
              disabled={showFeedback}
              style={{
                // 안쪽 여백 16px
                padding: '16px',
                // 글자 크기 16px
                fontSize: '16px',
                // 모서리 둥글게
                borderRadius: '8px',
                // 옅은 회색 테두리
                border: '1px solid #ccc',
                // 위에서 계산한 배경색 적용
                background: bg,
                // 잠긴 상태면 기본 커서, 아니면 클릭 가능 표시
                cursor: showFeedback ? 'default' : 'pointer',
                // 배경 변경 시 0.2초 부드럽게 전환
                transition: 'background 0.2s ease',
              }}
            >
              {/* 버튼 안 텍스트 — 멤버 이름 그대로 */}
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 외부 파일에서 이 컴포넌트를 쓸 수 있게 default export
export default TeamQuiz

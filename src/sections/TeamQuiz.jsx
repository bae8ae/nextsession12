// 상태(useState) 랑 시간 딜레이(useEffect + setTimeout) 둘 다 쓸 거라서 같이 import
import { useState, useEffect } from 'react'

// 부모(App.jsx) 에서 팀명이랑 멤버 4명 배열을 prop 으로 내려줌
function TeamQuiz({ teamName, members }) {
  // 문제 3개를 배열로 만들어 둠. 정답(answerIndex) 은 members 배열에서의 인덱스로 표시.
  // 보기는 따로 안 적고 props.members 를 그대로 쓸 거라서 여기에는 질문이랑 정답만 둠.
  const questions = [
    // 0번 멤버를 정답으로 두는 문제 — "커피 많이 마시는 사람" 같은 가벼운 주제로
    { q: '우리 팀에서 커피 가장 많이 마시는 사람은?', answerIndex: 0 },
    // 1번 멤버 정답 — 회의 때 농담 제일 많이 던지는 사람
    { q: '회의 때 농담을 가장 많이 던지는 사람은?', answerIndex: 1 },
    // 2번 멤버 정답 — 발표하면서 떨림이 가장 적은 사람
    { q: '발표할 때 가장 안 떠는 사람은?', answerIndex: 2 },
  ]

  // 이 state 는 "지금 몇 번째 문제를 풀고 있는지" 를 의미함. 0~2 까지 가고 3 되면 결과 화면.
  const [currentIndex, setCurrentIndex] = useState(0)
  // 이 state 는 "지금까지 맞춘 개수" 를 의미함. 정답 누를 때마다 +1.
  const [score, setScore] = useState(0)
  // 이 state 는 "방금 사용자가 누른 보기 인덱스" 를 의미함. 아직 안 눌렀으면 null.
  // null 이 아닐 때만 다음 문제로 넘어가는 타이머가 돌게 하려고 분리해 둠.
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // 이 effect 는 selectedAnswer 가 바뀔 때마다 실행됨.
  // 사용자가 보기를 누르면 selectedAnswer 가 숫자로 세팅 → 1.5초 보여준 뒤 다음 문제로 넘기고 다시 null 로 초기화.
  useEffect(() => {
    // 아직 아무것도 안 눌렀으면 타이머 걸 필요 없음 → 그냥 빠져나감
    if (selectedAnswer === null) return

    // 1.5초 뒤에 실행될 작업 — 문제 번호 +1 하고, 다음 문제 받을 준비로 selectedAnswer 다시 null 로
    const timerId = setTimeout(() => {
      // 다음 문제로 인덱스 한 칸 이동
      setCurrentIndex((prev) => prev + 1)
      // 다음 문제에서는 또 아무것도 안 누른 상태여야 하니까 null 로 리셋
      setSelectedAnswer(null)
      // 1500ms = 1.5초. 정답/오답을 잠깐 보여줘야 하니까 즉시 넘기지 않고 살짝 텀을 둠.
    }, 1500)

    // 사용자가 빨리 다음 단계로 가거나 컴포넌트가 사라질 때 타이머가 살아있으면 안 되니까 정리
    return () => clearTimeout(timerId)
    // selectedAnswer 가 바뀔 때만 이 로직이 동작해야 해서 의존성에 얘 하나만 둠
  }, [selectedAnswer])

  // 보기 버튼 클릭 핸들러. 인덱스를 받아서 정답이면 score 올리고, 어쨌든 selectedAnswer 에 기록
  const handleSelect = (idx) => {
    // 이미 답을 누른 상태라면 1.5초 동안은 더블클릭 무시 (점수 두 번 오르는 거 방지)
    if (selectedAnswer !== null) return
    // 정답 인덱스랑 누른 인덱스가 같으면 점수 +1
    if (idx === questions[currentIndex].answerIndex) {
      setScore((prev) => prev + 1)
    }
    // 정답이든 오답이든 일단 누른 인덱스를 기록 → 위 useEffect 가 1.5초 뒤 다음 문제로 넘김
    setSelectedAnswer(idx)
  }

  // 처음부터 다시 풀고 싶을 때 쓸 리셋 함수 — 결과 화면에서 "다시 풀기" 버튼에 연결
  const handleRestart = () => {
    // 모든 state 초기값으로 되돌리기
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
  }

  // currentIndex 가 문제 개수에 도달했으면 결과 화면을 그려줌
  if (currentIndex >= questions.length) {
    return (
      <div style={{ padding: '24px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>🎉 {teamName} 팀 퀴즈 결과</h2>
        <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '16px 0' }}>
          {score} / {questions.length}
        </p>
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

  // 지금 풀어야 할 문제를 꺼내옴
  const current = questions[currentIndex]

  // 실제 문제 화면 렌더링. 헤더 + 문제 텍스트 + 보기 4개 버튼.
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      {/* 어떤 팀의 퀴즈인지 헤더에 표시 */}
      <h2>🧠 {teamName} 팀 퀴즈</h2>
      {/* 진행 상황 안내 — 사용자가 몇 번째 문제 푸는지 알 수 있게 */}
      <p style={{ color: '#666' }}>
        문제 {currentIndex + 1} / {questions.length}
      </p>

      {/* 현재 문제 텍스트 */}
      <h3 style={{ marginTop: '16px' }}>Q. {current.q}</h3>

      {/* 보기 버튼 4개 — props.members 를 그대로 map 해서 만들기 (하드코딩 안 함) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        {/* members 배열 돌면서 버튼 4개 생성. idx 가 곧 정답 비교 기준 */}
        {members.map((name, idx) => {
          // 이 보기가 사용자가 방금 누른 보기인지
          const isSelected = selectedAnswer === idx
          // 이 보기가 정답인지
          const isCorrect = idx === current.answerIndex
          // 이미 답을 누른 상태에서 색을 바꿔서 정답/오답 피드백 주기
          const showFeedback = selectedAnswer !== null
          // 배경색을 상황에 따라 다르게 — 누른 게 정답이면 초록, 오답이면 빨강, 그 외엔 기본
          const bg = !showFeedback
            ? '#fff'
            : isCorrect
              ? '#c8e6c9'
              : isSelected
                ? '#ffcdd2'
                : '#fff'

          return (
            // key 는 이름 + idx 조합으로 안전하게
            <button
              key={`${name}-${idx}`}
              onClick={() => handleSelect(idx)}
              // 답 이미 누른 상태에서는 버튼 비활성화 (중복 클릭 방지)
              disabled={showFeedback}
              style={{
                padding: '16px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: bg,
                cursor: showFeedback ? 'default' : 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 다른 파일에서 가져다 쓸 수 있게 default export
export default TeamQuiz

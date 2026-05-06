// 상태 관리(useState) 랑 시간 지연(useEffect + setTimeout) 둘 다 필요해서 같이 import
import { useState, useEffect } from 'react'

// 부모(App.jsx) 에서 팀명만 prop 으로 받아 헤더에 보여주는 용도
function ReactionTest({ teamName }) {
  // 이 state 는 현재 게임이 어떤 단계에 있는지 의미함.
  // 'ready' = 시작 전, 'waiting' = 빨강(대기), 'go' = 초록(클릭해야 함), 'result' = 결과, 'tooSoon' = 빨강에서 미리 누름
  const [status, setStatus] = useState('ready')
  // 이 state 는 박스가 초록으로 바뀐 시각. 클릭한 시각에서 빼면 반응속도가 나옴.
  const [startedAt, setStartedAt] = useState(0)
  // 이 state 는 이번 회차에서 측정된 반응속도(ms). 결과 화면에서 보여줄 값.
  const [reactionMs, setReactionMs] = useState(null)
  // 이 state 는 지금까지의 최고 기록(ms). 처음엔 기록이 없으니까 null 로 시작.
  const [bestMs, setBestMs] = useState(null)

  // 이 effect 는 status 가 바뀔 때마다 실행됨.
  // 'waiting' 단계로 들어왔을 때만 1~5초 사이 랜덤 타이머를 걸어서 'go' 로 넘김.
  // 다른 단계에서는 타이머가 필요 없으니 그냥 빠져나감.
  useEffect(() => {
    // 대기 상태가 아니면 타이머 깔 필요 없음
    if (status !== 'waiting') return

    // 1000ms ~ 5000ms 사이 랜덤 딜레이 — 너무 짧으면 예측 가능, 너무 길면 지루함
    const delay = 1000 + Math.random() * 4000

    // 딜레이 후에 박스를 초록으로 바꾸고 그 순간 시각을 기록 (반응속도 계산 기준점)
    const timerId = setTimeout(() => {
      // 초록으로 바뀐 정확한 시각을 잡아둠 — performance.now() 가 ms 단위로 더 정밀
      setStartedAt(performance.now())
      // 박스를 초록색으로 전환
      setStatus('go')
    }, delay)

    // cleanup 함수 — 왜 필요하냐면:
    // (1) 사용자가 도중에 "다시" 눌러서 status 가 'ready' 로 돌아가면, 예전 타이머가 살아있다가
    //     엉뚱한 타이밍에 갑자기 'go' 로 바꿔버리는 버그가 생김. 그걸 막으려고 정리.
    // (2) 컴포넌트가 언마운트됐는데도 타이머가 남아있으면 메모리 누수 + setState 경고가 뜸. 그것도 방지.
    return () => clearTimeout(timerId)
    // status 값이 바뀔 때마다 이 로직을 다시 평가해야 해서 의존성에 status 포함
  }, [status])

  // "시작" 버튼 핸들러 — ready 상태에서 빨강(waiting) 으로 진입
  const handleStart = () => {
    // 이전 회차 결과 지우기 (혼동 방지)
    setReactionMs(null)
    // 빨강 대기 상태로 진입 → useEffect 가 랜덤 타이머를 걸어줌
    setStatus('waiting')
  }

  // 큰 박스 클릭 핸들러 — status 에 따라 분기
  const handleBoxClick = () => {
    // 'waiting'(빨강) 일 때 누른 거면 너무 빨리 누른 케이스
    if (status === 'waiting') {
      // 페널티 화면으로 전환
      setStatus('tooSoon')
      return
    }
    // 'go'(초록) 일 때 누른 게 진짜 측정 대상
    if (status === 'go') {
      // 지금 시각에서 초록 시작 시각을 빼서 반응속도 계산
      const ms = Math.round(performance.now() - startedAt)
      // 이번 회차 결과 저장
      setReactionMs(ms)
      // 최고 기록이 없거나 이번 기록이 더 빠르면 갱신
      if (bestMs === null || ms < bestMs) {
        setBestMs(ms)
      }
      // 결과 화면으로 전환
      setStatus('result')
    }
  }

  // 결과/실패 화면에서 다시 시도하기 위한 리셋 함수
  const handleReset = () => {
    // ready 로 돌리면 useEffect 가 알아서 타이머 정리 후 대기 상태가 됨
    setStatus('ready')
  }

  // status 에 따라 박스 배경색을 결정 — switch 보다 객체 매핑이 보기 편해서 이렇게 함
  const boxColor = {
    // 시작 전엔 회색
    ready: '#bdbdbd',
    // 대기 중엔 빨강
    waiting: '#e53935',
    // 클릭해야 할 타이밍은 초록
    go: '#43a047',
    // 결과 화면은 다시 회색으로
    result: '#bdbdbd',
    // 너무 빨리 눌렀을 때도 회색 (실패 표시는 텍스트로)
    tooSoon: '#bdbdbd',
  }[status]

  // status 에 따라 박스 안에 보여줄 텍스트도 같이 결정
  const boxText = {
    ready: '시작 버튼을 누르세요',
    waiting: '기다리세요…',
    go: '지금 클릭!',
    result: `${reactionMs} ms`,
    tooSoon: '너무 빨라요!',
  }[status]

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      {/* 어떤 팀인지 헤더 표시 */}
      <h2>⚡ {teamName} 팀 반응속도 테스트</h2>
      {/* 최고 기록 표시 — 아직 없으면 "—" 로 보여줌 */}
      <p style={{ color: '#666' }}>최고 기록: {bestMs !== null ? `${bestMs} ms` : '—'}</p>

      {/* 메인 박스 — status 따라 색이랑 텍스트가 바뀌고, 클릭 핸들러 부착 */}
      <div
        onClick={handleBoxClick}
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '240px',
          margin: '24px auto',
          background: boxColor,
          color: '#fff',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          cursor: status === 'waiting' || status === 'go' ? 'pointer' : 'default',
          userSelect: 'none',
          transition: 'background 0.1s ease',
        }}
      >
        {boxText}
      </div>

      {/* 하단 버튼 영역 — 현재 status 에 따라 다른 버튼을 보여줌 */}
      <div>
        {/* ready 상태일 때만 "시작" 버튼 노출 */}
        {status === 'ready' && (
          <button
            onClick={handleStart}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #888',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            시작
          </button>
        )}
        {/* result 또는 tooSoon 상태일 때 "다시" 버튼 노출 */}
        {(status === 'result' || status === 'tooSoon') && (
          <button
            onClick={handleReset}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #888',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            다시
          </button>
        )}
      </div>
    </div>
  )
}

// 다른 파일에서 import 해서 쓸 수 있도록 default export
export default ReactionTest

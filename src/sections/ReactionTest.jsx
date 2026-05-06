// 두 훅 같이 import
// useState — 게임 상태/시각/기록 등 여러 값을 보관
// useEffect — 빨강 → 초록 전환 타이머, 키보드 리스너 등록 같은 부수효과 처리
import { useState, useEffect } from 'react'

// 함수형 컴포넌트, props 에서 teamName 만 꺼냄 (이 게임은 멤버 정보가 필요 없음)
function ReactionTest({ teamName }) {
  // useState('ready') — 초기 상태를 'ready' 문자열로
  // status 의미: 게임의 현재 단계
  // 가능한 값: 'ready'(시작 전) / 'waiting'(빨강 대기) / 'go'(초록 클릭 타이밍) / 'result'(결과) / 'tooSoon'(빨강에서 미리 누름)
  const [status, setStatus] = useState('ready')
  // useState(0) — 시각은 숫자라 0 으로 초기화
  // startedAt 의미: 박스가 초록으로 바뀐 정확한 시각 (performance.now 값)
  // 클릭 시각 - startedAt = 반응속도(ms)
  const [startedAt, setStartedAt] = useState(0)
  // useState(null) — 아직 측정 안 했으니 null
  // reactionMs 의미: 이번 회차의 반응속도 (ms)
  const [reactionMs, setReactionMs] = useState(null)
  // useState(null) — 기록이 없는 상태를 null 로 표현
  // bestMs 의미: 누적된 최고 기록 (ms 작을수록 빠름)
  const [bestMs, setBestMs] = useState(null)

  // useEffect — status 가 바뀔 때마다 실행
  // 'waiting' 일 때만 1~5초 랜덤 타이머를 깔아서 자동으로 'go' 로 전환
  useEffect(() => {
    // 조기 리턴 — waiting 상태가 아니면 타이머 안 깔고 끝
    // !== 는 타입까지 비교하는 엄격 부등 비교
    if (status !== 'waiting') return

    // 랜덤 딜레이 계산
    // Math.random() — 0.0 이상 1.0 미만 난수 반환
    // * 4000 — 0~4000ms 범위로 확장
    // 1000 + ... — 시작값을 1000ms 로 끌어올려서 결국 1000~5000ms 범위
    const delay = 1000 + Math.random() * 4000

    // setTimeout(콜백, ms) — 한 번만 실행되는 지연 타이머
    // 반환값은 타이머 ID, clearTimeout 으로 끄려면 변수 보관 필수
    const timerId = setTimeout(() => {
      // performance.now() — 페이지 로드 이후 경과한 ms (소수점까지 정밀)
      // Date.now() 보다 더 안정적이고 정확해서 측정용으로 적합
      setStartedAt(performance.now())
      // 박스를 초록(go)으로 전환 → 사용자가 클릭하면 반응속도 계산
      setStatus('go')
    }, delay)

    // cleanup — 두 가지 이유로 꼭 필요:
    // (1) 사용자가 도중에 reset 해서 status 가 'ready' 로 바뀌면 예전 타이머가 살아남아
    //     엉뚱한 시점에 'go' 로 전환되는 버그 발생 → 그걸 막음
    // (2) 컴포넌트 언마운트 후 setState 호출 시 메모리 누수/경고 → 그걸 막음
    return () => clearTimeout(timerId)
    // 의존성 [status] — status 가 바뀔 때만 effect 재실행
  }, [status])

  // "시작" 버튼 핸들러 — ready → waiting 으로 진입
  const handleStart = () => {
    // 이전 회차 결과 지움 (혼동 방지)
    setReactionMs(null)
    // 빨강 대기 단계로 진입 → 위 useEffect 가 랜덤 타이머 시작
    setStatus('waiting')
  }

  // 박스 클릭 핸들러 — 현재 status 에 따라 다르게 동작
  const handleBoxClick = () => {
    // waiting(빨강) 일 때 누른 거면 너무 빨리 누른 케이스
    if (status === 'waiting') {
      // 실패 화면으로 전환
      setStatus('tooSoon')
      // 아래 분기 안 보고 바로 종료
      return
    }
    // go(초록) 일 때 누른 게 진짜 측정 타이밍
    if (status === 'go') {
      // performance.now() — 지금 시각
      // - startedAt — 초록으로 바뀐 시각
      // 빼면 그 사이에 흐른 ms = 반응속도
      // Math.round(...) — 반올림해서 정수 ms 로
      const ms = Math.round(performance.now() - startedAt)
      // 이번 회차 결과 저장
      setReactionMs(ms)
      // || 는 단락평가 OR — 왼쪽이 truthy 면 오른쪽 안 봄
      // bestMs === null → 아직 기록 없음 (첫 시도)
      // ms < bestMs → 이번이 더 빠름
      // 둘 중 하나라도 참이면 갱신
      if (bestMs === null || ms < bestMs) {
        setBestMs(ms)
      }
      // 결과 화면으로 전환
      setStatus('result')
    }
  }

  // "다시" 버튼 핸들러 — 결과/실패 화면에서 ready 로 되돌림
  const handleReset = () => {
    // status 만 ready 로 바꾸면 위 useEffect 가 알아서 cleanup 처리
    setStatus('ready')
  }

  // useEffect — 키보드 스페이스바를 마우스 클릭이랑 동일하게 처리
  useEffect(() => {
    // keydown 이벤트 핸들러 — e 는 KeyboardEvent 객체
    const handleKeyDown = (e) => {
      // e.code === 'Space' — 어떤 키냐를 코드 기준으로 확인
      // 스페이스가 아니면 그냥 무시
      if (e.code !== 'Space') return
      // 스페이스바 기본 동작은 페이지 스크롤 → preventDefault() 로 막음
      e.preventDefault()

      // 분기 — 핸들러들과 동일한 로직을 status 별로 직접 실행
      // (handleStart 등을 그대로 부르면 closure 캡처 문제로 stale 값을 볼 수 있어서 인라인으로 작성)
      if (status === 'ready') {
        // ready → waiting 진입 (시작과 동일)
        setReactionMs(null)
        setStatus('waiting')
        return
      }
      if (status === 'waiting') {
        // 빨강일 때 누름 → 실패
        setStatus('tooSoon')
        return
      }
      if (status === 'go') {
        // 초록일 때 누름 → 반응속도 측정
        const ms = Math.round(performance.now() - startedAt)
        setReactionMs(ms)
        if (bestMs === null || ms < bestMs) {
          setBestMs(ms)
        }
        setStatus('result')
        return
      }
      // 결과/실패 화면이면 다시(ready)로
      // || 는 두 조건 중 하나라도 참이면 통과
      if (status === 'result' || status === 'tooSoon') {
        setStatus('ready')
      }
    }

    // window.addEventListener('keydown', 핸들러) — 전역에 키 이벤트 리스너 등록
    // window 에 붙이면 박스에 포커스 없어도 어디서든 스페이스바가 먹힘
    window.addEventListener('keydown', handleKeyDown)
    // cleanup — 의존성 변경/언마운트 시 이전 리스너 제거
    // 안 떼면 리스너가 중복 등록돼서 한 번 누른 게 여러 번 처리되는 버그 발생
    return () => window.removeEventListener('keydown', handleKeyDown)
    // 핸들러 안에서 status / startedAt / bestMs 를 참조하니 셋이 바뀔 때마다 새 클로저로 다시 등록
  }, [status, startedAt, bestMs])

  // 객체 매핑 + 즉시 키 접근 패턴 — switch 문 대신 객체에서 바로 꺼내 보기 편함
  // [status] 는 동적 키 접근 — 현재 status 값에 해당하는 색을 꺼냄
  const boxColor = {
    ready: '#bdbdbd',    // 시작 전: 회색
    waiting: '#e53935',  // 대기 중: 빨강
    go: '#43a047',       // 클릭 타이밍: 초록
    result: '#bdbdbd',   // 결과 화면: 회색
    tooSoon: '#bdbdbd',  // 실패 화면: 회색 (실패는 텍스트로 표시)
  }[status]

  // 같은 패턴 — status 별 박스 안 텍스트 매핑
  // 'result' 의 경우 백틱 템플릿으로 reactionMs 값을 끼워 넣음
  const boxText = {
    ready: '시작 버튼 또는 Space',
    waiting: '기다리세요…',
    go: '지금 클릭 / Space!',
    result: `${reactionMs} ms`,
    tooSoon: '너무 빨라요!',
  }[status]

  return (
    // 래퍼 div — 가운데 정렬, 24px 패딩
    <div style={{ padding: '24px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      {/* 헤더 — 팀명 표시 */}
      <h2>⚡ {teamName} 팀 반응속도 테스트</h2>
      {/* 최고 기록 표시
          삼항 연산자 — bestMs 가 null 이 아니면 'X ms', null 이면 '—' 로 표시
          백틱 템플릿으로 숫자 + 단위 결합 */}
      <p style={{ color: '#666' }}>최고 기록: {bestMs !== null ? `${bestMs} ms` : '—'}</p>

      {/* 메인 박스 — 클릭 가능한 큰 영역 */}
      <div
        // 클릭 시 handleBoxClick 호출
        onClick={handleBoxClick}
        style={{
          // 가로 100% 까지 꽉 차되 최대 480px 로 제한 (큰 화면에서 너무 안 커지게)
          width: '100%',
          maxWidth: '480px',
          height: '240px',
          // margin: '24px auto' — 위아래 24px, 좌우 auto 로 가운데 정렬
          margin: '24px auto',
          // 위 매핑에서 가져온 색
          background: boxColor,
          // 글자색 흰색
          color: '#fff',
          // 모서리 둥글게
          borderRadius: '16px',
          // 박스 안에서 텍스트 가운데 정렬 (flex 사용)
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          // 클릭이 의미 있는 단계(waiting/go)일 때만 손가락 커서, 아니면 기본
          cursor: status === 'waiting' || status === 'go' ? 'pointer' : 'default',
          // 텍스트 드래그 선택 막아서 게임 느낌 유지
          userSelect: 'none',
          // 배경색 변경 시 0.1초 부드럽게
          transition: 'background 0.1s ease',
        }}
      >
        {/* 박스 안 텍스트 — 위 매핑에서 꺼낸 boxText */}
        {boxText}
      </div>

      {/* 하단 버튼 영역 */}
      <div>
        {/* 조건부 렌더링 — && 단축평가
            왼쪽이 true 면 오른쪽 JSX 가 그려짐, false 면 아무것도 안 그려짐
            ready 단계에서만 "시작" 버튼 표시 */}
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
        {/* result 또는 tooSoon 일 때만 "다시" 버튼 표시
            괄호로 묶은 (A || B) 가 한 덩어리, 그게 true 면 && 뒤 JSX 그려짐 */}
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

// 다른 파일에서 import 해서 쓸 수 있게 default export
export default ReactionTest

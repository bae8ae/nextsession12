// 슬롯 상태 관리(useState) 랑 일정 간격 갱신(useEffect + setInterval) 둘 다 필요해서 같이 import
import { useState, useEffect } from 'react'

// 오른쪽 슬롯에 들어갈 별명 후보들 — 컴포넌트 바깥에 둬도 되지만 발표 때 한 파일에서 보여주려고 안에 둠
const NICKNAMES = [
  // 코딩 잘하는 이미지의 별명
  '코딩요정',
  // 트렌드 잘 따라가는 사람용
  'MZ장인',
  // 버그 잘 잡는 사람용
  '버그히어로',
  // 회의에서 분위기 풀어주는 사람
  '아이스브레이커',
  // 발표 잘하는 사람
  '말빨러',
  // 새벽까지 일하는 사람
  '심야개발자',
  // 커피 없으면 못 사는 사람
  '카페인중독',
  // 디자인 감각 좋은 사람
  '픽셀러버',
  // 문서 잘 쓰는 사람
  '리드미장인',
  // 어쨌든 다 해내는 사람
  '만능플레이어',
]

// teamName 은 헤더에, members 는 왼쪽 슬롯 풀로 사용
function NicknameSlot({ teamName, members }) {
  // 이 state 는 지금 왼쪽 슬롯에 보이는 멤버 이름. 처음엔 그냥 첫 번째 멤버로 시작.
  const [currentMember, setCurrentMember] = useState(members[0])
  // 이 state 는 지금 오른쪽 슬롯에 보이는 별명. 처음엔 첫 번째 별명으로 시작.
  const [currentNickname, setCurrentNickname] = useState(NICKNAMES[0])
  // 이 state 는 현재 슬롯이 돌아가고 있는지 여부. true 면 인터벌이 돌고 false 면 멈춤.
  const [isSpinning, setIsSpinning] = useState(false)

  // 배열에서 랜덤 원소 하나 꺼내는 헬퍼 — Math.random() 에 length 곱하고 floor 로 정수 인덱스 만듦
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

  // 이 effect 는 isSpinning 이 바뀔 때마다 실행됨.
  // true 일 때만 setInterval 을 걸어서 80ms 마다 양쪽 슬롯을 랜덤 갱신, false 면 그냥 빠져나감.
  useEffect(() => {
    // 멈춰있는 상태면 인터벌 깔지 않음
    if (!isSpinning) return

    // 80ms 마다 한 번씩 양쪽 슬롯을 새 랜덤 값으로 교체 — 너무 빠르면 어지럽고 너무 느리면 슬롯 느낌 안 남
    const intervalId = setInterval(() => {
      // 왼쪽 슬롯: members 배열에서 랜덤 한 명
      setCurrentMember(pickRandom(members))
      // 오른쪽 슬롯: NICKNAMES 배열에서 랜덤 한 개
      setCurrentNickname(pickRandom(NICKNAMES))
    }, 80)

    // isSpinning 이 false 로 바뀌거나 컴포넌트가 언마운트될 때 인터벌 정리
    // 안 정리하면 멈춤 버튼 눌러도 슬롯이 계속 돌아가는 버그가 생김
    return () => clearInterval(intervalId)
    // isSpinning 이 바뀔 때만 effect 다시 실행 — 회전 시작/정지 토글이 곧 이 effect 의 트리거
  }, [isSpinning])

  // "돌리기" 버튼 핸들러 — isSpinning 을 true 로 바꿔서 effect 가 인터벌을 걸도록
  const handleSpin = () => {
    setIsSpinning(true)
  }

  // "멈추기" 버튼 핸들러 — isSpinning 을 false 로 바꿔서 cleanup 이 인터벌 정리하도록
  const handleStop = () => {
    setIsSpinning(false)
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      {/* 어떤 팀의 슬롯머신인지 헤더 표시 */}
      <h2>🎰 {teamName} 팀 별명 슬롯머신</h2>
      {/* 사용 안내 — 처음 보는 사람도 이해할 수 있게 한 줄 */}
      <p style={{ color: '#666' }}>돌리기를 눌러서 멤버 + 별명 조합을 뽑아보세요</p>

      {/* 슬롯 두 칸을 가로로 나란히 — gap 으로 사이 띄움 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          margin: '32px 0',
        }}
      >
        {/* 왼쪽 슬롯 — 멤버 이름 */}
        <div
          style={{
            width: '180px',
            height: '120px',
            border: '3px solid #333',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            background: isSpinning ? '#fff8e1' : '#fff',
          }}
        >
          {currentMember}
        </div>
        {/* 가운데 X 표시 — 시각적으로 두 슬롯이 한 조합이라는 걸 보여주려고 */}
        <div style={{ alignSelf: 'center', fontSize: '24px', color: '#888' }}>×</div>
        {/* 오른쪽 슬롯 — 별명 */}
        <div
          style={{
            width: '180px',
            height: '120px',
            border: '3px solid #333',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            background: isSpinning ? '#e3f2fd' : '#fff',
          }}
        >
          {currentNickname}
        </div>
      </div>

      {/* 버튼 영역 — 현재 isSpinning 상태에 따라 한 쪽만 활성화 보이게 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {/* 돌리기 버튼 — 이미 돌고 있으면 비활성화 */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #888',
            background: isSpinning ? '#eee' : '#fff',
            cursor: isSpinning ? 'default' : 'pointer',
          }}
        >
          돌리기
        </button>
        {/* 멈추기 버튼 — 안 돌고 있으면 비활성화 */}
        <button
          onClick={handleStop}
          disabled={!isSpinning}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #888',
            background: !isSpinning ? '#eee' : '#fff',
            cursor: !isSpinning ? 'default' : 'pointer',
          }}
        >
          멈추기
        </button>
      </div>
    </div>
  )
}

// 다른 파일에서 import 해서 쓸 수 있도록 default export
export default NicknameSlot

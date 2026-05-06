// 두 훅 같이 import
// useState — 슬롯 두 칸의 현재 값과 회전 여부를 보관
// useEffect — 회전 중일 때 80ms 인터벌을 등록/해제
import { useState, useEffect } from 'react'

// 별명 후보 배열 — 컴포넌트 바깥에서 const 로 선언
// 한 번 정의되면 다시 만들지 않음 (컴포넌트 안에 두면 매 렌더마다 새로 만들어져서 비효율적)
const NICKNAMES = [
  // 후보 10개
  '향따남',
  '고대유식',
  '고대승용',
  '아이스브레이커',
  '말빨러',
  '심야개발자',
  '카페인중독',
  '픽셀러버',
  '리드미장인',
  '만능플레이어',
]

// 함수형 컴포넌트, props 에서 teamName / members 두 값 구조분해
function NicknameSlot({ teamName, members }) {
  // useState(members[0]) — 초기값을 첫 번째 멤버로 설정
  // 배열의 0번 인덱스 = 첫 원소
  // currentMember 의미: 지금 왼쪽 슬롯에 보이는 멤버 이름
  const [currentMember, setCurrentMember] = useState(members[0])
  // useState(NICKNAMES[0]) — 별명 배열의 첫 원소를 초기값으로
  // currentNickname 의미: 지금 오른쪽 슬롯에 보이는 별명
  const [currentNickname, setCurrentNickname] = useState(NICKNAMES[0])
  // useState(false) — 처음엔 슬롯이 멈춰 있는 상태
  // isSpinning 의미: 슬롯이 돌고 있는지(true) / 멈춰 있는지(false)
  const [isSpinning, setIsSpinning] = useState(false)

  // 헬퍼 함수 — 배열에서 랜덤 원소 하나 뽑기
  // Math.random() — 0 이상 1 미만 실수 난수
  // * arr.length — 0 ~ length 미만 범위로 확장
  // Math.floor(...) — 소수점 버려서 정수 인덱스로 변환 (0 ~ length-1)
  // arr[...] — 그 인덱스의 원소 반환
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

  // useEffect — isSpinning 이 바뀔 때마다 실행
  // true 일 때만 인터벌 등록, false 면 그냥 종료
  useEffect(() => {
    // 조기 리턴 — 멈춤 상태(false) 면 인터벌 안 깔고 끝
    // ! 는 논리 부정 연산자 (true → false, false → true)
    if (!isSpinning) return

    // setInterval(콜백, 간격ms) — 일정 간격마다 콜백 반복 실행
    // 80ms 는 사람이 슬롯이 빠르게 돌아간다고 느낄 정도의 속도
    const intervalId = setInterval(() => {
      // pickRandom(members) — members 배열에서 랜덤 한 명을 뽑아 왼쪽 슬롯 갱신
      setCurrentMember(pickRandom(members))
      // pickRandom(NICKNAMES) — NICKNAMES 배열에서 랜덤 별명을 뽑아 오른쪽 슬롯 갱신
      setCurrentNickname(pickRandom(NICKNAMES))
    }, 80)

    // cleanup — 다음 effect 재실행 직전 또는 언마운트 직전에 호출
    // clearInterval(intervalId) — 위에서 만든 인터벌을 끔
    // 안 정리하면: 멈춤 버튼 눌러도 옛 인터벌이 계속 살아서 슬롯이 멈추지 않는 버그 발생
    return () => clearInterval(intervalId)
    // 의존성 [isSpinning] — 이 값이 바뀔 때만 effect 재평가 (회전 시작/정지 토글이 곧 트리거)
  }, [isSpinning])

  // "돌리기" 버튼 핸들러 — isSpinning 을 true 로 바꿔서 effect 가 인터벌 깔도록 함
  const handleSpin = () => {
    setIsSpinning(true)
  }

  // "멈추기" 버튼 핸들러 — isSpinning 을 false 로 바꿔서 cleanup 이 인터벌 정리하도록 함
  const handleStop = () => {
    setIsSpinning(false)
  }

  return (
    // 래퍼 div — 가운데 정렬, 24px 패딩
    <div style={{ padding: '24px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      {/* 헤더 — 팀명 표시 */}
      <h2>🎰 {teamName} 팀 별명 슬롯머신</h2>
      {/* 안내 문구 */}
      <p style={{ color: '#666' }}>돌리기를 눌러서 멤버 + 별명 조합을 뽑아보세요</p>

      {/* 슬롯 두 칸을 가로로 나란히 배치하는 컨테이너 */}
      <div
        style={{
          // flex 가로 배치
          display: 'flex',
          // 가로 가운데 정렬
          justifyContent: 'center',
          // 슬롯 사이 간격 16px
          gap: '16px',
          // 위아래 32px 여백
          margin: '32px 0',
        }}
      >
        {/* 왼쪽 슬롯 — 멤버 이름 표시 */}
        <div
          style={{
            // 슬롯 크기 고정
            width: '180px',
            height: '120px',
            // 두꺼운 테두리로 슬롯 느낌
            border: '3px solid #333',
            borderRadius: '12px',
            // flex 로 안쪽 텍스트 가운데 정렬
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            // 삼항 — 회전 중이면 옅은 노랑, 멈춤이면 흰색 배경
            background: isSpinning ? '#fff8e1' : '#fff',
          }}
        >
          {/* 현재 멤버 이름 출력 */}
          {currentMember}
        </div>
        {/* 가운데 X 표시 — 두 슬롯이 한 조합임을 시각적으로 표현 */}
        <div style={{ alignSelf: 'center', fontSize: '24px', color: '#888' }}>×</div>
        {/* 오른쪽 슬롯 — 별명 표시 */}
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
            // 회전 중이면 옅은 파랑 (왼쪽과 색을 다르게 해서 구분)
            background: isSpinning ? '#e3f2fd' : '#fff',
          }}
        >
          {/* 현재 별명 출력 */}
          {currentNickname}
        </div>
      </div>

      {/* 버튼 영역 — flex 로 두 버튼을 가운데 정렬 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {/* 돌리기 버튼 */}
        <button
          // 클릭 시 handleSpin 호출 → isSpinning true 로
          onClick={handleSpin}
          // 이미 회전 중이면 비활성화 (중복 클릭 막기)
          disabled={isSpinning}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #888',
            // 회전 중이면 회색 배경(비활성 표시), 아니면 흰색
            background: isSpinning ? '#eee' : '#fff',
            // 회전 중이면 기본 커서, 아니면 클릭 가능 표시
            cursor: isSpinning ? 'default' : 'pointer',
          }}
        >
          돌리기
        </button>
        {/* 멈추기 버튼 */}
        <button
          // 클릭 시 handleStop 호출 → isSpinning false 로
          onClick={handleStop}
          // 안 돌고 있으면 비활성화 — !isSpinning 은 isSpinning 이 false 일 때 true
          disabled={!isSpinning}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #888',
            // 안 돌고 있으면 회색, 돌고 있으면 흰색
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

// 외부 파일에서 import 해서 쓸 수 있도록 default export
export default NicknameSlot

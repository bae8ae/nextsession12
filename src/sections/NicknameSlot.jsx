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

  // 카지노 머신 본체 색상 — 자주 쓰는 값을 변수로 빼서 가독성 좋게
  // 진한 와인색(외곽 바디) + 골드(테두리 장식) + 검정(릴 안쪽) 조합이 카지노 느낌의 정석
  const bodyRed = 'linear-gradient(180deg, #b71c1c 0%, #7f0000 100%)'
  const goldEdge = 'linear-gradient(180deg, #ffe082 0%, #ffb300 50%, #ff8f00 100%)'
  const reelBg = 'linear-gradient(180deg, #1a1a1a 0%, #000 50%, #1a1a1a 100%)'

  return (
    // 래퍼 div — 가운데 정렬, 양옆 패딩
    <div style={{ padding: '24px 16px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      {/* 안내 문구 (머신 위 작은 헤더 역할) */}
      <p style={{ color: '#666', marginBottom: '16px' }}>
        레버를 당겨서 {teamName} 팀 별명 조합을 뽑아보세요!
      </p>

      {/* 머신 외형 컨테이너 — 와인색 본체 + 골드 테두리로 카지노 머신 실루엣 */}
      <div
        style={{
          // 머신 폭 — 화면이 좁아도 안 깨지게 max 480
          maxWidth: '480px',
          // margin: '0 auto' — 좌우 가운데 정렬
          margin: '0 auto',
          // 머신 본체 배경 — 위에서 만든 와인색 그라데이션
          background: bodyRed,
          // 라운드 — 윗부분은 더 둥글게(돔 모양), 아래는 살짝 둥글게
          borderRadius: '32px 32px 20px 20px',
          // 골드 두꺼운 테두리 — solid 색은 그라데이션 안 먹어서 box-shadow 로 골드 띠 시뮬레이션
          // 안쪽 어두운 그림자 + 바깥쪽 골드 라인 + 입체감용 그림자 세트
          boxShadow: '0 0 0 6px #d4a017, 0 0 0 9px #5d3a00, 0 20px 40px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.4)',
          // 안쪽 패딩 — 머신 내부 부품들 위치 조정
          padding: '24px 24px 28px',
          // 글자색 흰색 (어두운 본체 위라서)
          color: '#fff',
          // 위치 기준점 — 자식 요소(전구 등) absolute 배치할 때 기준
          position: 'relative',
        }}
      >
        {/* 상단 마퀴(JACKPOT 간판) — 골드 그라데이션 + 깜빡이 느낌 */}
        <div
          style={{
            // 골드 그라데이션 배경
            background: goldEdge,
            // 검정 글씨가 골드 위에 가장 잘 보임
            color: '#3e2723',
            // 라운드 + 작은 위아래 패딩
            borderRadius: '12px',
            padding: '8px 16px',
            // 굵은 카지노 폰트 느낌 — serif 계열 + 굵게
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            // 글자 크기 살짝 크게
            fontSize: '22px',
            // 자간 넓혀서 간판 느낌
            letterSpacing: '4px',
            // 입체감용 그림자
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3)',
            // 아래 릴과 간격
            marginBottom: '20px',
          }}
        >
          ★ JACKPOT ★
        </div>

        {/* 릴 컨테이너 — 슬롯 두 칸을 검정 패널 안에 가두는 프레임 */}
        <div
          style={{
            // 검정 그라데이션 — 릴 뒤판
            background: reelBg,
            // 라운드
            borderRadius: '12px',
            // 패널 안쪽 여백
            padding: '20px 16px',
            // 골드 안쪽 테두리 — 카지노 LED 느낌
            boxShadow: 'inset 0 0 0 3px #d4a017, inset 0 0 20px rgba(0,0,0,0.8)',
            // 릴 사이 가로 정렬
            display: 'flex',
            // 가로 가운데
            justifyContent: 'center',
            // 릴 사이 간격
            gap: '12px',
            // 가운데 정렬 (세로)
            alignItems: 'center',
            // 아래 버튼과 간격
            marginBottom: '20px',
          }}
        >
          {/* 왼쪽 릴 — 멤버 이름 */}
          <div
            style={{
              // 릴 크기
              flex: 1,
              height: '110px',
              // 흰색 베이스 + 회전 시 노란 빛 살짝
              background: isSpinning
                ? 'linear-gradient(180deg, #fff9c4 0%, #fff 50%, #fff9c4 100%)'
                : 'linear-gradient(180deg, #f5f5f5 0%, #fff 50%, #f5f5f5 100%)',
              // 글자 검정
              color: '#222',
              // 라운드 — 릴 카드 느낌
              borderRadius: '8px',
              // flex 로 가운데 정렬
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // 큰 글씨로 시선 집중
              fontSize: '28px',
              fontWeight: 'bold',
              // 회전 중일 때 살짝 흐릿한 느낌 — blur 미세하게
              filter: isSpinning ? 'blur(0.6px)' : 'none',
              // 안쪽 그림자로 깊이감
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.2)',
              // 깜빡임 같은 부드러운 전환
              transition: 'background 0.2s ease',
            }}
          >
            {currentMember}
          </div>
          {/* 가운데 구분 — × 대신 골드 점 두 개로 슬롯 구획감 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb300', boxShadow: '0 0 6px #ffb300' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb300', boxShadow: '0 0 6px #ffb300' }}></span>
          </div>
          {/* 오른쪽 릴 — 별명 */}
          <div
            style={{
              flex: 1,
              height: '110px',
              background: isSpinning
                ? 'linear-gradient(180deg, #bbdefb 0%, #fff 50%, #bbdefb 100%)'
                : 'linear-gradient(180deg, #f5f5f5 0%, #fff 50%, #f5f5f5 100%)',
              color: '#222',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              filter: isSpinning ? 'blur(0.6px)' : 'none',
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.2)',
              transition: 'background 0.2s ease',
            }}
          >
            {currentNickname}
          </div>
        </div>

        {/* 결과 안내(스코어보드 느낌) — 회전 안 할 때만 결과 강조 */}
        <div
          style={{
            // 어두운 패널 위 골드 글씨
            background: 'rgba(0,0,0,0.4)',
            color: '#ffd54f',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            marginBottom: '20px',
            // 안쪽 골드 라인
            boxShadow: 'inset 0 0 0 1px #d4a017',
          }}
        >
          {/* 회전 중이면 "SPINNING…", 아니면 현재 조합 */}
          {isSpinning ? '🎲 SPINNING…' : `★ ${currentMember} × ${currentNickname} ★`}
        </div>

        {/* 버튼 영역 — 머신 하단 컨트롤 패널 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {/* 돌리기(SPIN) 버튼 — 빨간 큰 버튼이 카지노 머신 시그니처 */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            style={{
              // 둥근 알약 모양
              padding: '14px 36px',
              borderRadius: '999px',
              // 빨간 그라데이션 — 돌고 있으면 어둡게
              background: isSpinning
                ? 'linear-gradient(180deg, #757575 0%, #424242 100%)'
                : 'linear-gradient(180deg, #ff5252 0%, #c62828 100%)',
              color: '#fff',
              // 골드 테두리
              border: '3px solid #ffb300',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '3px',
              cursor: isSpinning ? 'default' : 'pointer',
              // 입체 그림자
              boxShadow: '0 4px 0 #5d3a00, 0 6px 12px rgba(0,0,0,0.4)',
              // 글자 그림자 — 살짝 입체감
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              transition: 'transform 0.1s ease',
              // 누를 때 살짝 들어가는 느낌
              transform: isSpinning ? 'translateY(2px)' : 'translateY(0)',
            }}
          >
            🎰 SPIN
          </button>
          {/* 멈추기(STOP) 버튼 — 검정 + 골드 라인 */}
          <button
            onClick={handleStop}
            disabled={!isSpinning}
            style={{
              padding: '14px 36px',
              borderRadius: '999px',
              background: !isSpinning
                ? 'linear-gradient(180deg, #757575 0%, #424242 100%)'
                : 'linear-gradient(180deg, #424242 0%, #000 100%)',
              color: '#ffd54f',
              border: '3px solid #ffb300',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '3px',
              cursor: !isSpinning ? 'default' : 'pointer',
              boxShadow: '0 4px 0 #5d3a00, 0 6px 12px rgba(0,0,0,0.4)',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              transition: 'transform 0.1s ease',
              transform: !isSpinning ? 'translateY(2px)' : 'translateY(0)',
            }}
          >
            ✋ STOP
          </button>
        </div>
      </div>
    </div>
  )
}

// 외부 파일에서 import 해서 쓸 수 있도록 default export
export default NicknameSlot

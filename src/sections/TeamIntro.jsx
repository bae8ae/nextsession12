// 리액트에서 상태랑 사이드이펙트 쓸 거라서 두 훅 같이 가져옴
import { useState, useEffect } from 'react'

// App.jsx 에서 teamName, members 를 prop 으로 내려줘서 그대로 받아 씀
function TeamIntro({ teamName, members }) {
  // 지금 화면에서 강조해서 보여줄 멤버가 몇 번째인지 기억해두는 값 (0~3 사이를 돌 거임)
  const [activeIdx, setActiveIdx] = useState(0)

  // 3초마다 자동으로 다음 멤버로 넘어가게 하려고 인터벌을 깔아두는 용도.
  // 컴포넌트가 처음 마운트될 때 한 번 켜고, 언마운트될 때 정리만 해주면 됨.
  useEffect(() => {
    // setInterval 의 리턴값(타이머 ID)을 잡아둬야 나중에 clearInterval 로 끌 수 있음
    const timerId = setInterval(() => {
      // 이전 인덱스 기준으로 +1 하고, 멤버 수로 나눠서 끝까지 가면 다시 0번으로 돌아오게
      setActiveIdx((prev) => (prev + 1) % members.length)
      // 3000ms = 3초마다 한 번씩 실행 (요구사항이 3초 자동 슬라이드여서)
    }, 3000)

    // 컴포넌트가 사라지거나 effect 가 다시 돌 때 타이머가 두 개로 늘어나면 안 되니까 무조건 정리
    return () => clearInterval(timerId)
    // members.length 가 바뀌면 modulo 기준이 달라지니까 의존성에 넣어둠.
    // teamName 같은 건 인터벌 로직이랑 상관없어서 일부러 안 넣음.
  }, [members.length])

  // 카드 컨테이너 한 번에 가운데 정렬하려고 바깥 래퍼 div 에 인라인 스타일 사용
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      {/* 팀 이름 먼저 크게 보여줘야 "아 팀 소개구나" 가 바로 보임 */}
      <h2 style={{ marginBottom: '8px' }}>👥 {teamName} 팀을 소개합니다</h2>
      {/* 지금 몇 번째 멤버를 보고 있는지 사용자한테도 알려주는 안내 문구 */}
      <p style={{ color: '#666', marginTop: 0 }}>
        3초마다 강조되는 멤버가 바뀝니다 ({activeIdx + 1} / {members.length})
      </p>

      {/* 멤버 카드들을 가로로 쭉 나열, 화면 좁으면 줄바꿈되도록 wrap */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
        {/* members 배열을 돌면서 카드 4장 그림. idx 로 현재 강조 대상인지 비교 */}
        {members.map((name, idx) => (
          // key 는 이름이 겹칠 수도 있어서 idx 까지 같이 묶어서 안전하게
          <div
            key={`${name}-${idx}`}
            // 현재 활성화된 카드만 색/그림자 강조해서 시선이 가게
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              minWidth: '120px',
              textAlign: 'center',
              background: idx === activeIdx ? '#ffe9a8' : '#fafafa',
              boxShadow: idx === activeIdx ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              transform: idx === activeIdx ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            {/* 멤버 번호 표시 (1부터 보이게 +1) */}
            <div style={{ fontSize: '12px', color: '#888' }}>#{idx + 1}</div>
            {/* 실제 이름 — 발표 때 누구인지 가장 잘 보여야 하니까 글자 크게 */}
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 다른 파일에서 import 해서 쓸 수 있게 default export
export default TeamIntro

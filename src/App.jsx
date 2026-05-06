import { useState } from 'react'
import './App.css'
import TeamIntro from './sections/TeamIntro'
import TeamQuiz from './sections/TeamQuiz'
import ReactionTest from './sections/ReactionTest'
import NicknameSlot from './sections/NicknameSlot'

// ─────────────────────────────────────────────
//  ✏️  팀에서 이 부분만 직접 채워주세요
// ─────────────────────────────────────────────
const TEAM_NAME = '여기에 팀명'
const MEMBERS = [
  '멤버1',
  '멤버2',
  '멤버3',
  '멤버4',
]
// ─────────────────────────────────────────────

const TABS = [
  { key: 'intro', label: '팀 소개', Component: TeamIntro },
  { key: 'quiz', label: '미니 퀴즈', Component: TeamQuiz },
  { key: 'reaction', label: '반응속도', Component: ReactionTest },
  { key: 'nickname', label: '별명 슬롯머신', Component: NicknameSlot },
]

function App() {
  const [activeTab, setActiveTab] = useState('intro')
  const Active = TABS.find((t) => t.key === activeTab)?.Component

  return (
    <div className="app">
      <header className="header">
        <h1 className="teamName">{TEAM_NAME}</h1>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="main">{Active && <Active teamName={TEAM_NAME} members={MEMBERS} />}</main>
    </div>
  )
}

export default App

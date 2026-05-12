import './index.css'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import ActiveSeason from './components/sections/ActiveSeason'
import PastSeasons from './components/sections/PastSeasons'
import { useFarmData } from './hooks/useFarmData'

export default function App() {
  const {
    activeSeason,
    pastSeasons,
    startSeason,
    logStage,
    completeSeason,
    deleteActiveSeason,
  } = useFarmData()

  return (
    <div>
      <Navbar />
      <main className="page-container">
        {!activeSeason ? (
          <>
            <Home onStart={startSeason} />
            <PastSeasons seasons={pastSeasons} />
          </>
        ) : (
          <>
            <ActiveSeason
              season={activeSeason}
              onLogStage={logStage}
              onComplete={completeSeason}
              onDelete={deleteActiveSeason}
            />
            <PastSeasons seasons={pastSeasons} />
          </>
        )}
      </main>
    </div>
  )
}
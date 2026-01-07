import { useState, useEffect, useRef } from 'react'
import { GiTomato } from 'react-icons/gi'
import { FaCoffee, FaClock, FaMusic, FaVolumeMute } from 'react-icons/fa'
import FlipClock from './components/FlipClock'
import SessionController from './components/SessionController'
import './App.css'

function App() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState('work') // 'work' or 'break'
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const [ytPlaying, setYtPlaying] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [tempWork, setTempWork] = useState(String(workDuration))
  const [tempBreak, setTempBreak] = useState(String(breakDuration))

  const totalRef = useRef(workDuration * 60)
  const sessionTypeRef = useRef(sessionType)
  const breakDurationRef = useRef(breakDuration)
  const workDurationRef = useRef(workDuration)
  // tone preview parameters
  const [workFreqs, setWorkFreqs] = useState([880,1040,1318])
  const [workVol, setWorkVol] = useState(0.32)
  

  

  // keep refs in sync
  useEffect(() => { totalRef.current = minutes * 60 + seconds }, [minutes, seconds])
  useEffect(() => { sessionTypeRef.current = sessionType }, [sessionType])
  useEffect(() => { breakDurationRef.current = breakDuration }, [breakDuration])
  useEffect(() => { workDurationRef.current = workDuration }, [workDuration])

  useEffect(() => {
    let interval = null

    if (isRunning) {
      // ensure totalRef has correct value
      totalRef.current = minutes * 60 + seconds

      interval = setInterval(() => {
        if (totalRef.current > 0) {
          totalRef.current -= 1
          const m = Math.floor(totalRef.current / 60)
          const s = totalRef.current % 60
          setMinutes(m)
          setSeconds(s)
        } else {
          // reached 00:00 -> transition to next session
          playEndSound(sessionTypeRef.current)

          if (sessionTypeRef.current === 'work') {
            setSessionsCompleted((prev) => prev + 1)
            setSessionType('break')
            const next = breakDurationRef.current * 60
            totalRef.current = next
            setMinutes(Math.floor(next / 60))
            setSeconds(next % 60)
            setIsRunning(true)
          } else {
            setSessionType('work')
            const next = workDurationRef.current * 60
            totalRef.current = next
            setMinutes(Math.floor(next / 60))
            setSeconds(next % 60)
            setIsRunning(true)
          }
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  const playEndSound = (type) => {
    if (!soundEnabled) return
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ac = new AudioCtx()
      if (ac.state === 'suspended' && ac.resume) ac.resume()

      const now = ac.currentTime
      const masterGain = ac.createGain()
      masterGain.connect(ac.destination)

      // Different melodies for work end vs break end
      // use configured workFreqs for both work and break (break = reversed)
      const freqs = type === 'work' ? workFreqs : [...workFreqs].reverse()
      let offset = 0
      freqs.forEach((f) => {
        const o = ac.createOscillator()
        const g = ac.createGain()
        o.type = 'sine'
        o.frequency.value = f
        o.connect(g)
        g.connect(masterGain)

        const dur = 0.16
        const start = now + offset
        g.gain.setValueAtTime(0.0001, start)
        g.gain.linearRampToValueAtTime(workVol, start + 0.01)
        g.gain.exponentialRampToValueAtTime(0.001, start + dur)

        o.start(start)
        o.stop(start + dur + 0.02)
        offset += dur
      })
    } catch (e) {
      try {
        const beep = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=')
        beep.play().catch(() => {})
      } catch (_) {}
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setSessionType('work')
    setMinutes(workDuration)
    setSeconds(0)
  }

  const skipSession = () => {
    if (sessionType === 'work') {
      setSessionsCompleted((prev) => prev + 1)
      setSessionType('break')
      setMinutes(breakDuration)
    } else {
      setSessionType('work')
      setMinutes(workDuration)
    }
    setSeconds(0)
    setIsRunning(false)
  }

  const handleSettingsChange = (newWorkDuration, newBreakDuration) => {
    setWorkDuration(newWorkDuration)
    setBreakDuration(newBreakDuration)
    setIsRunning(false)
    setSessionType('work')
    setMinutes(newWorkDuration)
    setSeconds(0)
    setShowSettings(false)
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header-info">
        <div className="session-info">
          <span className={`session-badge ${sessionType}`}>
            {sessionType === 'work' ? <><GiTomato style={{marginRight:6}} />Trabajo</> : <><FaCoffee style={{marginRight:6}} />Descanso</>}
          </span>
          <span className="sessions-count">Sesiones: {sessionsCompleted}</span>
        </div>
      </div>

      

      <FlipClock minutes={minutes} seconds={seconds} sessionType={sessionType} isDarkMode={isDarkMode} />

        <div className="footer-controls">
        <SessionController
          isRunning={isRunning}
          onToggle={toggleTimer}
          onReset={resetTimer}
          onSkip={skipSession}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          onOpenSettings={() => {
            setTempWork(String(workDuration))
            setTempBreak(String(breakDuration))
            setShowSettings(true)
          }}
          workDuration={workDuration}
          breakDuration={breakDuration}
        />
      </div>

      {showSettings && (
        <div className="settings-modal" onClick={() => setShowSettings(false)}>
          <div className="settings-content" onClick={(e) => e.stopPropagation()}>
            <h2>⏱️ Personalizar tiempos</h2>
            <div className="settings-group">
              <label>Tiempo de estudio (minutos):</label>
              <input
                type="number"
                min="1"
                max="60"
                value={tempWork}
                onChange={(e) => setTempWork(e.target.value)}
              />
            </div>
            <div className="settings-group">
              <label>Tiempo de descanso (minutos):</label>
              <input
                type="number"
                min="1"
                max="60"
                value={tempBreak}
                onChange={(e) => setTempBreak(e.target.value)}
              />
            </div>
            <div className="settings-buttons">
              <button className="settings-btn save" onClick={() => handleSettingsChange(Math.max(1, parseInt(tempWork) || 25), Math.max(1, parseInt(tempBreak) || 5))}>
                Guardar
              </button>
              <button className="settings-btn cancel" onClick={() => setShowSettings(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube music toggle (plays in background via hidden iframe) */}
      <button
        className={`yt-button ${ytPlaying ? 'playing' : ''} ${isDarkMode ? 'dark' : 'light'}`}
        onClick={() => setYtPlaying((p) => !p)}
        aria-label={ytPlaying ? 'Detener música' : 'Reproducir música'}
      >
        {ytPlaying ? <FaVolumeMute size={18} /> : <FaMusic size={20} />}
      </button>

      {/* Hidden iframe to keep playback alive without foreground overlay */}
      {ytPlaying && (
        <div style={{display: 'none'}} aria-hidden="true">
          <iframe
            title="YouTube Live Hidden"
            src="https://www.youtube.com/embed/XSXEaikz0Bc?autoplay=1&controls=0&rel=0"
            frameBorder="0"
            allow="autoplay; encrypted-media"
          />
        </div>
      )}
    </div>
  )
}

export default App

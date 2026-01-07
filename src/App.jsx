import { useState, useEffect } from 'react'
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

  useEffect(() => {
    let interval = null

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          // Time's up!
          setIsRunning(false)
          playNotificationSound()
          
          if (sessionType === 'work') {
            setSessionsCompleted(sessionsCompleted + 1)
            setSessionType('break')
            setMinutes(breakDuration)
            setSeconds(0)
          } else {
            setSessionType('work')
            setMinutes(workDuration)
            setSeconds(0)
          }
        }
      }, 1000)
    } else if (!isRunning) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isRunning, minutes, seconds, sessionType, sessionsCompleted])

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
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
      setSessionsCompleted(sessionsCompleted + 1)
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
            {sessionType === 'work' ? '🍅 Trabajo' : '☕ Descanso'}
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
          onOpenSettings={() => setShowSettings(true)}
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
                value={workDuration}
                onChange={(e) => setWorkDuration(Math.max(1, parseInt(e.target.value) || 25))}
              />
            </div>
            <div className="settings-group">
              <label>Tiempo de descanso (minutos):</label>
              <input
                type="number"
                min="1"
                max="60"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Math.max(1, parseInt(e.target.value) || 5))}
              />
            </div>
            <div className="settings-buttons">
              <button className="settings-btn save" onClick={() => handleSettingsChange(workDuration, breakDuration)}>
                Guardar
              </button>
              <button className="settings-btn cancel" onClick={() => setShowSettings(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

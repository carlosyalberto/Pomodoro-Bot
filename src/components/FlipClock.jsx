import './FlipClock.css'

const FlipCard = ({ value, type }) => {
  const displayValue = String(value).padStart(2, '0')

  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">{displayValue}</div>
        <div className="flip-card-back">{displayValue}</div>
      </div>
      <div className="flip-label">{type}</div>
    </div>
  )
}

export default function FlipClock({ minutes, seconds, sessionType, isDarkMode }) {
  return (
    <div className={`flip-clock-container ${sessionType} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="flip-clock">
        <div className="time-display">
          <div className="digit-group">
            <FlipCard value={minutes} type="MIN" />
          </div>
          <div className="separator">:</div>
          <div className="digit-group">
            <FlipCard value={seconds} type="SEC" />
          </div>
        </div>
      </div>
    </div>
  )
}

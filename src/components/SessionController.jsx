import './SessionController.css'

export default function SessionController({ isRunning, onToggle, onReset, onSkip, isDarkMode, onThemeToggle, onOpenSettings, workDuration, breakDuration }) {
  return (
    <div className={`session-controller ${isDarkMode ? 'dark' : 'light'}`}>
      <button
        className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
        onClick={onThemeToggle}
        title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>

      <button
        className="control-btn play-pause ${isRunning ? 'playing' : ''}"
        onClick={onToggle}
        title={isRunning ? 'Pausar' : 'Iniciar'}
      >
        {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
      </button>

      <button
        className="control-btn reset"
        onClick={onReset}
        title="Reiniciar"
      >
        🔄 Reiniciar
      </button>

      <button
        className="control-btn skip"
        onClick={onSkip}
        title="Saltar sesión"
      >
        ⏭️ Saltar
      </button>

      <button
        className="control-btn settings"
        onClick={onOpenSettings}
        title={`Personalizar: ${workDuration}m estudio, ${breakDuration}m descanso`}
      >
        ⏰ Personalizar
      </button>
    </div>
  )
}

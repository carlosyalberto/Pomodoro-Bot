import { useEffect, useState } from 'react'
import { fetchUserSessions } from './auth/firebase'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard({ user }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return navigate('/')
    let mounted = true
    fetchUserSessions(user.uid).then((items) => {
      if (!mounted) return
      setSessions(items)
      setLoading(false)
    }).catch((e) => {
      console.error(e)
      setLoading(false)
    })
    return () => { mounted = false }
  }, [user])

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60
  const totalSessions = sessions.length

  const today = new Date()
  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  const sessionsToday = sessions.filter(s => {
    const ts = s.createdAt?.toDate ? s.createdAt.toDate() : (s.createdAt && s.createdAt.seconds ? new Date(s.createdAt.seconds * 1000) : null)
    return ts ? isSameDay(ts, today) : false
  }).length

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <div className="brand">Pomodoro Bot</div>
        <nav className="nav">
          <button className="nav-btn active">Dashboard</button>
          <button className="nav-btn" onClick={() => navigate('/')}>Timer</button>
          <button className="nav-btn" onClick={() => navigate('/settings')}>Ajustes</button>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="settings-btn cancel" onClick={() => navigate(-1)}>← Volver</button>
            <h2>Dashboard</h2>
          </div>
          <div className="topbar-right">Hola, {user?.displayName || 'Usuario'}</div>
        </header>

        <div className="container">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <>
              <section className="stats-grid">
                <div className="card stat">
                  <div className="label">Total sesiones</div>
                  <div className="value">{totalSessions}</div>
                </div>
                <div className="card stat">
                  <div className="label">Tiempo total (min)</div>
                  <div className="value">{Math.round(totalMinutes)}</div>
                </div>
                <div className="card stat">
                  <div className="label">Promedio sesión (min)</div>
                  <div className="value">{totalSessions ? Math.round(totalMinutes / totalSessions) : 0}</div>
                </div>
                <div className="card stat">
                  <div className="label">Sesiones hoy</div>
                  <div className="value">{sessionsToday}</div>
                </div>
              </section>

              <section className="content">
                <div className="card chart">
                  <h3>Actividad</h3>
                  <div className="chart-placeholder">Gráfico de actividad (próximamente)</div>
                </div>

                <div className="card recent">
                  <h3>Sesiones recientes</h3>
                  <div className="recent-list">
                    {sessions.length === 0 && <div className="empty">No hay sesiones registradas.</div>}
                    {sessions.map(s => {
                      const created = s.createdAt?.toDate ? s.createdAt.toDate() : (s.createdAt && s.createdAt.seconds ? new Date(s.createdAt.seconds * 1000) : new Date())
                      return (
                        <div key={s.id} className="recent-item">
                          <div className="recent-main">
                            <div className="recent-type">{s.type}</div>
                            <div className="recent-time">{created.toLocaleString()}</div>
                          </div>
                          <div className="recent-meta">Duración: {Math.round((s.duration || 0) / 60)} min</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

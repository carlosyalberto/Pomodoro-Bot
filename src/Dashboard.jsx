import { useEffect, useState } from 'react'
import { fetchUserSessions } from './auth/firebase'
import { useNavigate } from 'react-router-dom'

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

  return (
    <div className="app-container">
      <div style={{padding:20}}>
        <button className="settings-btn cancel" onClick={() => navigate(-1)}>← Volver</button>
        <h1>Dashboard</h1>
        {loading ? <div>Cargando...</div> : (
          <div>
            <div style={{marginTop:12}}><strong>Total sesiones:</strong> {totalSessions}</div>
            <div style={{marginTop:6}}><strong>Tiempo total:</strong> {Math.round(totalMinutes)} min</div>
            <div style={{marginTop:12}}>
              <h3>Sesiones recientes</h3>
              <div style={{maxHeight: '60vh', overflowY: 'auto'}}>
                {sessions.map(s => (
                  <div key={s.id} style={{padding:8, borderBottom:'1px solid #ddd'}}>
                    <div style={{fontWeight:600}}>{s.type}</div>
                    <div style={{fontSize:12,color:'#666'}}>{new Date(s.createdAt?.toDate ? s.createdAt.toDate() : (s.createdAt && s.createdAt.seconds ? s.createdAt.seconds * 1000 : Date.now())).toLocaleString()}</div>
                    <div>Duración: {Math.round((s.duration||0)/60)} min</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

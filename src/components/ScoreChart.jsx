import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale)

export default function ScoreChart({ sessions }) {
  // sessions expected sorted desc by createdAt; we reverse to chronological
  const items = (sessions || []).slice().reverse()

  const labels = items.map((s) => {
    const created = s.createdAt?.toDate ? s.createdAt.toDate() : (s.createdAt && s.createdAt.seconds ? new Date(s.createdAt.seconds * 1000) : (s.completedAt ? new Date(s.completedAt) : new Date()))
    return created
  })

  const dataPoints = items.map((s) => (s.rating != null ? s.rating : null))

  const data = {
    labels,
    datasets: [
      {
        label: 'Puntuación por pomodoro',
        data: dataPoints,
        fill: false,
        borderColor: '#6366f1',
        backgroundColor: '#6366f1',
        tension: 0.2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'PP p'
        },
        ticks: { autoSkip: true, maxRotation: 0 }
      },
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' }
    }
  }

  return (
    <div style={{height: 260}}>
      <Line data={data} options={options} />
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DRIVER_COLORS = [
  '#e63946',
  '#1d3557',
  '#2a9d8f',
  '#f4a261',
  '#6a4c93',
  '#ff006e',
  '#3a86ff',
  '#8338ec',
  '#fb5607',
  '#43aa8b',
  '#577590',
  '#f94144',
  '#277da1',
  '#90be6d',
  '#f8961e',
  '#4d908e',
  '#f3722c',
  '#264653',
  '#8ecae6',
  '#b5179e',
  '#588157',
  '#bc4749',
];

function Statistics() {
  const [seasonPoints, setSeasonPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSeasonPoints = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const res = await axios.get(
          'http://localhost:5000/api/drivers/statistics/current-points'
        );

        setSeasonPoints(res.data || []);
      } catch (error) {
        console.error('Hiba a statisztikai adatok lekérésekor:', error);

        if (error?.response?.status === 409) {
          setErrorMessage(
            'A statisztikai adatok még nincsenek szinkronizálva. Előbb futtasd a /api/sync/season-points végpontot.'
          );
        } else {
          setErrorMessage('Nem sikerült betölteni a statisztikai adatokat.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonPoints();
  }, []);

  const chartData = useMemo(() => {
    const seasons = [...new Set(seasonPoints.map((item) => item.season_year))].sort(
      (a, b) => a - b
    );

    const drivers = [
      ...new Set(
        seasonPoints
          .map((item) => item.driver?.full_name)
          .filter(Boolean)
      ),
    ];

    const datasets = drivers.map((driverName, index) => {
      const color = DRIVER_COLORS[index % DRIVER_COLORS.length];

      return {
        label: driverName,
        data: seasons.map((season) => {
          const entry = seasonPoints.find(
            (item) =>
              item.season_year === season &&
              item.driver?.full_name === driverName
          );

          return entry ? entry.points : null;
        }),
        borderColor: color,
        backgroundColor: color,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        spanGaps: true,
        tension: 0.25,
      };
    });

    return {
      labels: seasons,
      datasets,
    };
  }, [seasonPoints]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#111827',
            boxWidth: 24,
            padding: 12,
            font: {
              size: 12,
            },
          },
        },
        title: {
          display: true,
          text: 'Jelenlegi F1 pilóták év végi pontszámai',
          color: '#111827',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${context.parsed.y ?? 0} pont`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#111827',
          },
          title: {
            display: true,
            text: 'Év',
            color: '#111827',
          },
          grid: {
            color: 'rgba(0,0,0,0.08)',
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#111827',
          },
          title: {
            display: true,
            text: 'Pontszám',
            color: '#111827',
          },
          grid: {
            color: 'rgba(0,0,0,0.08)',
          },
        },
      },
    }),
    []
  );

  return (
    <div className="wrapper">
      <section className="container">
        <div className="glass-box">
          <h2>STATISZTIKÁK</h2>
          <p>
            A diagram csak a jelenlegi Formula–1-es pilóták év végi pontszámait mutatja.
          </p>

          {loading && <p>Betöltés...</p>}
          {!loading && errorMessage && <p>{errorMessage}</p>}
          {!loading && !errorMessage && seasonPoints.length === 0 && (
            <p>Nincs még elérhető statisztikai adat.</p>
          )}

          {!loading && !errorMessage && seasonPoints.length > 0 && (
            <div
              style={{
                minHeight: '560px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                marginTop: '20px',
              }}
            >
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Statistics;
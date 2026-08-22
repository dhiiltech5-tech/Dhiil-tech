import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { getProjects, getServices, getTeam, getTestimonials, getNews, API_BASE } from './services/api';

// Fetch all public data from MySQL and cache to localStorage
const bootstrapPublicData = async () => {
    try {
        const [projects, services, team, testimonials, news] = await Promise.all([
            getProjects(),
            getServices(),
            getTeam(),
            getTestimonials(),
            getNews()
        ]);

        const statsRes = await fetch(`${API_BASE}/stats/track-visit`, { method: 'POST' })
            .then(r => r.json())
            .catch(() => ({ success: false, data: { visitorCount: 1240 } }));

        const raw = localStorage.getItem('ots-app-data');
        const currentData = raw ? JSON.parse(raw) : {};

        const updatedData = {
            ...currentData,
            projects: projects,
            services: services,
            team: team,
            testimonials: testimonials,
            news: news,
            visitorCount: statsRes.success && statsRes.data ? statsRes.data.visitorCount : (currentData.visitorCount || 1240),
            stats: {
                projects: projects.length,
                clients: 20,
                services: services.length,
                satisfaction: 99
            }
        };

        localStorage.setItem('ots-app-data', JSON.stringify(updatedData));
        window.dispatchEvent(new Event('app-data-updated'));
    } catch (e) {
        console.error("Failed to bootstrap public database data from MySQL:", e);
    }
};

// Initiate dynamic backend synchronization
bootstrapPublicData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

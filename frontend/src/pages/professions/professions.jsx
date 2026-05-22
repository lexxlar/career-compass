import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { professionsData } from '../../data/professionsData';
import ProfessionsHeader from './components/ProfessionsHeader/ProfessionsHeader';
import ProfessionCard from './components/ProfessionCard/ProfessionCard';

function ProfessionsPage() {
  const navigate = useNavigate();
  // professionsData используется как фолбэк и для иконок/цветов (их нет в БД)
  // Данные о профессиях (title, description, salary_range) тянем из API
  // и мёржим с локальными данными для иконок
  const [professions, setProfessions] = useState(professionsData);

  useEffect(() => {
    fetch('/api/professions')
      .then(r => r.json())
      .then(apiData => {
        if (!Array.isArray(apiData) || apiData.length === 0) return;
        // Мёржим: берём локальную структуру, обновляем поля из БД
        const merged = professionsData.map(local => {
          const fromApi = apiData.find(a => a.id === local.slug);
          if (!fromApi) return local;
          return {
            ...local,
            title: fromApi.title || local.title,
            fullDescription: fromApi.description || local.fullDescription,
          };
        });
        setProfessions(merged);
      })
      .catch(err => {
        // Если бэк недоступен — остаются локальные данные
        console.warn('API профессий недоступен, используются локальные данные:', err.message);
      });
  }, []);

  return (
    <section className="view active">
      <ProfessionsHeader />
      <div className="professions-grid">
        {professions.map((profession) => (
          <ProfessionCard
            key={profession.id}
            profession={profession}
            onClick={() => navigate(`/profession/${profession.slug}`)}
          />
        ))}
      </div>
    </section>
  );
}

export default ProfessionsPage;

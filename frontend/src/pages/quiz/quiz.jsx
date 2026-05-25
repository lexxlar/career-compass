import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, ArrowLeft, ArrowRight, RefreshCw, 
  Code, Server, Smartphone, CheckCircle, 
  Sparkles, Star, Trophy, ArrowUpRight
} from 'lucide-react';
import './quiz.css';

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    question_text: "Что тебя больше всего привлекает в разработке?",
    options: [
      { id: "a", text: "Создавать красивые интерфейсы, которые люди видят и используют" },
      { id: "b", text: "Строить надёжные системы, которые работают «под капотом»" },
      { id: "c", text: "Находить ошибки и убеждаться, что всё работает правильно" },
      { id: "d", text: "Разрабатывать приложения для смартфонов" },
      { id: "e", text: "Проектировать общую концепцию продукта и руководить процессом его создания" }
    ]
  },
  {
    id: 2,
    question_text: "Какой тип задач тебе нравится больше?",
    options: [
      { id: "a", text: "Вёрстка, анимации, адаптивный дизайн" },
      { id: "b", text: "Базы данных, API, бизнес-логика" },
      { id: "c", text: "Тест-кейсы, автотесты, поиск багов" },
      { id: "d", text: "Мобильные экраны, жесты, уведомления" },
      { id: "e", text: "Координация задач, планирование релизов и общение с командой" }
    ]
  },
  {
    id: 3,
    question_text: "Что из этого ты бы изучал с удовольствием?",
    options: [
      { id: "a", text: "React, CSS, Figma" },
      { id: "b", text: "Node.js, PostgreSQL, Docker" },
      { id: "c", text: "Selenium, Postman, нагрузочное тестирование" },
      { id: "d", text: "Kotlin, Android Studio, Material Design" },
      { id: "e", text: "Управление проектами и процессами (Agile, Scrum, Kanban)" }
    ]
  },
  {
    id: 4,
    question_text: "Как ты относишься к работе с визуальной частью продукта?",
    options: [
      { id: "a", text: "Обожаю — хочу чтобы всё выглядело идеально" },
      { id: "b", text: "Не особо, мне интереснее логика и данные" },
      { id: "c", text: "Мне важно проверить, что визуал работает без багов" },
      { id: "d", text: "Интересно, но в контексте мобильного приложения" },
      { id: "e", text: "Мне важно проектировать пользовательский опыт (UX) целиком, а не только визуальный стиль" }
    ]
  },
  {
    id: 5,
    question_text: "Что тебя раздражает больше всего?",
    options: [
      { id: "a", text: "Когда сайт выглядит некрасиво или неудобно" },
      { id: "b", text: "Когда сервер падает или данные теряются" },
      { id: "c", text: "Когда баги уходят в продакшн незамеченными" },
      { id: "d", text: "Когда приложение тормозит или вылетает на телефоне" },
      { id: "e", text: "Когда в команде царит хаос и нет четкого плана задач" }
    ]
  },
  {
    id: 6,
    question_text: "Выбери технологию, которую хочется изучить первой:",
    options: [
      { id: "a", text: "TypeScript + React" },
      { id: "b", text: "Express.js + PostgreSQL" },
      { id: "c", text: "Cypress или Playwright для автотестов" },
      { id: "d", text: "Kotlin + Jetpack Compose" },
      { id: "e", text: "Инструменты планирования (Jira) и основы командного взаимодействия" }
    ]
  },
  {
    id: 7,
    question_text: "Как ты относишься к командной работе?",
    options: [
      { id: "a", text: "Люблю показывать результат — дизайнерам и пользователям" },
      { id: "b", text: "Предпочитаю работать автономно над сложными задачами" },
      { id: "c", text: "Хочу быть тем, кто помогает всей команде выпускать без ошибок" },
      { id: "d", text: "Интересно работать с командой над мобильным продуктом" },
      { id: "e", text: "Мне нравится организовывать совместную работу и помогать команде общаться" }
    ]
  },
  {
    id: 8,
    question_text: "Какой результат работы тебя мотивирует?",
    options: [
      { id: "a", text: "Видеть свой интерфейс в браузере — красиво и удобно" },
      { id: "b", text: "Система обрабатывает тысячи запросов без сбоев" },
      { id: "c", text: "Отчёт с нулём критических багов перед релизом" },
      { id: "d", text: "Приложение в Play Market со звёздами и отзывами" },
      { id: "e", text: "Успешный релиз полезного продукта в срок при слаженной работе команды" }
    ]
  },
  {
    id: 9,
    question_text: "Какой стиль работы тебе ближе?",
    options: [
      { id: "a", text: "Итерации дизайна, быстрые правки, постоянный визуальный фидбэк" },
      { id: "b", text: "Планирование архитектуры, написание надёжного кода" },
      { id: "c", text: "Написание тест-планов, скрупулёзная проверка" },
      { id: "d", text: "Разработка под конкретную платформу с её ограничениями" },
      { id: "e", text: "Смешанный стиль: переключение между планированием задач, кодом и общением" }
    ]
  },
  {
    id: 10,
    question_text: "Какая зарплатная перспектива тебя привлекает больше?",
    options: [
      { id: "a", text: "Frontend — быстрый старт, много вакансий" },
      { id: "b", text: "Backend — выше средняя зарплата, высокий спрос" },
      { id: "c", text: "QA — стабильный вход, всегда нужны в командах" },
      { id: "d", text: "Android — узкая ниша, но хорошо оплачивается" },
      { id: "e", text: "Максимальная универсальность (Fullstack) или управление проектами (Manager)" }
    ]
  }
];

const PROFESSION_META = {
  frontend: {
    title: 'Frontend-разработчик',
    desc: 'Создает интерактивные пользовательские интерфейсы для веб-сайтов и веб-приложений. Превращает макеты дизайнеров в живой, работающий код, оптимизирует скорость загрузки страниц и заботится об удобстве пользователей.',
    icon: Code,
    color: '#3b82f6',
    bgColor: 'var(--blue-light)',
    slug: 'frontend'
  },
  backend: {
    title: 'Backend-разработчик',
    desc: 'Проектирует серверную архитектуру, базы данных и логику обработки информации. Обеспечивает стабильность, безопасность и высокую скорость работы систем «под капотом», с которыми общаются клиентские приложения.',
    icon: Server,
    color: '#8b5cf6',
    bgColor: 'var(--lilac-light)',
    slug: 'backend'
  },
  android: {
    title: 'Android-разработчик',
    desc: 'Разрабатывает мобильные приложения для смартфонов, планшетов, умных часов и телевизоров на базе операционной системы Android. Создает отзывчивый интерфейс с учетом аппаратных возможностей мобильных гаджетов.',
    icon: Smartphone,
    color: '#ec4899',
    bgColor: 'var(--pink-light)',
    slug: 'android'
  },
  qa: {
    title: 'QA Engineer (Тестировщик)',
    desc: 'Контролирует качество разрабатываемого ПО на всех этапах. Составляет тест-планы, находит дефекты и ошибки в работе систем, разрабатывает автотесты и следит, чтобы продукт полностью соответствовал требованиям.',
    icon: CheckCircle,
    color: '#10b981',
    bgColor: 'var(--lime-light)',
    slug: 'qa'
  }
};

const LOADING_STATUSES = [
  "Загружаем ваши ответы...",
  "Сопоставляем с картами компетенций...",
  "Вычисляем веса для 4 направлений...",
  "Подбираем лучшую траекторию обучения...",
  "Генерируем результаты..."
];

function QuizPage({ user, onUserUpdate }) {
  const navigate = useNavigate();
  
  const [started, setStarted] = useState(() => {
    return localStorage.getItem('last_quiz_started') === 'true';
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(() => {
    const saved = localStorage.getItem('last_quiz_current_idx');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('last_quiz_answers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(LOADING_STATUSES[0]);
  const [result, setResult] = useState(() => {
    const saved = localStorage.getItem('last_quiz_result');
    return saved ? JSON.parse(saved) : null;
  });

  // 1. Загрузка вопросов из базы данных
  useEffect(() => {
    setLoading(true);
    fetch('/api/quiz/questions')
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(FALLBACK_QUESTIONS);
        }
      })
      .catch(err => {
        console.warn('Backend API quiz/questions is offline, using fallback questions:', err.message);
        setQuestions(FALLBACK_QUESTIONS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. Симуляция смены текстов на экране анализа ответов
  useEffect(() => {
    if (!submitting) return;
    
    let textIdx = 0;
    const interval = setInterval(() => {
      textIdx++;
      if (textIdx < LOADING_STATUSES.length) {
        setSubmitMessage(LOADING_STATUSES[textIdx]);
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [submitting]);

  // Сброс состояния
  const handleReset = () => {
    localStorage.removeItem('last_quiz_started');
    localStorage.removeItem('last_quiz_current_idx');
    localStorage.removeItem('last_quiz_answers');
    localStorage.removeItem('last_quiz_result');
    setStarted(false);
    setCurrentIdx(0);
    setAnswers([]);
    setSubmitting(false);
    setResult(null);
    setSubmitMessage(LOADING_STATUSES[0]);
  };

  // Переход к следующему вопросу или отправка
  const handleSelectOption = (optionId) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIdx] = {
      questionId: questions[currentIdx].id,
      optionId: optionId
    };
    setAnswers(nextAnswers);
    localStorage.setItem('last_quiz_answers', JSON.stringify(nextAnswers));

    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      localStorage.setItem('last_quiz_current_idx', nextIdx.toString());
    } else {
      // Это был последний вопрос. Запускаем симуляцию глубокого анализа, затем делаем POST
      setSubmitting(true);
      
      const submitPayload = {
        userId: user?.id || null,
        answers: nextAnswers
      };

      setTimeout(() => {
        fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitPayload)
        })
          .then(res => {
            if (!res.ok) throw new Error('Submit API error');
            return res.json();
          })
          .then(data => {
            localStorage.setItem('last_quiz_result', JSON.stringify(data));
            
            const recommendedProfession = data.recommended[0];
            if (user && onUserUpdate) {
              const updatedUser = { ...user, current_profession: recommendedProfession };
              onUserUpdate(updatedUser);
            } else if (!user) {
              localStorage.setItem('anonymous_profession', recommendedProfession);
              
              const localHistory = localStorage.getItem('anonymous_test_history')
                ? JSON.parse(localStorage.getItem('anonymous_test_history'))
                : [];
              localHistory.unshift({
                id: 'local_' + Date.now(),
                test_name: 'Общий тест на IT-профессию',
                match_profession: recommendedProfession,
                match_percentage: data.matchPercentage,
                completed_at: new Date().toISOString()
              });
              localStorage.setItem('anonymous_test_history', JSON.stringify(localHistory));
            }

            setResult(data);
            setSubmitting(false);
          })
          .catch(err => {
            console.error('Submit API error, calculating locally:', err);
            // Фолбэк локального скоринга на клиенте
            const scores = { frontend: 0, backend: 0, qa: 0, android: 0 };
            nextAnswers.forEach(ans => {
              if (ans.optionId === 'a') scores.frontend += 5;
              if (ans.optionId === 'b') scores.backend += 5;
              if (ans.optionId === 'c') scores.qa += 5;
              if (ans.optionId === 'd') scores.android += 5;
              if (ans.optionId === 'e') {
                scores.frontend += 2;
                scores.backend += 2;
                scores.qa += 2;
                scores.android += 2;
              }
            });
            const sorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
            const topProfession = sorted[0];
            const professionAnswerMap = { frontend: 'a', backend: 'b', qa: 'c', android: 'd' };
            const targetOption = professionAnswerMap[topProfession];
            const matchCount = nextAnswers.filter(a => a.optionId === targetOption || a.optionId === 'e').length;
            const matchPercentage = Math.round((matchCount / nextAnswers.length) * 100);

            const localResult = {
              status: 'success',
              recommended: sorted,
              matchPercentage
            };
            
            localStorage.setItem('last_quiz_result', JSON.stringify(localResult));

            if (user && onUserUpdate) {
              const updatedUser = { ...user, current_profession: topProfession };
              onUserUpdate(updatedUser);
            } else if (!user) {
              localStorage.setItem('anonymous_profession', topProfession);
              
              const localHistory = localStorage.getItem('anonymous_test_history')
                ? JSON.parse(localStorage.getItem('anonymous_test_history'))
                : [];
              localHistory.unshift({
                id: 'local_' + Date.now(),
                test_name: 'Общий тест на IT-профессию',
                match_profession: topProfession,
                match_percentage: matchPercentage,
                completed_at: new Date().toISOString()
              });
              localStorage.setItem('anonymous_test_history', JSON.stringify(localHistory));
            }

            setResult(localResult);
            setSubmitting(false);
          });
      }, 2000); // 2 секунды премиальной симуляции
    }
  };

  // Кнопка назад
  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      localStorage.setItem('last_quiz_current_idx', prevIdx.toString());
    }
  };

  // Рендер 1: загрузка вопросов
  if (loading) {
    return (
      <div className="quiz-wrapper view active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ border: '4px solid var(--border-color)', borderTop: '4px solid var(--purple)', borderRadius: '50%', width: '48px', height: '48px', margin: '0 auto 20px' }}></div>
          <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Загрузка вопросов теста...</p>
        </div>
      </div>
    );
  }

  // Рендер 2: интро-экран
  if (!started) {
    return (
      <section className="quiz-wrapper view active">
        <div className="quiz-intro-card">
          <div className="quiz-intro-icon">
            <Compass size={40} />
          </div>
          <h2>Какая профессия в IT тебе подходит?</h2>
          <p>
            Пройди этот интерактивный тест из 10 вопросов, чтобы определить свои интересы, стиль мышления и подобрать идеальное IT-направление. 
          </p>
          
          <div className="quiz-features">
            <div className="quiz-feature-item">
              <Sparkles size={20} />
              <span>10 вопросов</span>
            </div>
            <div className="quiz-feature-item">
              <Star size={20} />
              <span>5 вариантов ответов</span>
            </div>
            <div className="quiz-feature-item">
              <Trophy size={20} />
              <span>Сравнение 4 треков</span>
            </div>
          </div>

          <button onClick={() => { localStorage.setItem('last_quiz_started', 'true'); setStarted(true); }} className="btn-primary">
            Начать тестирование <ArrowRight size={18} />
          </button>
        </div>
      </section>
    );
  }

  // Рендер 3: экран симуляции глубокого анализа
  if (submitting) {
    return (
      <section className="quiz-wrapper view active">
        <div className="quiz-analyzing-card">
          <div className="pulse-spinner-wrapper">
            <div className="pulse-spinner-ring"></div>
            <div className="pulse-spinner">
              <Compass size={36} className="spinner" />
            </div>
          </div>
          <div className="analyzing-text">Вычисляем результат</div>
          <div className="analyzing-subtext">{submitMessage}</div>
        </div>
      </section>
    );
  }

  // Рендер 4: экран результатов
  if (result) {
    const recommendedSlug = result.recommended[0];
    const topProfession = PROFESSION_META[recommendedSlug];
    const matchPercentage = result.matchPercentage;
    const IconComponent = topProfession?.icon || Code;

    // Рассчитаем баллы для всех направлений для красивого чарта на клиенте
    const calculatedScores = { frontend: 0, backend: 0, qa: 0, android: 0 };
    answers.forEach(ans => {
      if (ans.optionId === 'a') calculatedScores.frontend += 5;
      if (ans.optionId === 'b') calculatedScores.backend += 5;
      if (ans.optionId === 'c') calculatedScores.qa += 5;
      if (ans.optionId === 'd') calculatedScores.android += 5;
      if (ans.optionId === 'e') {
        calculatedScores.frontend += 2;
        calculatedScores.backend += 2;
        calculatedScores.qa += 2;
        calculatedScores.android += 2;
      }
    });

    const maxScore = 50; // 10 вопросов * 5 баллов максимум
    const breakdown = [
      { slug: 'frontend', title: 'Frontend Developer', pct: Math.round((calculatedScores.frontend / maxScore) * 100), color: '#3b82f6' },
      { slug: 'backend', title: 'Backend Developer', pct: Math.round((calculatedScores.backend / maxScore) * 100), color: '#8b5cf6' },
      { slug: 'android', title: 'Android Developer', pct: Math.round((calculatedScores.android / maxScore) * 100), color: '#ec4899' },
      { slug: 'qa', title: 'QA Engineer', pct: Math.round((calculatedScores.qa / maxScore) * 100), color: '#10b981' }
    ].sort((a, b) => b.pct - a.pct);

    return (
      <section className="quiz-wrapper view active" style={{ maxWidth: '1000px' }}>
        <div className="result-header-card">
          <div className="result-badge-circle" style={{ borderColor: topProfession.color }}>
            <span className="percent" style={{ color: topProfession.color }}>{matchPercentage}%</span>
            <span className="label">Совпадение</span>
          </div>
          <div className="result-info">
            <span className="result-info-badge" style={{ color: topProfession.color, borderColor: `${topProfession.color}30` }}>
              <IconComponent size={16} /> Твоя рекомендация
            </span>
            <h2 className="result-title">{topProfession.title}</h2>
            <p className="result-description">{topProfession.desc}</p>
          </div>
        </div>

        <div className="result-grid">
          <div className="breakdown-card">
            <h3>Профиль твоих склонностей</h3>
            <div className="breakdown-list">
              {breakdown.map((item, idx) => {
                const ItemIcon = PROFESSION_META[item.slug]?.icon || Code;
                return (
                  <div className="breakdown-item" key={idx}>
                    <div className="breakdown-info">
                      <div className="breakdown-name">
                        <ItemIcon size={18} style={{ color: item.color }} />
                        <span>{item.title}</span>
                      </div>
                      <span className="breakdown-percent">{item.pct}%</span>
                    </div>
                    <div className="breakdown-bar-bg">
                      <div 
                        className="breakdown-bar-fill" 
                        style={{ 
                          width: `${item.pct}%`, 
                          background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}bb 100%)` 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="result-actions-card">
            <div>
              <h3>Что делать дальше?</h3>
              <p className="action-intro" style={{ marginTop: '12px' }}>
                Мы подобрали индивидуальный план обучения, который поможет тебе освоить эту профессию с нуля.
              </p>
            </div>
            
            <div className="action-btn-group">
              <button 
                className="btn-primary" 
                onClick={() => navigate(`/roadmap/${topProfession.slug}`)}
              >
                Открыть дорожную карту <ArrowUpRight size={18} />
              </button>
              
              <button 
                className="btn-secondary-outline" 
                onClick={() => navigate('/dashboard')}
              >
                В личный кабинет
              </button>
              
              <button 
                className="btn-text" 
                onClick={handleReset}
                style={{ justifyContent: 'center', marginTop: '8px' }}
              >
                <RefreshCw size={16} /> Пройти тест заново
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Рендер 5: сам тест (прохождение вопросов)
  const activeQuestion = questions[currentIdx];
  const progressPercent = Math.round((currentIdx / questions.length) * 100);

  return (
    <section className="quiz-wrapper view active">
      {currentIdx > 0 && (
        <button className="quiz-back-btn" onClick={handlePrevQuestion}>
          <ArrowLeft size={16} /> Назад
        </button>
      )}

      <div className="quiz-card">
        <div className="quiz-header">
          <span className="badge-pink">Вопрос {currentIdx + 1} из {questions.length}</span>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="badge-pink" style={{ background: 'var(--lime-light)', color: 'var(--lime-hover)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
            {progressPercent}%
          </span>
        </div>

        <div className="question-text">
          {activeQuestion.question_text}
        </div>

        <div className="options-grid">
          {activeQuestion.options?.map((option) => (
            <button 
              key={option.id}
              className="option-btn"
              onClick={() => handleSelectOption(option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuizPage;

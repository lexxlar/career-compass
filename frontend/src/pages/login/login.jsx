import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import './login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка входа');
        return;
      }

      onLogin(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="view active">
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="auth-title">С возвращением!</h2>
          <p className="auth-subtitle">Войди, чтобы сохранить свой прогресс</p>

          {error && <div className="auth-error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">Электронная почта</label>
              <div className="form-input-wrapper">
                <input type="email" id="email-input" className="form-input"
                  placeholder="name@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                <Mail className="form-icon" size={20} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">Пароль</label>
              <div className="form-input-wrapper">
                <input type="password" id="password-input" className="form-input"
                  placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} />
                <Lock className="form-icon" size={20} />
              </div>
            </div>

            <button type="submit" className="auth-btn-submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="auth-footer">
            Нет аккаунта?
            <Link to="/register" className="auth-link">Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;

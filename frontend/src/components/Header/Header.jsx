
import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import './Header.css';

function Header({ user }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Анонимный пользователь — прошёл тест, но не зарегистрировался
  const hasAnonymousResult = !user && !!localStorage.getItem('anonymous_profession');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-inner">
        {/* Лого */}
        <div className="logo" onClick={() => { navigate('/'); closeMenu(); }}>
          <img src="/logo.png" alt="карьерный компас" className="logo-img" />
          <div className="logo-text">
            <h1>карьерный компас</h1>
            <span>твой путь в ИТ</span>
          </div>
        </div>

        {/* Десктоп меню */}
        <nav className="nav-links">
          <NavLink to="/professions" onClick={closeMenu}>Профессии</NavLink>
          <NavLink to="/quiz" onClick={closeMenu}>Тестирование</NavLink>
          <NavLink to="/chat" onClick={closeMenu}>ИИ-Ассистент</NavLink>
        </nav>

        {/* Кнопка входа на десктопе */}
        <div className="auth-btn">
          {user ? (
            <button className="btn-outline" onClick={() => navigate('/dashboard')}>
              {user.name}
            </button>
          ) : hasAnonymousResult ? (
            <button className="btn-outline" onClick={() => navigate('/dashboard')}>
              Мой результат
            </button>
          ) : (
            <button className="btn-outline" onClick={() => navigate('/login')}>
              Войти
            </button>
          )}
        </div>

        {/* Бургер */}
        <button className="burger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Мобильное меню */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <button className="close-menu-btn" onClick={closeMenu}>
            <X size={28} />
          </button>
        </div>

        <nav className="mobile-nav">
          <NavLink to="/professions" onClick={closeMenu}>Профессии</NavLink>
          <NavLink to="/quiz" onClick={closeMenu}>Тестирование</NavLink>
          <NavLink to="/chat" onClick={closeMenu}>ИИ-Ассистент</NavLink>
          
          <div className="mobile-auth">
            {user ? (
              <button className="btn-outline"
                      onClick={() => { navigate('/dashboard'); closeMenu(); }}>
                Личный кабинет
              </button>
            ) : hasAnonymousResult ? (
              <button className="btn-outline"
                      onClick={() => { navigate('/dashboard'); closeMenu(); }}>
                Мой результат
              </button>
            ) : (
              <button className="btn-outline"
                      onClick={() => { navigate('/login'); closeMenu(); }}>
                Войти
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
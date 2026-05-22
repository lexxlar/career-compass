import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'


// СОЗДАНИЕ ТЕСТОВОГО UUID ДЛЯ ПРОВЕРКИ РАБОТЫ
// if (!localStorage.getItem('userId')) {
//   localStorage.setItem('userId', '00000000-0000-0000-0000-000000000001');
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

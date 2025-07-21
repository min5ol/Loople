import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import 'uno.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  //StrictMode가 개발 모드에서 useEffect 두 번 실행하게 만듦 
  <StrictMode>
    <App />
  </StrictMode>,
)

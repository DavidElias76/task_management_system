import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {TasksProvider} from './context/TasksContext'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <TasksProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </TasksProvider>
  </BrowserRouter>
)

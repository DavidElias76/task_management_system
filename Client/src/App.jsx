import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import InProgress from './pages/InProgress'
import Completed from './pages/Completed'
import Reports from './pages/ReportsPage'
import Users from './pages/Users'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './components/auth/Login'
import Profile from './pages/Profile'
import { TasksProvider } from './context/TasksContext'
import TaskPanelProvider from './context/TaskPanelContext'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { ThemeProvider, ThemeContext } from './context/ThemeContext.jsx'
import { useContext } from 'react'

function AppLayout() {
  const { isDark } = useContext(ThemeContext);
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: isDark ? "#0a0b0f" : "#f0f2f5" }}>
          <Routes>
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
            <Route path='/dashboard' element={<ProtectedRoute routeKey="dashboard"><Dashboard /></ProtectedRoute>} />
            <Route path='/tasks' element={<ProtectedRoute routeKey="tasks"><Tasks /></ProtectedRoute>} />
            <Route path='/in-progress' element={<ProtectedRoute routeKey="in-progress"><InProgress /></ProtectedRoute>} />
            <Route path='/completed' element={<ProtectedRoute routeKey="completed"><TaskPanelProvider><Completed /></TaskPanelProvider></ProtectedRoute>} />
            <Route path='/reports' element={<ProtectedRoute routeKey="reports"><Reports /></ProtectedRoute>} />
            <Route path='/users' element={<ProtectedRoute routeKey="users"><Users /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path='/*'
        element={
          <ProtectedRoute>
            <TasksProvider>
              <AppLayout />
            </TasksProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>     
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App
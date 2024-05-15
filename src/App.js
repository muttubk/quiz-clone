import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginSignupPage from './pages/LoginSigup/LoginSignupPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import QuizInterfacePage from './pages/QuizInterface/QuizInterfacePage';
import QuestionAnalysis from './components/QuestionAnalysis/QuestionAnalysis';
import Analytics from './components/Analytics/Analytics';
import Error404 from './pages/Error404/Error404';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginSignupPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/analytics' element={<AnalyticsPage />} >
            <Route path='' element={<Analytics />} />
            <Route path=':id' element={<QuestionAnalysis />} />
          </Route>
          <Route path='/quiz-interface/:id' element={<QuizInterfacePage />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;

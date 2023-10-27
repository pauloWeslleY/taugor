import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import RoutesApp from './routes/router';
import AuthProvider from './contexts/authContext';
import EmployerProvider from './contexts/employerContext';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <BrowserRouter>
        {/* contexto do usuário logado */}
        <AuthProvider>
          {/* contexto de dados dos funcionários */}
          <EmployerProvider>
            <RoutesApp />
          </EmployerProvider>
        </AuthProvider>
      </BrowserRouter>
      {/* toastfy */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App;


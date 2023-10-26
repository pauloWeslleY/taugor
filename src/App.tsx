import { BrowserRouter } from 'react-router-dom'
import './App.css'
import RoutesApp from './routes/router'
import AuthProvider from './contexts/authContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <RoutesApp />
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

export default App

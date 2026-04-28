import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import './styles/admin-layout.css'
import { ToastContainer } from 'react-toastify'
import { persistor, store } from './redux/store/index.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'


console.log("MAIN OK");


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <>
        <App />
        <ToastContainer />
      </>
    </PersistGate>
  </Provider>
);
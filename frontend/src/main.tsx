import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)

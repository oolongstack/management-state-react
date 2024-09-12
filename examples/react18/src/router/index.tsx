import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Zustand from '../components/zustand'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/zustand',
    element: <Zustand />,
  },
])

export default router

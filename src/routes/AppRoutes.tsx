import { Routes, Route } from 'react-router-dom'
import Form from '../pages/Form'
import Success from '../pages/Success'
import Error from '../pages/Error'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Form />} />
      <Route path='/success' element={<Success />} />
      <Route path='/error' element={<Error />} />
    </Routes>
  )
}

 
import { jwtDecode } from 'jwt-decode'

const getUser = () => {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch (_err) {
    return null
  }
}

export default getUser
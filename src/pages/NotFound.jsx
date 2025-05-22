import { Link } from 'react-router-dom'
import { getIcon } from '../utils/iconUtils'

const HomeIcon = getIcon('home')
const FrownIcon = getIcon('frown')

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <FrownIcon className="w-12 h-12 text-red-500 dark:text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-lg text-surface-600 dark:text-surface-300 mb-8">
          Oops! The page you're looking for has floated away like a bubble!
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 primary-btn"
        >
          <HomeIcon className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
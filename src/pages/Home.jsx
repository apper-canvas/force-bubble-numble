import { useState } from 'react'
import MainFeature from '../components/MainFeature'
import { getIcon } from '../utils/iconUtils'

const BrainIcon = getIcon('brain')
const StarIcon = getIcon('star')
const AwardIcon = getIcon('award')

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false)
  
  return (
    <div className="min-h-screen flex flex-col">
      {!gameStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          <div className="max-w-3xl w-full mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gradient">
              BubbleNumble
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-surface-600 dark:text-surface-300">
              Learn odd and even numbers by popping bubbles!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <BrainIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Learn Math Concepts</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Understand odd and even numbers through fun, interactive gameplay
                </p>
              </div>
              
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <StarIcon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Earn Points</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Pop the right bubbles to collect points and beat your high score
                </p>
              </div>
              
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <AwardIcon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">Challenge Yourself</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Test your skills with timed challenges and different difficulty levels
                </p>
              </div>
            </div>
            
            <button 
              className="primary-btn text-lg"
              onClick={() => setGameStarted(true)}
            >
              Start Playing!
            </button>
          </div>
        </div>
      ) : (
        <MainFeature onBack={() => setGameStarted(false)} />
      )}
    </div>
  )
}

export default Home
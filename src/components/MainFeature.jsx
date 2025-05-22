import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getIcon } from '../utils/iconUtils'
import { toast } from 'react-toastify'

const HeartIcon = getIcon('heart')
const ClockIcon = getIcon('clock')
const ZapIcon = getIcon('zap')
const XIcon = getIcon('x')
const TrophyIcon = getIcon('trophy')
const RotateCcwIcon = getIcon('rotate-ccw')
const HomeIcon = getIcon('home')
const PauseIcon = getIcon('pause')
const PlayIcon = getIcon('play')
const InfoIcon = getIcon('info')

// Minimum vertical distance between bubbles
const MIN_VERTICAL_DISTANCE = 100;
// Minimum horizontal distance between bubbles
const MIN_HORIZONTAL_DISTANCE = 80;

const MainFeature = ({ onBack }) => {
  // Game state
  const [gameActive, setGameActive] = useState(false)
  const [paused, setPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeRemaining, setTimeRemaining] = useState(60) // 60 seconds
  const [gameMode, setGameMode] = useState('odd') // 'odd' or 'even'
  const [bubbles, setBubbles] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [difficulty, setDifficulty] = useState('medium') // easy, medium, hard
  const [showTutorial, setShowTutorial] = useState(false)
  
  // Game container ref
  const gameContainerRef = useRef(null)
  
  // Game settings based on difficulty
  const difficultySettings = {
    easy: {
      bubbleSpeed: 1.5,
      spawnRate: 1500,
      maxBubbles: 8,
    },
    medium: {
      bubbleSpeed: 2,
      spawnRate: 1200,
      maxBubbles: 12,
    },
    hard: {
      bubbleSpeed: 2.5,
      spawnRate: 900,
      maxBubbles: 15,
    }
  }
  
  // Game timer
  useEffect(() => {
    let timer;
    
    if (gameActive && !paused && !gameOver && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [gameActive, paused, gameOver, timeRemaining]);
  
  // Bubble spawner
  useEffect(() => {
    let spawnTimer;
    
    if (gameActive && !paused && !gameOver) {
      const settings = difficultySettings[difficulty];
      
      spawnTimer = setInterval(() => {
        if (bubbles.length < settings.maxBubbles) {
          spawnBubble();
        }
      }, settings.spawnRate);
    }
    
    return () => clearInterval(spawnTimer);
  }, [gameActive, paused, gameOver, bubbles, difficulty]);
  
  // Bubble movement
  useEffect(() => {
    let animationFrame;
    const settings = difficultySettings[difficulty];
    
    const moveBubbles = () => {
      if (gameActive && !paused && !gameOver) {
        setBubbles(prevBubbles => {
          return prevBubbles
            .map(bubble => {
              // Move bubble upward
              const newY = bubble.y - bubble.speed * settings.bubbleSpeed;
              
              // If bubble has gone off screen, remove it
              if (newY < -100) {
                return null;
              }
              
              return {
                ...bubble,
                y: newY
              };
            })
            .filter(bubble => bubble !== null);
        });
        
        animationFrame = requestAnimationFrame(moveBubbles);
      }
    };
    
    if (gameActive && !paused && !gameOver) {
      animationFrame = requestAnimationFrame(moveBubbles);
    }
    
    return () => cancelAnimationFrame(animationFrame);
  }, [gameActive, paused, gameOver, difficulty]);
  
  // Check if a new bubble position is safe (not overlapping other bubbles)
  const isSafePosition = (x, y, radius) => {
    return bubbles.every(bubble => {
      const dx = bubble.x - x;
      const dy = bubble.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance > (bubble.radius + radius + MIN_HORIZONTAL_DISTANCE);
    });
  };
  
  // Find a safe position for a new bubble
  const findSafePosition = (radius) => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return { x: 0, y: 0 };
    
    const { width } = gameContainer.getBoundingClientRect();
    const padding = radius + 10; // Add padding to avoid bubbles touching the edges
    
    let attempts = 0;
    let x, y;
    
    // Try to find a safe position, with a maximum number of attempts
    do {
      x = Math.random() * (width - 2 * padding) + padding;
      y = window.innerHeight + Math.random() * 100; // Start below the screen with some randomness
      attempts++;
    } while (!isSafePosition(x, y, radius) && attempts < 20);
    
    return { x, y };
  };
  
  // Spawn a new bubble
  const spawnBubble = () => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;
    
    // Random bubble properties
    const radius = Math.floor(Math.random() * 15) + 30; // Size between 30-45px
    const number = Math.floor(Math.random() * 100) + 1; // Number between 1-100
    const isEven = number % 2 === 0;
    
    // Random bubble color based on whether the number is odd or even
    // Use pastel colors that are visually distinct
    const colors = isEven 
      ? ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'] // Colors for even numbers
      : ['#C7CEEA', '#B5D8EB', '#9FB7E0', '#D3BBF2', '#A0C4FF']; // Colors for odd numbers
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Get a safe position for the bubble
    const { x, y } = findSafePosition(radius);
    
    // Calculate a random speed for the bubble
    const baseSpeed = 0.5;
    const randomSpeed = baseSpeed + Math.random() * 0.5;
    
    // Create new bubble
    const newBubble = {
      id: Date.now() + Math.random(),
      x,
      y,
      radius,
      number,
      isEven,
      color,
      speed: randomSpeed
    };
    
    // Add bubble to state
    setBubbles(prev => [...prev, newBubble]);
  };
  
  // Handle bubble click
  const handleBubblePop = (bubble) => {
    if (paused) return;
    
    // Check if the bubble matches the current game mode
    const isCorrect = 
      (gameMode === 'odd' && !bubble.isEven) || 
      (gameMode === 'even' && bubble.isEven);
    
    if (isCorrect) {
      // Correct pop
      setScore(prev => prev + 10);
      
      // Show animation and remove bubble
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
      
      // Show toast for points
      toast.success('+10 Points!', {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        icon: false
      });
    } else {
      // Incorrect pop
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          endGame();
        }
        return newLives;
      });
      
      // Show animation and remove bubble
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
      
      // Show toast for wrong choice
      toast.error('Oops! Wrong choice!', {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        icon: false
      });
    }
  };
  
  // Start the game
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setLives(3);
    setTimeRemaining(60);
    setBubbles([]);
    setGameOver(false);
    setPaused(false);
    
    // Randomly choose between odd and even mode
    setGameMode(Math.random() > 0.5 ? 'odd' : 'even');
  };
  
  // End the game
  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    setBubbles([]);
  };
  
  // Toggle pause
  const togglePause = () => {
    setPaused(prev => !prev);
  };
  
  // Return to home screen
  const handleBackToHome = () => {
    endGame();
    onBack();
  };
  
  // Replay the game
  const handleReplay = () => {
    startGame();
  };
  
  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Change difficulty
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Game Area */}
      <div 
        ref={gameContainerRef}
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-surface-900 dark:to-surface-800"
      >
        {/* Game header with controls */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm flex items-center justify-between">
          <button 
            onClick={handleBackToHome}
            className="p-2 rounded-full bg-white dark:bg-surface-700 shadow-md hover:shadow-lg"
            aria-label="Go back to home"
          >
            <HomeIcon className="w-5 h-5 text-surface-700 dark:text-surface-200" />
          </button>
          
          <div className="flex gap-4 items-center">
            {/* Lives indicator */}
            <div className="game-stats">
              <HeartIcon className="w-5 h-5 text-red-500" />
              <span>{lives}</span>
            </div>
            
            {/* Score indicator */}
            <div className="game-stats">
              <ZapIcon className="w-5 h-5 text-yellow-500" />
              <span>{score}</span>
            </div>
            
            {/* Timer */}
            <div className="game-stats">
              <ClockIcon className="w-5 h-5 text-blue-500" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          {/* Game controls */}
          <div className="flex gap-2">
            <button 
              onClick={() => setShowTutorial(true)}
              className="p-2 rounded-full bg-white dark:bg-surface-700 shadow-md hover:shadow-lg"
              aria-label="Show instructions"
            >
              <InfoIcon className="w-5 h-5 text-primary" />
            </button>
            
            {gameActive && (
              <button 
                onClick={togglePause}
                className="p-2 rounded-full bg-white dark:bg-surface-700 shadow-md hover:shadow-lg"
                aria-label={paused ? "Resume game" : "Pause game"}
              >
                {paused ? (
                  <PlayIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <PauseIcon className="w-5 h-5 text-yellow-500" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Current rule display */}
        {gameActive && !gameOver && (
          <div className="absolute top-20 left-0 right-0 z-10 flex justify-center">
            <div className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm py-2 px-6 rounded-full shadow-md">
              <h2 className="text-lg md:text-xl font-bold text-center">
                <span className="mr-2">Pop</span>
                <span 
                  className={`${
                    gameMode === 'odd' 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : 'text-blue-600 dark:text-blue-400'
                  } font-extrabold`}
                >
                  {gameMode === 'odd' ? 'ODD' : 'EVEN'} 
                </span> 
                <span className="ml-2">Numbers</span>
              </h2>
            </div>
          </div>
        )}
        
        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="bubble"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.radius * 2}px`,
              height: `${bubble.radius * 2}px`,
              backgroundColor: bubble.color,
              fontSize: `${bubble.radius * 0.8}px`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => handleBubblePop(bubble)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {bubble.number}
          </motion.div>
        ))}
        
        {/* Start screen */}
        {!gameActive && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 md:p-10 shadow-lg max-w-lg w-full mx-4">
              <h2 className="text-3xl font-bold mb-6 text-center text-gradient">
                BubbleNumble
              </h2>
              
              <p className="text-surface-600 dark:text-surface-300 mb-8 text-center">
                Pop the bubbles with odd or even numbers based on the current rule. 
                Be quick and be accurate!
              </p>
              
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-3">Select Difficulty:</h3>
                <div className="flex gap-4 justify-center">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleDifficultyChange(level)}
                      className={`px-4 py-2 rounded-lg capitalize font-medium transition-all ${
                        difficulty === level
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <button 
                  className="primary-btn"
                  onClick={startGame}
                >
                  Start Game
                </button>
                
                <button 
                  className="outline-btn"
                  onClick={() => setShowTutorial(true)}
                >
                  How to Play
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Game Over screen */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 md:p-10 shadow-lg max-w-lg w-full mx-4">
              <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <TrophyIcon className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-center">
                Game Over!
              </h2>
              
              <div className="mb-8 text-center">
                <p className="text-xl mb-2">
                  Your Score: <span className="font-bold text-primary">{score}</span>
                </p>
                <p className="text-surface-600 dark:text-surface-300">
                  Difficulty: <span className="capitalize">{difficulty}</span>
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <button 
                  className="primary-btn"
                  onClick={handleReplay}
                >
                  <RotateCcwIcon className="w-5 h-5 mr-2" />
                  Play Again
                </button>
                
                <button 
                  className="outline-btn"
                  onClick={handleBackToHome}
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Pause overlay */}
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-lg max-w-md w-full mx-4 text-center">
              <h2 className="text-2xl font-bold mb-6">Game Paused</h2>
              
              <div className="flex flex-col gap-4">
                <button 
                  className="primary-btn"
                  onClick={togglePause}
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Resume Game
                </button>
                
                <button 
                  className="outline-btn"
                  onClick={handleBackToHome}
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Exit Game
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Tutorial/How to play modal */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div 
              className="fixed inset-0 flex items-center justify-center z-30 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-xl max-w-lg w-full mx-4 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-bold mb-4">How to Play</h2>
                
                <div className="mb-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <p>Bubbles with numbers will float from the bottom to the top of the screen.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <p>The game will tell you whether to pop odd or even number bubbles.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <p>Tap the correct bubbles to earn 10 points. If you tap the wrong bubble, you lose a life.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <span className="font-bold">4</span>
                    </div>
                    <p>The game ends when time runs out or you lose all your lives.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl mb-6">
                  <h3 className="font-bold mb-2">Remember:</h3>
                  <ul className="list-disc list-inside space-y-1 text-surface-700 dark:text-surface-300">
                    <li>Odd numbers: 1, 3, 5, 7, 9, 11, ...</li>
                    <li>Even numbers: 2, 4, 6, 8, 10, 12, ...</li>
                  </ul>
                </div>
                
                <button 
                  className="primary-btn w-full"
                  onClick={() => setShowTutorial(false)}
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MainFeature
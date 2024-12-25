import React from 'react';
import Image from 'next/image';

const BADGE_LEVELS = [
  { name: 'sconce', points: 0, image: '/images/sconce.png' },
  { name: 'Torch Bearer', points: 100, image: '/images/torchbearer.png' },
  { name: 'Guiding Light', points: 250, image: '/images/guiding-light.png' },
  { name: 'Luminary', points: 500, image: '/images/luminary.png' },
  { name: 'Radiance', points: 1000, image: '/images/radiance.png' },
  { name: 'Inferno', points: 2000, image: '/images/inferno.png' }
];

const BadgeProgress = ({ points = 0 }) => {
    const getCurrentLevel = () => {
      for (let i = BADGE_LEVELS.length - 1; i >= 0; i--) {
        if (points >= BADGE_LEVELS[i].points) {
          return i;
        }
      }
      return 0;
    };
  
    const currentLevel = getCurrentLevel();
  const nextLevel =
    currentLevel < BADGE_LEVELS.length - 1 ? currentLevel + 1 : currentLevel;
  const progressToNext =
    currentLevel < BADGE_LEVELS.length - 1
      ? ((points - BADGE_LEVELS[currentLevel].points) /
          (BADGE_LEVELS[nextLevel].points - BADGE_LEVELS[currentLevel].points)) *
          (100 / (BADGE_LEVELS.length - 1)) +
        (currentLevel * (100 / (BADGE_LEVELS.length - 1)))
      : 100;
    
    return (
      <div className="w-full max-w-4xl px-8 py-6">
        <div className="relative mb-12">
          {/* Progress Bar */}
          
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-200 -translate-y-1/2">
            <div 
              className="h-full bg-[#38016A] transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
  
          {/* Badges */}
          <div className="relative flex justify-between">
            {BADGE_LEVELS.map((badge, index) => {
              const isUnlocked = index <= currentLevel;
              const badgeSize = 'w-28 h-28'
              const iconSize = isUnlocked ? 112 : 64; // Increased icon size for unlocked badges
              
              return (
                <div key={badge.name} className="flex flex-col items-center">
                  <div className={`relative ${badgeSize} mb-3 transition-all duration-300`}>
                    <div 
                      className={`${badgeSize} rounded-full flex items-center justify-center border-2 ${
                        isUnlocked 
                          ? 'border-[#38016A]' 
                          : 'border-gray-300 bg-gray-200'
                      } transition-all duration-300`}
                      style={isUnlocked ? {
                        background: 'linear-gradient(to bottom, #430075, #38016A, #2D0260)'
                      } : {}}
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <Image
                          src={badge.image}
                          alt={badge.name}
                          width={iconSize}
                          height={iconSize}
                          className={`${isUnlocked ? '' : 'opacity-40'} transition-all duration-300`}
                        />
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    isUnlocked ? 'thank-you-gradient' : 'text-gray-400'
                  }`}>
                    {badge.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {badge.points} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  export default BadgeProgress;
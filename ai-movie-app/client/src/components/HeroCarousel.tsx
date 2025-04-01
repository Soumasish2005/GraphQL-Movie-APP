import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface HeroCarouselProps {
  movies: Movie[];
}

export const HeroCarousel = ({ movies }: HeroCarouselProps) => {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (swiper) {
      swiper.on('slideChange', () => {
        setActiveIndex(swiper.activeIndex);
      });
    }
  }, [swiper]);

  return (
    <div className="relative -mt-4 h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full group">
      <Swiper
        onSwiper={setSwiper}
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s]"
                style={{ 
                  backgroundImage: `url(${movie.thumbnail})`,
                  backgroundPosition: 'center 20%',
                  transform: index === activeIndex ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center px-4 sm:container mx-auto sm:px-6 lg:px-8">
                <div className="max-w-xl sm:max-w-2xl">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 opacity-0 translate-y-8 animate-[fadeUp_1s_forwards]">
                    {movie.title}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 line-clamp-3 opacity-0 translate-y-8 animate-[fadeUp_1s_0.3s_forwards]">
                    {movie.description}
                  </p>
                  <div className="flex space-x-3 sm:space-x-4 opacity-0 translate-y-8 animate-[fadeUp_1s_0.6s_forwards]">
                    <Link 
                      to={`/movie/${movie.id}`} 
                      className="btn-primary text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Watch Now</span>
                    </Link>
                    <Link 
                      to={`/movie/${movie.id}`} 
                      className="btn-secondary text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
                    >
                      <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button 
        onClick={() => swiper?.slidePrev()}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full 
                   bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 
                   transition-opacity duration-300 hover:bg-black/50"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button 
        onClick={() => swiper?.slideNext()}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full 
                   bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 
                   transition-opacity duration-300 hover:bg-black/50"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-1.5 sm:space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => swiper?.slideTo(index)}
            className={`w-8 sm:w-12 h-1 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
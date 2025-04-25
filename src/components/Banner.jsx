import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
// import vectorLeft from '../assets/Vector 22.png';
// import vectorRight from '../assets/Vector 18.png';
// import vectortopRight from "../assets/Vector 21.png";
//  import leftImage from "../assets/canon-e3370-original-imafn2wyyxjjvzd6.jpeg";
// import rightImage from "../assets/White board Marker pen green copy.webp"
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerData = [
    {
      // title: "SALE",
      // subtitle: "Up To 70% Off",
      backgroundImg: "/assets/1.png"
    },
    {
      // title: "NEW ARRIVAL",
      // subtitle: "Fresh Collection 2025",
      backgroundImg: "/assets/2.png"
    },
    {
      // title: "SPECIAL OFFER",
      // subtitle: "Buy 1 Get 1 Free",
      backgroundImg: "/assets/3.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: { xs: '180px', sm: '250px', md: '320px' }, 
      overflow: 'hidden',
      mt: { xs: 2, sm: 3, md: 4 },
      mb: { xs: 2, sm: 3, md: 4 }
    }}>
      {bannerData.map((banner, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            backgroundImage: `url(${banner.backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            padding: { xs: '0.5rem', sm: '1rem', md: '1.5rem' },
            objectFit: 'cover'
          }}
        >
          <Box 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
              fontWeight: 'bold', 
              mb: { xs: 1, sm: 1.5, md: 2 },
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {banner.title}
          </Box>
          <Box 
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              maxWidth: { xs: '90%', sm: '80%', md: '70%' }
            }}
          >
            {banner.subtitle}
          </Box>
        </Box>
      ))}

      {/* Dots indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '1rem', sm: '1.5rem', md: '2rem' },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: { xs: '0.5rem', sm: '0.75rem', md: '1rem' },
          zIndex: 2
        }}
      >
        {bannerData.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: { xs: '8px', sm: '10px', md: '12px' },
              height: { xs: '8px', sm: '10px', md: '12px' },
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? '#ff4444' : 'white',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              boxShadow: '0 0 4px rgba(0,0,0,0.5)'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Banner;
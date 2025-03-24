import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import vectorLeft from '../assets/Vector 22.png';
import vectorRight from '../assets/Vector 18.png';
import vectortopRight from "../assets/Vector 21.png";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerData = [
    {
      title: "SALE",
      subtitle: "Up To 70% Off",
      gradient: "linear-gradient(90deg, #202020 0%, #2D2D2D 45%, #3A3A3A 100%)",
      leftImg: '../assets/canon-e3370-original-imafn2wyyxjjvzd6.jpeg.webp',
      rightImg: '../assets/White board Marker pen green copy.webp'
    },
    {
      title: "NEW ARRIVAL",
      subtitle: "Fresh Collection 2025",
      gradient: "linear-gradient(90deg, #1a237e 0%, #283593 45%, #3949ab 100%)",
      leftImg: '../assets/canon-e3370-original-imafn2wyyxjjvzd6.jpeg.webp',
      rightImg: '../assets/White board Marker pen green copy.webp'
    },
    {
      title: "SPECIAL OFFER",
      subtitle: "Buy 1 Get 1 Free",
      gradient: "linear-gradient(90deg, #1b5e20 0%, #2e7d32 45%, #388e3c 100%)",
      leftImg: '../assets/canon-e3370-original-imafn2wyyxjjvzd6.jpeg.webp',
      rightImg: '../assets/White board Marker pen green copy.webp'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
      {bannerData.map((banner, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: banner.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(${(index - currentSlide) * 100}%)`,
          }}
        >
          {/* Left Side Elements with Vector Images */}
          <Box
            sx={{
              position: 'absolute',
              left: '50px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              component="img"
              src={vectorRight}
              alt="Vector Design"
              sx={{
                position: 'absolute',
                top: '-80px',
                left: '-50px',
                width: '134.45px',
                height: '53.37px',
              }}
            />

            <Box
              component="img"
              src={vectortopRight}
              alt="Vector Design"
              sx={{
                position: 'absolute',
                top: '-100px',
                right: '-380px',
                width: '307.7px',
                height: '175.42px',
              }}
            />

            <img
              src={banner.leftImg}
              alt="Stationery Items"
              style={{
                maxWidth: '200px',
                height: 'auto',
                right: '-90px',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </Box>

          {/* Center Content */}
          <Box sx={{ textAlign: 'center', zIndex: 2 }}>
            <Box
              component="h1"
              sx={{
                fontSize: '4rem',
                margin: 0,
                fontWeight: 'bold',
                color: 'white',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {banner.title}
            </Box>
            <Box
              component="p"
              sx={{
                fontSize: '1.5rem',
                margin: '1rem 0',
                color: '#ff4444',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {banner.subtitle}
            </Box>
          </Box>

          {/* Right Side Elements with Vector Image */}
          <Box
            sx={{
              position: 'absolute',
              right: '50px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              component="img"
              src={vectorLeft}
              alt="Vector Design"
              sx={{
                position: 'absolute',
                left: '-150px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '152.41px',
                height: '270.31px',
                zIndex: 1,
              }}
            />

            <img
              src={banner.rightImg}
              alt="Stationery Items"
              style={{
                maxWidth: '200px',
                height: 'auto',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </Box>
        </Box>
      ))}
      
      {/* Dots indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 2,
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? '#ff4444' : 'white',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Banner;
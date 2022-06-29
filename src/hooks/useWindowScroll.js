import { useEffect, useState } from 'react';

const useWindowScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', scrollListener);

    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return {
    isScrolled
  };
};

export default useWindowScroll;

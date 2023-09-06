import { useEffect } from 'react';

const ScrollToTop = () => {
  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
    window.scrollTo(0, 0);
  }, []);

  return null;
};
export default ScrollToTop;

export const FadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, x: -400 }
};

export const SlideInAnimation = {
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.3
    }
  }),
  hidden: { opacity: 0, x: -40 }
};

export const SlideInAnimationY = {
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15
    }
  }),
  hidden: { opacity: 0, y: -40 }
};

import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { Box, BoxProps, Fade, Flex, forwardRef, IconButton, Spacer, useMediaQuery } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";

type Control = {
  icon: ReactElement<any, string | JSXElementConstructor<any>>,
  label: string,
  onClick: () => void,
}

type Props = BoxProps & {
  controls: (Control | undefined)[],
}

// the required distance between touchStart and touchEnd to be detected as a swipe
const minSwipeDistance = 10;
// the max vertical distance the user can travel before it's probably a scroll and not a delete
const maxVeticalDistance = 50;
const slideDistance = 50;

const SlideBox = forwardRef<Props, "div">((props, ref) => {
  const [isLargeScreen] = useMediaQuery(`(min-width: ${600 - slideDistance}px)`);
  const [showArrow, setShowArrow] = useState(true);
  const [distance, setDistance] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);

  useEffect(() => {
    const loop = setInterval(() => setShowArrow(show => !show), 800);
    const loopCleaner = setTimeout(() => {
      clearInterval(loop);
      setShowArrow(false);
    }, 5000);

    return () => {
      clearInterval(loop);
      clearInterval(loopCleaner);
    };
  }, []);

  // clean up the custom props added for touch events
  const boxProps = { ...props };
  delete (boxProps as any).controls;

  const handleTouchMove = (e: any) => {
    if (isLargeScreen) {
      return;
    }
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
    if (!touchStart || !touchEnd || !touchStartY || !touchEndY) {
      return false;
    }
    const distanceX = touchStart - touchEnd;
    const isLeftSwipe = distance >= slideDistance;
    const distanceY = Math.abs(touchStartY - touchEndY);

    // prevent scrolling from accidentally deleting things
    if (distanceY > maxVeticalDistance || distanceX < minSwipeDistance) {
      setDistance(0);
      return;
    }

    setDistance(Math.abs(distanceX) > slideDistance ? slideDistance : distanceX);

    if (isLeftSwipe) {
      return true;
    }

    return false;
  }

  const handleTouchEnd = () => {
    if (isLargeScreen) {
      return;
    }
    setDistance(dist => dist > slideDistance / 2 ? slideDistance : 0);
  }

  const handleTouchStart = (e: any) => {
    if (isLargeScreen) {
      return;
    }
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchEndY(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  }

  const resetSlide = () => {
    if (isLargeScreen) {
      return;
    }
    setDistance(0);
    setTouchStart(null);
    setTouchStartY(null);
    setTouchEnd(null);
    setTouchEndY(null);
  }

  const controlComponents = props.controls.map((control, i) => {
    if (control === undefined) {
      return <Spacer key={i} />;
    }

    const onClick = () => {
      control.onClick();
      resetSlide();
    }

    return <IconButton key={control.label} icon={control.icon} aria-label={control.label} onClick={onClick} />;
  });

  return (
    <Box
      {...boxProps}
      ref={ref}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {!isLargeScreen && <Fade in={showArrow}>
        <ArrowRightIcon pos="absolute" right={`${distance + 2}px`} top="50%" boxSize={3} color="brand.200" />
      </Fade>}
      <Box
        ml={!isLargeScreen ? `-${distance}px` : 0}
        width={!isLargeScreen ? `calc(100% + ${slideDistance}px)` : "100%"}
        pr={slideDistance}>
        {props.children}
      </Box>
      <Flex
        direction="column"
        gap="1"
        w={`${slideDistance}px`}
        position="absolute"
        top="0"
        right={!isLargeScreen ? `-${slideDistance - distance}px` : 0}
        p={1}
        bg="brand.200"
        height="calc(100%)"
      >
        {controlComponents}
      </Flex>
    </Box>
  );
});

export default SlideBox;
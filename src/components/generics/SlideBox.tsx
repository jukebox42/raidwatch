import { useState } from "react";
import { Box, BoxProps, Flex, forwardRef } from "@chakra-ui/react";

import { PADDING } from "context/theme";

type Props = BoxProps & {
  controls: React.ReactNode | React.ReactNode[],
}

// the required distance between touchStart and touchEnd to be detected as a swipe
const minSwipeDistance = 10;
// the max vertical distance the user can travel before it's probably a scroll and not a delete
const maxVeticalDistance = 50;
const slideDistance = 50;

const SlideBox = forwardRef<Props, "div">((props, ref) => {
  const [distance, setDistance] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);

   // clean up the custom props added for touch events
   const boxProps = { ...props };
   delete (boxProps as any).controls;

  const handleTouchMove = (e: any) => {
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

  const handleTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchEndY(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  }

  return (
    <Box
      {...boxProps}
      ref={ref}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <Box
        ml={`-${distance}px`}
        width={`calc(100% + ${slideDistance}px)`}
        pr={slideDistance}>
        {props.children}
      </Box>
      <Flex
        direction="column"
        gap="1"
        w={`${slideDistance}px`}
        position="absolute"
        top="0"
        right={`-${slideDistance - distance}px`}
        p={PADDING}
        bg="brand.200"
        height="calc(100%)"
      >
        {props.controls}
      </Flex>
    </Box>
  );
});

export default SlideBox;
import { Box, Skeleton, Stack } from "@chakra-ui/react";

import { PADDING } from "context/theme";

const SkelHeight = "50px";

const CharacterLoading = () => {
  return (
    <Stack mb={PADDING} spacing={PADDING}>
      <Skeleton height="60px" />
      <Stack direction="row" pr={PADDING} pl={PADDING} spacing={PADDING}>
        <Skeleton height={SkelHeight} width={SkelHeight}/>
        <Skeleton height={SkelHeight} width={SkelHeight} />
        <Skeleton height={SkelHeight} width={SkelHeight} />
        <Skeleton height={SkelHeight} width={SkelHeight} />
        <Skeleton height={SkelHeight} width={SkelHeight} />
        <Skeleton height={SkelHeight} width={SkelHeight} />
      </Stack>
      <Box pr={PADDING} pl="55px">
        <Skeleton height="20px" ml={PADDING} mr={PADDING} />
      </Box>
    </Stack>
  );
}

export default CharacterLoading;

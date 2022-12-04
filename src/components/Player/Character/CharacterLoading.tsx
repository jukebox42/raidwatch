import { Box, Skeleton, Stack } from "@chakra-ui/react";

const SkelHeight = "50px";

const CharacterLoading = () => {
  return (
    <Stack mb={1} spacing={1}>
      <Skeleton height="60px" />
      <Stack direction="row" pr={1} pl={1} spacing={1}>
        <Skeleton height={SkelHeight} width={SkelHeight}/>
        <Skeleton height={SkelHeight} width={SkelHeight} />
        <Skeleton height={SkelHeight} width={SkelHeight} />
        <Skeleton height={SkelHeight} width={SkelHeight} />
        <Skeleton height={SkelHeight} width={SkelHeight} />
        <Skeleton height={SkelHeight} width={SkelHeight} />
      </Stack>
      <Box pr={1} pl="55px">
        <Skeleton height="20px" ml={1} mr={1} />
      </Box>
    </Stack>
  );
}

export default CharacterLoading;

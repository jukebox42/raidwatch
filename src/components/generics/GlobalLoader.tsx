import { memo } from "react";
import { Box, Spinner } from "@chakra-ui/react"

interface Props {
  text: string;
}

const GlobalLoader = ({ text }: Props) => {
  return (
    <Box textAlign="center" alignSelf="center" w="100%">
      <Spinner
        size="xl"
        color="brand.500"
        emptyColor="brand.100"
        thickness="4px"
        speed="0.65s"/>
      <p>{text}</p>
    </Box>
  );
}

export default memo(GlobalLoader);

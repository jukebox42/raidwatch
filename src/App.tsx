import { ChakraProvider, ColorModeScript, Flex } from "@chakra-ui/react";

import Shell from "./components/Shell";
import theme from "context/theme";

const App = () => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Flex h="calc(100vh)" maxW="600px">
          <Shell />
        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;

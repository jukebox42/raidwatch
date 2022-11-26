import { ChakraProvider, ColorModeScript, Flex } from "@chakra-ui/react";

import "./index.less";
import Shell from "./components/Shell";
import theme from "context/theme"


const App = () => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Flex h="calc(100vh)">
          <Shell />
        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;

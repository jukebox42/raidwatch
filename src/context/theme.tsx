import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

// TODO: Break this up properly

const BORDER_RADIUS = "5px";
const BORDER_WIDTH = "1px";
export const PADDING = "5px";

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Exo 2', sans-serif",
    body: "'Lato', sans-serif",
  },
  styles: {
    global: {
      html: {
        overflowX: "hidden",
        overflowY: "hidden",
      },
      body: {
        bg: "brand.50",
        color: "brand.0",
        position: "relative",
        overflowX: "hidden",
        overflowY: "hidden",
      },
    },
  },
  colors: {
    brand: {
      0: "#FFFFFF", // font color
      25: "#212121", // blackest black
      50: "#0E131B", // app bg
      75: "#131924",
      100: "#192231", // header bg
      150: "#343f53", // lighter header bg (tooltips)
      200: "#494E6B", // border blue
      300: "#985E6D", // red
      350: "#F00", // socket error red
      375: "rgb(255, 167, 38)", // socket warning yellow
      400: "#98878F", // brown/grey
      500: "#6B896E" // green
    }
  },
  components: {
    Alert: {
      baseStyle: {
        container: {
          borderRadius: BORDER_RADIUS,
          mb: PADDING,
          mt: PADDING,
        }
      },
    },
    Tooltip: {
      baseStyle: {
        bg: "brand.25",
        "--popper-arrow-bg": "colors.brand.25",
        color: `brand.0`,
      },
    },
    Popover: {
      baseStyle: {
        borderColor: "brand.100",
      },
    },
    Player: {
      baseStyle: {
        borderWidth: BORDER_WIDTH,
        borderRadius: BORDER_RADIUS,
        overflow: "hidden",
        position: "relative",
      },
      variants: {
        "watch": {
          borderColor: "brand.400",
        },
        "ally": {
          borderColor: "brand.200",
        },
        "enemy": {
          borderColor: "brand.300",
        },
      }
    },
    Flex: {
      variants: {
        "charstats": {
          display: "flex",
          p: PADDING,
          mb: PADDING,
          bg: "brand.100",
        },
      },
    },
    Square: {
      baseStyle: {
        borderRadius: BORDER_RADIUS,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      variants: {
        "equipment": {
          w: "50px",
          h: "50px",
        },
        "detailEquipment": {
          bg: "brand.75",
          p: "5px",
          borderWidth: "1px",
          borderColor: "brand.200",
        },
        "emblem": {
          w: "50px",
          h: "50px",
          borderWidth: "2px",
        },
        "classIcon": {
          position: "absolute",
          w: "40px",
          h: "40px",
          top: "3px",
          left: "3px",
          pointerEvents: "none",
        },
        "socket": {
          w: "30px",
          h: "30px",
        },
        "socketWarning": {
          w: "30px",
          h: "30px",
          borderWidth: "1px",
          borderColor: "brand.375",
        },
        "socketError": {
          w: "30px",
          h: "30px",
          borderWidth: "1px",
          borderColor: "brand.350",
        },
        "socketSpacer": {
          w: "10px",
          h: "30px",
        }
      },
    },
  }
});

export default theme;
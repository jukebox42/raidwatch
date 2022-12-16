import { Alert, AlertIcon, Box, Button, Flex, Icon, Spacer } from "@chakra-ui/react"
import { QuestionIcon } from "@chakra-ui/icons"
import { FaTwitter } from "react-icons/fa";
import { TwitterTimelineEmbed } from "react-twitter-embed"

import { BUNGIE_HELP_TWITTER_URL, BUNGIE_HELP_URL } from "utils/constants";

const GlobalError = () => {
  const handleBungieHelp = () => window.open(BUNGIE_HELP_URL, "_blank");
  const handleBungieTwitter = () => window.open(BUNGIE_HELP_TWITTER_URL, "_blank");

  return (
    <Box pr={5} pl={5} pt={5}>
      <Alert status="error" variant="left-accent">
        <AlertIcon /> The Bungie API is down for maintenence.
      </Alert>
      <Flex mt={1} mb={5}>
        <Button leftIcon={<Icon as={FaTwitter} />} onClick={handleBungieTwitter}>@BungieHelp</Button>
        <Spacer />
        <Button leftIcon={<QuestionIcon />} onClick={handleBungieHelp}>help.bungie.net</Button>
      </Flex>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="BungieHelp"
        options={{ height: 450 }}
        theme="dark"
        noHeader
        noFooter
        noBorders
      />
    </Box>
  )
}

export default GlobalError;

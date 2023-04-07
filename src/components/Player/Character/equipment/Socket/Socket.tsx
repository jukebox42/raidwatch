import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Image,
  Square,
  Text,
  useStyleConfig
} from "@chakra-ui/react";

import { itemUrl } from "utils/common";
import { AppSocketType } from "core";
import { parseDescription } from "../../utils/common";
import { getAlertDetails } from "./utils";
import TooltipImage from "components/generics/TooltipImage";

interface Props {
  socket: AppSocketType;
  full?: boolean;
}

const Socket = ({ socket, full }: Props) => {
  const {cross, alertType, alertText, socketStyle } = getAlertDetails(socket.isUsable, socket.unusableReason);
  const styles = useStyleConfig("Square", { variant: socketStyle });

  const fullImage = (
    <Square __css={styles}>
      <Image src={itemUrl(socket.definition.displayProperties)} />
    </Square>
  );

  const definition = socket.perksDefinition.length > 0 ? 
    socket.perksDefinition.map(p => parseDescription(p.displayProperties.description)) :
    parseDescription(socket.definition.displayProperties.description);

  const name = socket.definition.displayProperties.name;

  // TODO: masterwork on weapons is not right
  if (!full) {
    const text = (
      <>
        {alertType !== "success" && <Alert status={alertType} variant="left-accent"><AlertIcon />{alertText}</Alert>}
        <Heading size="md">{name}</Heading>
        <Text color="gray.400">{socket.definition.itemTypeDisplayName}</Text>
        {definition}
        {socket.definition.tooltipNotifications.length > 0 &&
          <Text>{socket.definition.tooltipNotifications[0].displayString}</Text>}
      </>
    );
    return (
      <TooltipImage
        src={itemUrl(socket.definition.displayProperties)}
        tooltipText={text}
        __css={styles}
        _after={cross}
      >
        {socket.energyCostDefinition && <Image
          src={itemUrl(socket.energyCostDefinition?.displayProperties)}
          pos="absolute"
          pointerEvents="none"
        />}
      </TooltipImage>
    );
  }

  return (
    <Flex gap="2">
      {fullImage}
      <Box flex="1">
        <Text as="strong">{name}</Text>
        {name !== "Empty Catalyst Socket" && definition}
      </Box>
    </Flex>
  );
}

export const SocketSpacer = () => {
  const styles = useStyleConfig("Square", { variant: "socketSpacer" });
  return (<Square __css={styles}></Square>);
}

export default Socket;

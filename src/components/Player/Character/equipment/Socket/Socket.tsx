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
import { DamageType } from "bungie-api-ts/destiny2";

import { itemUrl } from "utils/common";
import { AppSocketType } from "core";
import { parseDescription } from "../../utils/common";
import { getAlertDetails } from "./utils";
import TooltipImage from "components/generics/TooltipImage";
import { isHarmonic } from "core/analyze/mods";

interface Props {
  socket: AppSocketType;
  subclassDamageType?: DamageType;
  full?: boolean;
}

const getHarmonicIndex = (type: DamageType) => {
  switch (type) {
    case DamageType.Arc:
      return 0;
    case DamageType.Thermal:
      return 1;
    case DamageType.Stasis:
      return 2;
    case DamageType.Strand:
      return 3;
    case DamageType.Void:
      return 4;
  }
  return 0;
}

const Socket = ({ socket, subclassDamageType, full }: Props) => {
  const {cross, alertType, alertText, socketStyle } = getAlertDetails(socket.isUsable, socket.unusableReason);
  const styles = useStyleConfig("Square", { variant: socketStyle });

  const fullImage = (
    <Square __css={styles}>
      <Image src={itemUrl(socket.definition.displayProperties)} />
    </Square>
  );

  // TODO: This is a mess but harmonic mods dont have useful data to filter this better.
  let definitions = socket.perksDefinition.length ? socket.perksDefinition.map(p => p.displayProperties.description) : [];
  if (subclassDamageType !== undefined && isHarmonic(socket.socket.plugHash as number)) {
    definitions = [definitions[getHarmonicIndex(subclassDamageType)]];
  }

  const definition = definitions.length > 0 ? 
    definitions.map(p => parseDescription(p)) :
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

import { Heading, useStyleConfig } from "@chakra-ui/react";
import { DestinyActivityModifierDefinition, } from "bungie-api-ts/destiny2";

import { assetUrl } from "utils/common";
import { parseDescription } from "../utils/common";
import TooltipImage from "components/generics/TooltipImage";


type Props = {
  definition: DestinyActivityModifierDefinition,
}

const Modifier = ({ definition }: Props) => {
  const styles = useStyleConfig("Square", { variant: "socket" });

  const iconUrl = definition.displayProperties.icon;

  const text = (
    <>
      <Heading size="md">{definition.displayProperties.name}</Heading>
      {parseDescription(definition.displayProperties.description)}
    </>
  );

  return (
    <TooltipImage
      src={assetUrl(iconUrl)}
      tooltipText={text}
      __css={styles}
    />
  );
}

export default Modifier;

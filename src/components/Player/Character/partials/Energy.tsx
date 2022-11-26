import { useState } from "react";
import { Alert, AlertIcon, Heading, Image, Square, Tooltip, useStyleConfig } from "@chakra-ui/react";
import { DestinyDamageTypeDefinition, DestinyEnergyTypeDefinition } from "bungie-api-ts/destiny2";

import { assetUrl } from "utils/common";
import { parseDescription } from "../utils/common";


interface Props {
  definition: DestinyDamageTypeDefinition | DestinyEnergyTypeDefinition;
  missing?: boolean;
}

const Energy = ({ definition, missing = false }: Props) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const styles = useStyleConfig("Square", { variant: "socket" });

  const iconUrl = missing ? definition.transparentIconPath : definition.displayProperties.icon;

  const image = (
    <Square __css={styles}>
      <Image
        src={assetUrl(iconUrl)}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        onClick={() => {console.log(definition);setIsTooltipOpen(true)}}
        opacity={missing ? ".25" : "1"}
      />
    </Square>
  );

  const text = (
    <>
      {missing && <Alert status="warning" variant="left-accent"><AlertIcon />Damage type not present.</Alert>}
      <Heading size="md">{definition.displayProperties.name}</Heading>
      {parseDescription(definition.displayProperties.description)}
    </>
  );
  return (
    <Tooltip hasArrow label={text} isOpen={isTooltipOpen}>{image}</Tooltip>
  );
}

export default Energy;

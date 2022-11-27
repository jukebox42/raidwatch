import { Alert, AlertIcon, Heading, useStyleConfig } from "@chakra-ui/react";
import { DestinyDamageTypeDefinition, DestinyEnergyTypeDefinition } from "bungie-api-ts/destiny2";

import { assetUrl } from "utils/common";
import { parseDescription } from "../utils/common";
import TooltipImage from "components/generics/TooltipImage";


interface Props {
  definition: DestinyDamageTypeDefinition | DestinyEnergyTypeDefinition;
  missing?: boolean;
}

const Energy = ({ definition, missing = false }: Props) => {
  const styles = useStyleConfig("Square", { variant: "socket" });

  const iconUrl = missing ? definition.transparentIconPath : definition.displayProperties.icon;

  const text = (
    <>
      {missing && <Alert status="warning" variant="left-accent"><AlertIcon />Damage type not present.</Alert>}
      <Heading size="md">{definition.displayProperties.name}</Heading>
      {parseDescription(definition.displayProperties.description)}
    </>
  );

  return (
    <TooltipImage
      src={assetUrl(iconUrl)}
      tooltipText={text}
      missing={missing}
      __css={styles}
    />
  );
}

export default Energy;

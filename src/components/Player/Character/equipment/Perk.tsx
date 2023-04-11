import {
  Heading,
  Text,
  useStyleConfig
} from "@chakra-ui/react";

import { itemUrl } from "utils/common";
import { AppArtifactType } from "core";
import { parseDescription } from "../utils/common";
import TooltipImage from "components/generics/TooltipImage";

interface Props {
  perk: AppArtifactType;
}

const Perk = ({ perk }: Props) => {
  // console.log("Perk", data.definition.displayProperties.name, data);
  const styles = useStyleConfig("Square", { variant: "socket" });
  const definition = perk.perkDefinitions.map(p => parseDescription(p.displayProperties.description));
  const name = perk.definition.displayProperties.name;

  const text = (
    <>
      <Heading size="md">{name}</Heading>
      <Text color="gray.400">{perk.definition.itemTypeDisplayName}</Text>
      {definition}
      {perk.definition.tooltipNotifications.length > 0 &&
        <Text>{perk.definition.tooltipNotifications[0].displayString}</Text>}
    </>
  );
  return (
    <TooltipImage
      src={itemUrl(perk.definition.displayProperties)}
      tooltipText={text}
      __css={styles}
    >
    </TooltipImage>
  );
}

export default Perk;

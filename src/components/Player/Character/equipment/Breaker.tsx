import { useState } from "react";
import { Alert, AlertIcon, Heading, Image, Square, Text, Tooltip, useStyleConfig } from "@chakra-ui/react";
import { DestinyBreakerTypeDefinition } from "bungie-api-ts/destiny2";

import { itemUrl } from "utils/common";
import { parseDescription } from "../utils/common";


interface Props {
  definition: DestinyBreakerTypeDefinition;
  sourceNames: string[];
}

const Breaker = ({ definition, sourceNames }: Props) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const styles = useStyleConfig("Square", { variant: "socket" });

  const missing = sourceNames.length < 1;

  const image = (
    <Square __css={styles}>
      <Image
        src={itemUrl(definition.displayProperties)}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        onClick={() => {console.log(definition);setIsTooltipOpen(true)}}
        opacity={missing ? ".25" : "1"}
      />
    </Square>
  );

  const text = (
    <>
      {missing && <Alert status="warning" variant="left-accent"><AlertIcon />Breaker type not present.</Alert>}
      <Heading size="md">{definition.displayProperties.name}</Heading>
      <Text color="gray.400"><Text as="strong">Sources:</Text> {sourceNames.length ? sourceNames.join(", ") : "None"}</Text>
      {parseDescription(definition.displayProperties.description)}
    </>
  );
  return (
    <Tooltip hasArrow label={text} isOpen={isTooltipOpen}>{image}</Tooltip>
  );
}

export default Breaker;

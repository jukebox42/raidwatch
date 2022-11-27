import { Alert, AlertIcon, Heading, Text, useStyleConfig } from "@chakra-ui/react";
import { DestinyBreakerTypeDefinition } from "bungie-api-ts/destiny2";

import { itemUrl } from "utils/common";
import { parseDescription } from "../utils/common";
import TooltipImage from "components/generics/TooltipImage";


interface Props {
  definition: DestinyBreakerTypeDefinition;
  sourceNames: string[];
}

const Breaker = ({ definition, sourceNames }: Props) => {
  const styles = useStyleConfig("Square", { variant: "socket" });

  const missing = sourceNames.length < 1;

  const text = (
    <>
      {missing && <Alert status="warning" variant="left-accent"><AlertIcon />Breaker type not present.</Alert>}
      <Heading size="md">{definition.displayProperties.name}</Heading>
      <Text color="gray.400"><Text as="strong">Sources:</Text> {sourceNames.length ? sourceNames.join(", ") : "None"}</Text>
      {parseDescription(definition.displayProperties.description)}
    </>
  );

  return (
    <TooltipImage
      src={itemUrl(definition.displayProperties)}
      tooltipText={text}
      missing={missing}
      __css={styles}
    />
  );
}

export default Breaker;

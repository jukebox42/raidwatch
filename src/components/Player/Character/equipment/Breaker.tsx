import { Alert, AlertIcon, Heading, Text, useStyleConfig } from "@chakra-ui/react";
import { DestinyBreakerTypeDefinition, DestinyInventoryItemDefinition, DestinyTraitDefinition } from "bungie-api-ts/destiny2";

import { itemUrl } from "utils/common";
import { parseDescription } from "../utils/common";
import TooltipImage from "components/generics/TooltipImage";
import { socketNotch } from "context/theme";
import { BreakerSource, BreakerSourceType } from "core/analyze/championBreakers";
import { useStore } from "hooks/useStore";
import { useEffect, useState } from "react";


type Props = {
  definition: DestinyBreakerTypeDefinition,
  sources: BreakerSource[],
  isRequired?: boolean,
}

const Breaker = ({ definition, sources, isRequired = false }: Props) => {
  const [sourceDefinitions, setSourceDefinitions] = useState<(DestinyTraitDefinition | DestinyInventoryItemDefinition)[]>([]);
  const getDefinitions = useStore(state => state.getDefinitions);
  const styles = useStyleConfig("Square", { variant: "socket" });

  const missing = sources.length < 1;

  useEffect(() => {
    const getDefinition = (source: BreakerSource) => {
      if (source.sourceType === BreakerSourceType.Trait) {
        return getDefinitions<DestinyTraitDefinition>("DestinyTraitDefinition", source.sourceHash)[0];
      }
      return getDefinitions<DestinyInventoryItemDefinition>("DestinyInventoryItemDefinition", source.sourceHash)[0];
    }
    setSourceDefinitions(sources.map(s => getDefinition(s)));
  }, [getDefinitions, sources]);

  const displaySources = (definitions: (DestinyTraitDefinition | DestinyInventoryItemDefinition)[]) => {
    return definitions
            .map(d => d.displayProperties.name)
            .filter((n, p, d) => d.indexOf(n) === p)
            .map(n => {
              const count = definitions.filter(f => f.displayProperties.name === n).length;
              if (count > 1) {
                return `${n} x${count}`;
              }
              return n;
            });
  };

  const text = (
    <>
      {missing && <Alert status="warning" variant="left-accent"><AlertIcon />Breaker type not present.</Alert>}
      <Heading size="md">{definition.displayProperties.name}</Heading>
      <Text color="gray.400">
        <Text as="strong">Sources:</Text> {sourceDefinitions.length ? displaySources(sourceDefinitions).join(", ") : "None"}
      </Text>
      {parseDescription(definition.displayProperties.description)}
    </>
  );

  return (
    <TooltipImage
      src={itemUrl(definition.displayProperties)}
      tooltipText={text}
      missing={missing}
      __css={styles}
      _after={isRequired ? socketNotch : undefined}
    />
  );
}

export default Breaker;

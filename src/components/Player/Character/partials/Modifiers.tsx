import { HStack } from "@chakra-ui/react";
import { DestinyActivityModifierDefinition} from "bungie-api-ts/destiny2";
import Modifier from "./Modifier";



type Props = {
  definitions: DestinyActivityModifierDefinition[]
}

const Modifiers = ({ definitions }: Props) => {
  return (
    <HStack gap={1}>
      {definitions
        .filter(m => m.displayInActivitySelection && m.displayProperties.name)
        .map(d => <Modifier key={d.hash} definition={d} />)}
    </HStack>
  )
}

export default Modifiers;

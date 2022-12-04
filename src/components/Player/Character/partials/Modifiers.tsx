import { Wrap, WrapItem } from "@chakra-ui/react";
import { DestinyActivityModifierDefinition} from "bungie-api-ts/destiny2";
import Modifier from "./Modifier";



type Props = {
  definitions: DestinyActivityModifierDefinition[],
}

const Modifiers = ({ definitions }: Props) => {
  return (
    <Wrap spacing={1} mt={1}>
      {definitions
        .filter(m => m.displayInActivitySelection)
        .map(d => <WrapItem key={d.hash}><Modifier definition={d} /></WrapItem>)}
    </Wrap>
  )
}

export default Modifiers;

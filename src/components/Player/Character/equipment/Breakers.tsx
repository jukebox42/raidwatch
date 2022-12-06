import { Wrap, WrapItem } from "@chakra-ui/react";

import { AppBreakerType } from "core/itemTypes";
import Breaker from "./Breaker";
import { DestinyBreakerType } from "bungie-api-ts/destiny2";

type Props = {
  breakers?: AppBreakerType[],
  requiredBreakerEnumValues?: DestinyBreakerType[],
}

const Breakers = ({ breakers, requiredBreakerEnumValues = [] }: Props) => {
  // console.log("Breakers", breakers);
  return (
    <Wrap spacing={1}>
      {breakers && breakers.map(b => {
        const isRequired = !!requiredBreakerEnumValues.find(r => r === b.definition.enumValue);
        return (
          <WrapItem key={b.hash}>
            <Breaker definition={b.definition} sourceNames={b.sourceNames} isRequired={isRequired} />
          </WrapItem>
        )
      })}
    </Wrap>
  );
}

export default Breakers;

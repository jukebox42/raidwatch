import { HStack } from "@chakra-ui/react";
import { DestinyDamageTypeDefinition, DestinyEnergyTypeDefinition } from "bungie-api-ts/destiny2";
import Energy from "./Energy";



type Props = {
  energyDefinitions: DestinyDamageTypeDefinition[] | DestinyEnergyTypeDefinition[],
  energyEnumValues: number[],
  requiredEnumValues?: number[],
}

const Energies = ({ energyDefinitions, energyEnumValues, requiredEnumValues = [] }: Props) => {
  const energyDisplay = energyDefinitions.map(e => {
    const missing = !energyEnumValues.includes(e.enumValue);
    const isRequired = !!requiredEnumValues.find(r => r === e.enumValue);
    return <Energy key={e.enumValue} definition={e} missing={missing} isRequired={isRequired} />
  });

  return (
    <HStack gap={1}>
      {energyDisplay}
    </HStack>
  )
}

export default Energies;

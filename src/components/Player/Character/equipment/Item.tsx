import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spacer,
  Square,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import { DestinyDisplayPropertiesDefinition } from "bungie-api-ts/destiny2";

import { assetUrl, itemUrl } from "utils/common";

interface Props {
  icon: DestinyDisplayPropertiesDefinition;
  energyIcon?: DestinyDisplayPropertiesDefinition;
  name: string;
  type?: string
  level?: number;
  showEnergyIcon?: boolean;
  watermarkIcon?: string;
  children: React.ReactNode | React.ReactNode[];
  detailMode?: boolean;
}

const Item = ({ icon, name, type, level, energyIcon, children, watermarkIcon, detailMode = false, showEnergyIcon = true }: Props) => {
  const styles = useStyleConfig("Square", { variant: "equipment" });
  const detailStyles = useStyleConfig("Square", { variant: "detailEquipment" });

  const itemImage = (
    <Square __css={styles}>
      <Image src={itemUrl(icon)} />
      {watermarkIcon && <Square position="absolute" top="0" left="0">
        <Image src={assetUrl(watermarkIcon)} />
      </Square>}
      {energyIcon && showEnergyIcon && <Square size="15px" position="absolute" bottom="2px" right="2px">
        <Image src={itemUrl(energyIcon)} />
      </Square>}
    </Square>
  );

  if (detailMode) {
    return (
      <Flex direction="row" gap="1" alignItems="top" __css={detailStyles}>
        {itemImage}
        <Box flex="1" flexDir="column">
          <Heading size="md" mb={1}>{name}</Heading>
          <Text color="gray.400">{level !== undefined && `${level} - `}{type}</Text>
          {children}
        </Box>
      </Flex>
    );
  }

  return (
    <Popover>
      <PopoverTrigger>
        {itemImage}
      </PopoverTrigger>
      <Portal>
        <PopoverContent bg="brand.100">
          <PopoverHeader bg="brand.150">
            <HStack spacing={1}>
              {energyIcon && <Center w="20px">
                <Image src={itemUrl(energyIcon)} />
              </Center>}
              <Center>
                <Heading size="md">{name}</Heading>
              </Center>
              <Spacer />
              <Center>
                {level ? level : ""}
              </Center>
            </HStack>
            {type && <Box mt={1} mb={-1} color="gray.400">{type}</Box>}
          </PopoverHeader>
          <PopoverArrow />
          <PopoverBody>
            {children}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

export default Item;

import { Flex, Image, Square } from "@chakra-ui/react";

import { itemUrl } from "utils/common";
import { AppStatType } from "core";

interface Props {
  stat: AppStatType;
}

const LightStat = ({ stat }: Props) => {

  return (
    <Flex alignItems="center">
      <Square size="20px">
        <Image src={itemUrl(stat.definition.displayProperties)} />
      </Square>
      {stat.value}
    </Flex>
  );
}

export default LightStat;

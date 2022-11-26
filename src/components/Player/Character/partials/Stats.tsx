import { Flex, Image, Square } from "@chakra-ui/react";

import { itemUrl } from "utils/common";
import { AppStatType } from "core/stats";

interface Props {
  stats: AppStatType[];
}

const Stats = ({ stats }: Props) => {
  return (
    <Flex gap="2">
      {stats.map(stat => {
        return (
          <Flex key={stat.definition.hash} alignItems="center">
            <Square size="20px">
              <Image src={itemUrl(stat.definition.displayProperties)} />
            </Square>
            {stat.value}
          </Flex>
        );
      })}
    </Flex>
  );
}

export default Stats;

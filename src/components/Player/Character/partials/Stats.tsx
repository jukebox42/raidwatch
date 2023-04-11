import { Flex, Image, Square } from "@chakra-ui/react";

import { itemUrl } from "utils/common";
import { AppStatType } from "core/stats";

interface Props {
  stats: AppStatType[];
}

const Stats = ({ stats }: Props) => {
  const orderedStats = stats.sort((a, b) => a.definition.index < b.definition.index ? -1 : 1);
  return (
    <Flex gap="2">
      {orderedStats.map(stat => {
        console.log(stat.definition.displayProperties.name, stat);
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

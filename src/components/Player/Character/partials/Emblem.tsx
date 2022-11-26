import { Image, Square, useStyleConfig } from "@chakra-ui/react";
import { ReactComponent as HunterSymbol } from "assets/hunter_emblem.svg";
import { ReactComponent as WarlockSymbol } from "assets/warlock_emblem.svg";
import { ReactComponent as TitanSymbol } from "assets/titan_emblem.svg";

import { assetUrl } from "utils/common";
import { DestinyClass } from "bungie-api-ts/destiny2";

interface Props {
  path: string;
  onClick?: () => void;
  isOnline: boolean;
  classType?: DestinyClass;
}

/**
 * Returns the svg of the characters class
 */
 export const getClassSvg = (classType: DestinyClass) => {
  if (classType === DestinyClass.Hunter) {
    return <HunterSymbol />;
  }
  if (classType === DestinyClass.Titan) {
    return <TitanSymbol />;
  }
  return <WarlockSymbol />;
}

const Emblem = ({ path, onClick, isOnline, classType }: Props) => {
  const styles = useStyleConfig("Square", { variant: "emblem" });
  const classStyles = useStyleConfig("Square", { variant: "classIcon" });
  return (
    <Square __css={styles} borderColor={isOnline ? "green" : "yellow"}>
      {classType !== undefined && <Square __css={classStyles}>
        {getClassSvg(classType)}
      </Square>}
      <Image src={assetUrl(path)} onClick={onClick} />
    </Square>
  );
}

export default Emblem;

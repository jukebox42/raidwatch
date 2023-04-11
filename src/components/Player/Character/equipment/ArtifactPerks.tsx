import { Divider, Heading, Square, useStyleConfig, Wrap, WrapItem } from "@chakra-ui/react";

import { AppArtifactType } from "core/itemTypes";
import Perk from "./Perk";

type Props = {
  perks: AppArtifactType[],
}

const ArtifactPerks = ({ perks }: Props) => {
  const styles = useStyleConfig("Square", { variant: "detailEquipment" });
  return (
    <>
      <Divider mt={2} mb={2} />
      <Heading size="md" mb={1}>Artifact Perks</Heading>
      <Square __css={styles}>
        <Wrap spacing={1}>
          {perks.map((perk, index) =>
            <WrapItem key={`${perk.item.itemHash}-${index}`}><Perk perk={perk} /></WrapItem>
          )}
        </Wrap>
      </Square>
    </>
  );
}

export default ArtifactPerks;

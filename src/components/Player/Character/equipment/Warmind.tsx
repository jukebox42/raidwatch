import { Alert, AlertIcon, Heading, Text, useStyleConfig } from "@chakra-ui/react";

import { assetUrl } from "utils/common";
import TooltipImage from "components/generics/TooltipImage";

const iconUrl = "/common/destiny2_content/icons/4670104c2de268d2ca220183c1653dd7.png";

type Props = {
  missing: boolean,
}

const Warmind = ({ missing }: Props) => {
  const styles = useStyleConfig("Square", { variant: "socket" });

  const text = (
    <>
      {missing && <Alert status="warning" variant="left-accent">
        <AlertIcon />No players can generate warmind cells.
      </Alert>}
      <Heading size="md">Warmind Cells</Heading>
      <Text mb={1}>
        Equip mods to generate warmind cells.
      </Text>
    </>
  );

  return (
    <TooltipImage
      src={assetUrl(iconUrl)}
      tooltipText={text}
      missing={missing}
      __css={styles}
    />
  );
}

export default Warmind;

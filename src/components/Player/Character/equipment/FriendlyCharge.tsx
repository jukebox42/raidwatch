import { Alert, AlertIcon, Heading, Text, useStyleConfig } from "@chakra-ui/react";

import { assetUrl } from "utils/common";
import TooltipImage from "components/generics/TooltipImage";

const iconUrl = "/common/destiny2_content/icons/ce29f32ba5ef8758d1b5f3cfad0944a6.png";

type Props = {
  missing: boolean,
}

const FriendlyCharge = ({ missing }: Props) => {
  const styles = useStyleConfig("Square", { variant: "socket" });

  const text = (
    <>
      {missing && <Alert status="warning" variant="left-accent">
        <AlertIcon />No players found running Powerful Friends or Radiant Light.
      </Alert>}
      <Heading size="md">Charged With Light</Heading>
      <Text mb={1}>
        Charge allies with light by running <strong>Powerful Friends</strong> or <strong>Radiant Light</strong>.
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

export default FriendlyCharge;

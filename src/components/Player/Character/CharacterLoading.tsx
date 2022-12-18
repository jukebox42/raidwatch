import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Skeleton, Stack } from "@chakra-ui/react";
import SlideBox from "components/generics/SlideBox";
import { useStore } from "hooks/useStore";
import { PlayerData } from "types/player";

const SkelHeight = "50px";

type Props = {
  player: PlayerData;
}

const CharacterLoading = ({ player }: Props) => {
  const removePlayer = useStore(state => state.removePlayer);
  const handleDelete = () => removePlayer(player.membershipId);

  return (
    <SlideBox controls={[
      { icon: <DeleteIcon />, label: "Delete", onClick: handleDelete },
    ]}>
      <Stack mb={1} spacing={1}>
        <Skeleton height="60px" />
        <Stack direction="row" pr={1} pl={1} spacing={1}>
          <Skeleton height={SkelHeight} width={SkelHeight}/>
          <Skeleton height={SkelHeight} width={SkelHeight} />
          <Skeleton height={SkelHeight} width={SkelHeight} />
          <Skeleton height={SkelHeight} width={SkelHeight} />
          <Skeleton height={SkelHeight} width={SkelHeight} />
        </Stack>
        <Box pr={1} pl="55px">
          <Skeleton height="20px" ml={1} mr={1} />
        </Box>
      </Stack>
    </SlideBox>
  );
}

export default CharacterLoading;

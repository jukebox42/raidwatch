import { Box, Flex, Heading, Spacer, useDisclosure, useStyleConfig } from "@chakra-ui/react";
import { CloseIcon, LockIcon, UnlockIcon, ViewIcon } from "@chakra-ui/icons";

import { Emblem, Stats, LightStat } from "./partials";
import { Items, Sockets } from "./equipment";
import CharacterLoading from "./CharacterLoading";
import { PlayerData } from "types/player";
import { useStore } from "hooks/useStore";
import SlideBox from "components/generics/SlideBox";
import CharacterModal from "./CharacterModal";
import { lastOnlineCharacterId } from "./utils/common";


type Props = {
  player: PlayerData;
}

const CharacterDisplay = ({ player }: Props) => {
  const setPlayerCharacterId = useStore(store => store.setPlayerCharacterId);
  const removePlayer = useStore(state => state.removePlayer);
  const setActivePlayer = useStore(state => state.setActivePlayer);
  const isActivePlayer = useStore(state => state.activePlayer) === player.membershipId;
  const charStatStyles = useStyleConfig("Flex", { variant: "charstats" });
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!player.profile?.characters.data) {
    console.log("CharacterDisplay", player.membershipId, player);
    return (<>Failed to load player profile.</>);
  }

  console.log("CharacterDisplay", player.membershipId, player.characterData);
  if (!player.characterData) {
    return (<CharacterLoading />);
  }

  const handleDelete = () => removePlayer(player.membershipId);
  const handleToggleActive = () => setActivePlayer(isActivePlayer ? "" : player.membershipId);
  const handleBadgeClick = () => setPlayerCharacterId(player.membershipId, "");

  const activeIcon = isActivePlayer ? <LockIcon /> : <UnlockIcon />;

  const userInfo = player.profile.profile.data?.userInfo;
  const data = player.characterData;
  const sockets = Object.keys(data.importantSockets).flatMap(s => data.importantSockets[s]);
  const isLastOnline = lastOnlineCharacterId(player.profile.characters.data) === player.characterData.characterId;
  const name = <>{userInfo?.bungieGlobalDisplayName}#{userInfo?.bungieGlobalDisplayNameCode}</>;

  return (
    <SlideBox controls={[
      { icon: <CloseIcon />, label: "Remove", onClick: handleDelete },
      undefined,
      { icon: <ViewIcon />, label: "Detailed View", onClick: onOpen },
      { icon: activeIcon, label: "Set Active Player", onClick: handleToggleActive },
    ]}>
      <CharacterModal
        isOpen={isOpen}
        onClose={onClose}
        name={name}
        data={data}
        breakers={data.analyzeData.championBreakers}
        isLastOnline={isLastOnline}
        />
      <Flex direction="row" gap="1" __css={charStatStyles}>
        <Emblem
          path={data.emblem.path}
          onClick={handleBadgeClick}
          isOnline={isLastOnline}
          classType={data.classType}
        />
        <Box flex="1" flexDir="column">
          <Flex mb={1} direction="row">
            <Heading size="md" noOfLines={1}>{name}</Heading>
            <Spacer />
            <LightStat stat={data.lightStat} />
          </Flex>
          <Stats stats={data.stats} />
        </Box>
      </Flex>
      <Flex m={1} flex="1" gap="1" direction="column">
        <Items weapons={data.weapons} armors={data.armors} subclass={data.subclass} detailMode={false} />
        <Box pl="55px">
          <Sockets sockets={sockets} breakers={data.analyzeData.championBreakers} />
        </Box>
      </Flex>
    </SlideBox>
  );
}

export default CharacterDisplay;

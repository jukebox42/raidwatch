import { Box, Flex, Heading, Spacer, useDisclosure, useStyleConfig } from "@chakra-ui/react";
import { DeleteIcon, LockIcon, UnlockIcon, ViewIcon } from "@chakra-ui/icons";

import { Emblem, Stats, LightStat } from "./partials";
import { Items, Sockets } from "./equipment";
import { PlayerData } from "types/player";
import { useStore } from "hooks/useStore";
import SlideBox from "components/generics/SlideBox";
import CharacterModal from "./CharacterModal";
import { lastOnlineCharacterId } from "./utils/common";
import { AppCharacterType } from "core";

type Props = {
  player: PlayerData;
}

const CharacterDisplay = ({ player }: Props) => {
  const setPlayerCharacterId = useStore(state => state.setPlayerCharacterId);
  const settings = useStore(state => state.settings);
  const removePlayer = useStore(state => state.removePlayer);
  const setActivePlayer = useStore(state => state.setActivePlayer);
  const isActivePlayer = useStore(state => state.activePlayer) === player.membershipId;
  const charStatStyles = useStyleConfig("Flex", { variant: "charstats" });
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!player.profile?.characters.data) {
    console.log("CharacterDisplay", player.membershipId, player);
    return (<>Failed to load player profile.</>);
  }

  const handleDelete = () => removePlayer(player.membershipId);
  const handleToggleActive = () => setActivePlayer(isActivePlayer ? "" : player.membershipId);
  const handleBadgeClick = () => setPlayerCharacterId(player.membershipId, "");

  const activeIcon = isActivePlayer ? <LockIcon /> : <UnlockIcon />;

  const userInfo = player.profile.profile.data?.userInfo;
  const data = player.characterData as AppCharacterType;
  const sockets = [
    ...(settings.hideAmmoFinderMods ? [] : data.importantSockets.ammoFinderSockets),
    ...(settings.hideAmmoFinderMods ? [] : data.importantSockets.ammoScoutSockets),
    ...(data.importantSockets.weaponDamageTypeSockets),
    ...(settings.hideAmmoScavengerMods ? [] : data.importantSockets.ammoScavengerSockets),
    ...(settings.hideChampionMods ? [] : data.importantSockets.championSockets),
    ...(settings.hideChargedWithLightMods ? [] : data.importantSockets.chargedWithLightChargerSockets),
    ...(settings.hideChargedWithLightMods ? [] : data.importantSockets.chargedWithLightSpenderSockets),
    ...(settings.hideWellMods ? [] : data.importantSockets.wellGeneratorSockets),
    ...(settings.hideWellMods ? [] : data.importantSockets.wellSpenderSockets),
    ...(settings.hideRaidMods ? [] : data.importantSockets.raidSockets),
    ...(data.importantSockets.artifactSockets),
  ];
  const isLastOnline = lastOnlineCharacterId(player.profile.characters.data) === data.characterId;
  const name = <>{userInfo?.bungieGlobalDisplayName}#{userInfo?.bungieGlobalDisplayNameCode}</>;

  return (
    <SlideBox controls={[
      { icon: <DeleteIcon />, label: "Delete", onClick: handleDelete },
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
        {!settings.hideAnalyzeMods && <Box pl="55px">
          <Sockets sockets={sockets} breakers={settings.hideChampionMods ? [] : data.analyzeData.championBreakers} />
        </Box>}
      </Flex>
    </SlideBox>
  );
}

export default CharacterDisplay;

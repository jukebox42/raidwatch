import { useState, useMemo, useEffect } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { AsyncSelect, SingleValue, chakraComponents  } from "chakra-react-select";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";
import throttle from "lodash/throttle";
import { ServerResponse } from "bungie-api-ts/destiny2";
import { searchByGlobalNamePost, UserSearchResponse, UserSearchResponseDetail } from "bungie-api-ts/user";

import { $http } from "bungie/api";
import db from "store/db";
import { useStore } from "hooks/useStore";

const FindPlayer = () => {
  const players = useStore(store => store.players);
  const addPlayer = useStore(store => store.addPlayer);

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<UserSearchResponseDetail[]>([]);
  const [searching, setSearching] = useState(false);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      return;
    }
    init();
  }, [loading]);

  const search = useMemo(() =>
    throttle(
      (text: string, callback: (value: ServerResponse<UserSearchResponse>) => void) => {
        const params = { page: 0 };
        const body = { displayNamePrefix: text };
        searchByGlobalNamePost($http, params, body).then(callback);
      },
      1000
    ), []);

  const init = async () => {
    await db.init();
    const cachedProfiles = await db.AppSearches.toArray();
    setProfiles(cachedProfiles);
    setLoading(false);
  }

  const filterOption = (option: FilterOptionOption<UserSearchResponseDetail>, inputValue: string): boolean => {
    const key = option.data.destinyMemberships[0].membershipId;
    if (!key) {
      return false;
    }
    const inPlayers = players.findIndex(p => p.membershipId === key);
    const inProfiles = profiles.findIndex(p => {
      if (p.destinyMemberships.length === 0 || !p.destinyMemberships[0].membershipId) {
        return true; // hide profiles that don't have a membership id. They are dead accounts
      }
      return p.destinyMemberships[0].membershipId === key;
    });

    return inPlayers === -1 || inProfiles === -1;
  }

  const loadOptions = (inputValue: string, callback: (results: UserSearchResponseDetail[]) => void) => {
    setSearching(true);
    search(inputValue, (value) => {
      // remove any users without membership ids. they are dead accounts.
      const results = value.Response.searchResults.filter(r => !!r.destinyMemberships.length);
      callback(results);
      setSearching(false);
    });
  }

  const addProfileToDb = (profile: UserSearchResponseDetail) => {
    const membershipId = profile.destinyMemberships[0].membershipId;
    if (profiles.find(p => p.destinyMemberships[0].membershipId === membershipId)) {
      return;
    }
    db.AppSearches.put(profile, membershipId);
    setProfiles(prevProfiles => [...prevProfiles, profile])
  }
  
  const onSelect = (playerData: SingleValue<UserSearchResponseDetail>) => {
    if (!playerData) {
      return;
    }
    setSelecting(true); // TODO this does nothing
    const membership = playerData.destinyMemberships[0]
    addPlayer(membership.membershipId, membership.membershipType)
    setSelecting(false);
    addProfileToDb(playerData);
  }

  const components = {
    DropdownIndicator: (props: any) => (
      <chakraComponents.DropdownIndicator {...props}>
        <SearchIcon />
      </chakraComponents.DropdownIndicator>
    ),
  };

  return (
    <AsyncSelect
        isLoading={searching}
        isDisabled={selecting || players.length >= 6}
        placeholder="Search for a player..."
        blurInputOnSelect
        closeMenuOnSelect
        captureMenuScroll
        controlShouldRenderValue={false}
        defaultOptions={profiles}
        getOptionLabel={o => `${o.bungieGlobalDisplayName}#${o.bungieGlobalDisplayNameCode}`}
        getOptionValue={o => o.destinyMemberships[0].membershipId}
        loadOptions={loadOptions}
        filterOption={filterOption}
        menuPlacement="top"
        onChange={onSelect}
        components={components}
      />
  );
}

export default FindPlayer;

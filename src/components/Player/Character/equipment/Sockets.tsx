import { Wrap, WrapItem } from "@chakra-ui/react";

import { AppSocketType } from "core";
import Socket, { SocketSpacer } from "./Socket/Socket";
import { AppBreakerType } from "core/itemTypes";
import Breaker from "./Breaker";
import { DestinyBreakerType } from "bungie-api-ts/destiny2";
import { useStore } from "hooks/useStore";

type Props = {
  sockets: (AppSocketType | undefined)[],
  breakers?: AppBreakerType[],
  requiredBreakerEnumValues?: DestinyBreakerType[],
}

const Sockets = ({ sockets, breakers, requiredBreakerEnumValues = [] }: Props) => {
  const settings = useStore(state => state.settings);
  const full = settings.expandedCharacterModalData;
  return (
    <Wrap spacing={1}>
      {breakers && breakers.map(b => {
        const isRequired = !!requiredBreakerEnumValues.find(r => r === b.definition.enumValue);
        return (
          <WrapItem key={b.hash}>
            <Breaker definition={b.definition} sourceNames={b.sourceNames} isRequired={isRequired} />
          </WrapItem>
        )
      })}
      {sockets.map((socket, index) =>
        socket === undefined ?
          <WrapItem key="space"><SocketSpacer /></WrapItem> :
          <WrapItem key={`${socket.socket.plugHash}-${index}`}><Socket socket={socket} full={full} /></WrapItem>
      )}
    </Wrap>
  );
}

export default Sockets;

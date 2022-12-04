import { Wrap, WrapItem } from "@chakra-ui/react";

import { AppSocketType } from "core";
import Socket, { SocketSpacer } from "./Socket/Socket";
import { AppBreakerType } from "core/itemTypes";
import Breaker from "./Breaker";

type Props = {
  sockets: (AppSocketType | undefined)[],
  breakers?: AppBreakerType[],
}

const Sockets = ({ sockets, breakers }: Props) => {
  return (
    <Wrap spacing={1}>
      {breakers && breakers.map(b =>
        <WrapItem key={b.hash}>
          <Breaker definition={b.definition} sourceNames={b.sourceNames} />
        </WrapItem>
      )}
      {sockets.map((socket, index) =>
        socket === undefined ?
          <WrapItem key="space"><SocketSpacer /></WrapItem> :
          <WrapItem key={`${socket.socket.plugHash}-${index}`}><Socket socket={socket} /></WrapItem>
      )}
    </Wrap>
  );
}

export default Sockets;

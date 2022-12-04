import { Stack } from "@chakra-ui/react";

import { AppSubclassType } from "core";
import Item from "./Item";
import Socket from "./Socket/Socket";
import Sockets from "./Sockets";

interface Props {
  subclass: AppSubclassType;
  detailMode?: boolean;
}

const Subclass = ({ subclass, detailMode = false }: Props) => {
  // console.log("Subclass", subclass);

  // Handle if the subclass doesnt have abilities yet.
  let subclassDetails = (<>Character hasn't logged in since subclass was upgraded to 3.0.</>);
  if (subclass.subclassSockets) {
    const classAbilities = [
      subclass.subclassSockets.ability,
      subclass.subclassSockets.movement,
      subclass.subclassSockets.melee,
      subclass.subclassSockets.grenade,
    ]
    const fragspects = [
      ...subclass.subclassSockets.aspects,
      undefined,
      ...subclass.subclassSockets.fragments,
    ]
    subclassDetails = (
      <Stack spacing={1}>
        <Socket socket={subclass.subclassSockets.super} full />
        <Sockets sockets={classAbilities} />
        <Sockets sockets={fragspects} />
      </Stack>
    );
  }

  let name = subclass.definition.displayProperties.name;
  if (subclass.subclassSockets) {
    name += ` - ${subclass.subclassSockets.super.definition.displayProperties.name}`;
  }

  return (
    <Item
      icon={subclass.definition.displayProperties}
      name={name}
      type="Subclass"
      detailMode={detailMode}
    >
      {subclassDetails}
    </Item>
  );
}

export default Subclass;

import { ReactNode } from "react";
import { Image, Square, SystemStyleObject, Tooltip, useDisclosure } from "@chakra-ui/react";

type Props = {
  src: string,
  tooltipText: ReactNode,
  children?: ReactNode | ReactNode[],
  missing?: boolean,
  __css?: SystemStyleObject,
  _after?: SystemStyleObject,
}

const TooltipImage = ({ src, tooltipText, children, missing = false, __css, _after }: Props) => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  return (
    <Tooltip hasArrow label={tooltipText} isOpen={isOpen}>
      <Square __css={__css} _after={_after}>
        {children}
        <Image
            src={src}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            onClick={onToggle}
            opacity={missing ? ".25" : "1"}
          />
        </Square>
    </Tooltip>
  );
}

export default TooltipImage;
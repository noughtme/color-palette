import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Button,
  Code,
} from "@chakra-ui/react";

interface Props {
  palette: any;
  isOpen: boolean;
  onClose: () => void;
  handleCopy: () => void;
}

export const ColorModal: React.FC<Props> = ({
  palette,
  isOpen,
  onClose,
  handleCopy,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bgColor="rgba(0, 0, 0, 0.2)" />
      <ModalContent>
        <ModalHeader>{palette.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" alignContent="center">
            <Code p={4}>
              <pre>{JSON.stringify(palette.palette, null, 2)}</pre>
            </Code>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => handleCopy()}>
            Copy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

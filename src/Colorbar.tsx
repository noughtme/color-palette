import React, { useEffect, useState } from "react";
import { Box, Flex, useDisclosure, useToast, Collapse } from "@chakra-ui/react";
import { hexToLightness } from "./utils";
import { getPalette } from "./getPalette";
import { Toolbar } from "./Toolbar";
import { ColorModal } from "./ColorModal";
import { ControlPanel } from "./ControlPanel";

interface Props {
  color: any;
  handleDelete: (color: string) => void;
}

export const Colorbar: React.FC<Props> = ({ color, handleDelete }) => {
  const [palette, setPalette] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isControlsOpen, onToggle } = useDisclosure();
  const toast = useToast();

  const colorPicker = (hex: any) =>
    hexToLightness(hex) < 50 ? "white" : "black";

  useEffect(() => {
    setPalette(getPalette(color));
  }, [color]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(palette.palette, null, 2));
    toast({
      duration: 2000,
      position: "bottom",
      render: () => (
        <Box
          color="white"
          bgColor="blue.500"
          fontWeight="semibold"
          borderRadius="md"
          p={2}
        >
          Copied!
        </Box>
      ),
    });
  };

  const handleView = () => {
    onOpen();
  };

  const handleDeleteAndNotify = (color: string) => {
    handleDelete(color);
    toast({
      duration: 2000,
      position: "bottom",
      render: () => (
        <Box
          color="white"
          bgColor="blue.500"
          fontWeight="semibold"
          borderRadius="md"
          p={2}
        >
          Deleted.
        </Box>
      ),
    });
  };

  const handleUpdate = (newPalette: any) => {
    setPalette(newPalette);
  };

  if (palette) {
    return (
      <Box>
        <Flex my={4} fontWeight="semibold">
          <Box w="90px" h="90px" fontSize="sm" my={2}>
            <Flex
              h="100%"
              direction="column"
              justifyContent="center"
              style={{ textTransform: "capitalize" }}
            >
              {palette.name.replace(/-/g, " ")}
            </Flex>
          </Box>
          {palette.values.map((value: string, index: any) => (
            <Box
              key={index}
              color={colorPicker(value)}
              bgColor={value}
              w="90px"
              h="90px"
              fontSize="xs"
            >
              <Flex
                height="100%"
                direction="column"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Box mb={2}>{value}</Box>
              </Flex>
            </Box>
          ))}
          <Toolbar
            color={color}
            handleCopy={handleCopy}
            handleView={handleView}
            handleEdit={onToggle}
            handleDelete={handleDeleteAndNotify}
          />
          <ColorModal
            palette={palette}
            isOpen={isOpen}
            onClose={onClose}
            handleCopy={handleCopy}
          />
        </Flex>
        <Collapse in={isControlsOpen} animateOpacity>
          <ControlPanel palette={palette} handleUpdate={handleUpdate} />
        </Collapse>
      </Box>
    );
  } else return null;
};

import React from "react";
import { Flex, Box, useColorMode } from "@chakra-ui/react";
import { CopyIcon, ViewIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface Props {
  color: any;
  handleCopy: () => void;
  handleView: () => void;
  handleEdit: () => void;
  handleDelete: (color: string) => void;
}

export const Toolbar: React.FC<Props> = ({
  color,
  handleCopy,
  handleView,
  handleEdit,
  handleDelete,
}) => {
  const { colorMode } = useColorMode();
  const textColor = { light: "black", dark: "white" };
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="left"
      w="60px"
      ml={2}
    >
      <Box
        my={1}
        fontSize="xs"
        fontWeight="medium"
        onClick={() => handleCopy()}
        color="gray.500"
        _hover={{
          cursor: "pointer",
          color: textColor[colorMode],
          transform: "translateX(3px)",
          transition: "transform 0.1s linear",
        }}
      >
        <CopyIcon /> Copy
      </Box>

      <Box
        my={1}
        fontSize="xs"
        fontWeight="medium"
        onClick={() => handleView()}
        color="gray.500"
        _hover={{
          cursor: "pointer",
          color: textColor[colorMode],
          transform: "translateX(3px)",
          transition: "transform 0.1s linear",
        }}
      >
        <ViewIcon /> View
      </Box>
      <Box
        my={1}
        fontSize="xs"
        fontWeight="medium"
        onClick={() => handleEdit()}
        color="gray.500"
        _hover={{
          cursor: "pointer",
          color: textColor[colorMode],
          transform: "translateX(3px)",
          transition: "transform 0.1s linear",
        }}
      >
        <EditIcon /> Edit
      </Box>
      <Box
        my={1}
        fontSize="xs"
        fontWeight="medium"
        onClick={() => handleDelete(color)}
        color="gray.500"
        _hover={{
          cursor: "pointer",
          color: textColor[colorMode],
          transform: "translateX(3px)",
          transition: "transform 0.1s linear",
        }}
      >
        <DeleteIcon /> Delete
      </Box>
    </Flex>
  );
};

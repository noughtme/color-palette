import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorMode,
  Link,
} from "@chakra-ui/react";
import { Icon, IconProps } from "@chakra-ui/icons";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Colorbar } from "./Colorbar";

function App() {
  const { colorMode } = useColorMode();
  const bgColor = { light: "white", dark: "gray.800" };
  const [inputValue, setInputValue] = useState<string>("");
  const [previewColor, setPreviewColor] = useState(bgColor[colorMode]);
  const [currentColor, setCurrentColor] = useState<string | undefined>();
  const [colors, setColors] = useState<any>([]);

  useEffect(() => {
    const bgColor = { light: "white", dark: "gray.800" };
    if (previewColor === "white" || previewColor === "gray.800")
      setPreviewColor(bgColor[colorMode]);
  }, [colorMode, previewColor]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9A-F]/gi, "").slice(0, 6);
    setInputValue(`#${value}`);
    if (value.length === 3 || value.length === 6) {
      setCurrentColor(`#${value}`);
      setPreviewColor(`#${value}`);
    }
  };

  const handleAddColor = () => {
    if (currentColor) {
      const hex = currentColor.replace(/#/g, "");
      setColors((prev: any) => [hex, ...prev]);
      setInputValue("");
      const bgColor = { light: "white", dark: "gray.800" };
      setPreviewColor(bgColor[colorMode]);
    }
  };

  const handleDelete = (color: any) => {
    setColors((prev: any) => [...prev.filter((entry: any) => entry !== color)]);
  };

  const CircleIcon: React.FC<IconProps> = (props) => (
    <Icon viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        stroke="gray"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  );

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <ColorModeSwitcher m={3} />
      </Flex>
      <Flex direction="column" alignItems="center" justifyContent="center">
        <Flex alignItems="center">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<CircleIcon boxSize={6} color={previewColor} />}
            />
            <Input
              placeholder="Color hex code"
              maxLength={7}
              spellCheck="false"
              autoCapitalize="false"
              autoComplete="false"
              autoCorrect="false"
              value={inputValue}
              onChange={handleInput}
              onFocus={() => {
                if (!inputValue) setInputValue("#");
              }}
              onBlur={() => {
                if (inputValue === "#") {
                  setInputValue("");
                  setPreviewColor(previewColor);
                  const bgColor = { light: "white", dark: "gray.800" };
                  setPreviewColor(bgColor[colorMode]);
                }
              }}
            />
          </InputGroup>
          <Button ml={2} onClick={handleAddColor}>
            Add
          </Button>
        </Flex>
        <Box mt={10}>
          {colors.length === 0 ? (
            <Box>
              <Box>
                Check out the{" "}
                <Link
                  color="blue.500"
                  style={{ textDecoration: "underline" }}
                  href="https://github.com/noughtme/color-palette/tree/master/src"
                >
                  code
                </Link>
              </Box>
            </Box>
          ) : null}
          {colors.length > 0
            ? colors.map((color: any) => (
                <Colorbar
                  key={color}
                  color={color}
                  handleDelete={handleDelete}
                />
              ))
            : null}
        </Box>
      </Flex>
    </Box>
  );
}

export default App;

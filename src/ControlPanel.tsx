import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import * as d3 from "d3";
import { hslToHex, hsvToHex, hexArrToPalette } from "./utils";

interface Props {
  palette: any;
  handleUpdate: (palette: any) => void;
}

export const ControlPanel: React.FC<Props> = ({ palette, handleUpdate }) => {
  const svgRef = useRef(null);
  const [viewportWidth, viewportHeight] = [1100, 600];
  const svgWidth = viewportWidth * 0.8;
  const svgHeight = viewportHeight * 0.7;
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.100", dark: "gray.700" };

  const [colorspace, setColorspace] = useState<any>("hsl");

  const data = useRef([
    palette[colorspace].map((value: any, index: any) => [
      index,
      value[0] / 3.6,
    ]),
    palette[colorspace].map((value: any, index: any) => [index, value[1]]),
    palette[colorspace].map((value: any, index: any) => [index, value[2]]),
  ]);

  const selected = useRef<any | null>(null);

  const toTriple = (arr: any, colorspace: any) => {
    const values = arr.map((row: any) => row.map((column: any) => column[1]));
    const flat = values[0].map((value: any, index: any) => {
      if (colorspace === "hsl") {
        return hslToHex([value * 3.6, values[1][index], values[2][index]]);
      } else {
        return hsvToHex([value * 3.6, values[1][index], values[2][index]]);
      }
    });
    return flat;
  };

  const [values, setValues] = useState(toTriple(data.current, colorspace));
  const [isReset, setIsReset] = useState<boolean>(false);

  const handleReset = () => {
    setIsReset((prev) => !prev);
    const resetValues = [
      palette[colorspace].map((value: any, index: any) => [
        index,
        value[0] / 3.6,
      ]),
      palette[colorspace].map((value: any, index: any) => [index, value[1]]),
      palette[colorspace].map((value: any, index: any) => [index, value[2]]),
    ];
    data.current = resetValues;
    setValues(toTriple(resetValues, colorspace));
  };

  const handleSave = () => {
    const newPalette = hexArrToPalette(values);
    handleUpdate(newPalette);
  };

  useEffect(() => {
    setIsReset((prev) => !prev);
    const resetValues = [
      palette[colorspace].map((value: any, index: any) => [
        index,
        value[0] / 3.6,
      ]),
      palette[colorspace].map((value: any, index: any) => [index, value[1]]),
      palette[colorspace].map((value: any, index: any) => [index, value[2]]),
    ];
    data.current = resetValues;
    setValues(toTriple(resetValues, colorspace));
  }, [colorspace, palette]);

  useEffect(() => {
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    if (data.current) {
      const xScale = d3.scaleLinear().range([0, width]);
      const yScale = d3.scaleLinear().range([height, 0]);

      const line = d3
        .line()
        .x(function (d) {
          return xScale(d[0]);
        })
        .y(function (d) {
          return yScale(d[1]);
        })
        .curve(d3.curveMonotoneX);

      const chart = () => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("g").remove();
        svg.attr("width", `${svgWidth}px`).attr("height", `${svgHeight}px`);

        xScale.domain([0, 9]);
        yScale.domain([0, 100]);

        const svgContent = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        // xAxis
        svgContent
          .append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale).tickFormat(() => ""));

        // yAxis
        svgContent
          .append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(yScale));

        const chartContent = svgContent
          .append("g")
          .attr("clip-path", "url(#clip)");

        data.current.forEach((datum, index) => {
          chartContent
            .append("path")
            .datum(datum)
            .attr("class", "line" + index)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line as any);

          // dots
          chartContent
            .selectAll(".dot" + index)
            .data(datum)
            .enter()
            .append("circle")
            .attr("class", "dot" + index)
            .style("fill", "steelblue")
            .attr("r", 5)
            .attr("cx", function (d: any) {
              return xScale(d[0]);
            })
            .attr("cy", function (d: any) {
              return yScale(d[1]);
            });

          const dragstarted = (event: any) => {
            if (event.cancelable) {
              event.preventDefault();
            }
            d3.select(this as any)
              .raise()
              .classed("active", true);
            const dotCoords = event.subject;
            data.current.forEach((datum, row) => {
              if (datum.includes(dotCoords)) {
                const col = datum.indexOf(dotCoords);
                selected.current = [row, col];
              }
            });
          };

          const dragged = (event: any) => {
            if (event.cancelable) {
              event.preventDefault();
            }
            const yVal = yScale.invert(event.y);
            if (Math.sign(event.y) !== -1 && event.y < height) {
              const newData = data.current.map((datum, index) => {
                if (index === selected.current[0]) {
                  return datum.map((value: any, index: any) => {
                    if (index === selected.current[1]) {
                      return [value[0], yVal];
                    } else return value;
                  });
                } else return datum;
              });
              data.current = newData;
              setValues(toTriple(newData, colorspace));
              chartContent.select(".line" + selected.current[0]).remove();
              chartContent
                .append("path")
                .datum(newData[selected.current[0]])
                .attr("class", "line" + selected.current[0])
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);
              chartContent.selectAll(".dot" + selected.current[0]).remove();
              chartContent
                .selectAll(".dot" + selected.current[0])
                .data(newData[selected.current[0]])
                .enter()
                .append("circle")
                .attr("class", "dot" + selected.current[0])
                .style("fill", "steelblue")
                .attr("r", 5)
                .attr("cx", function (d: any) {
                  return xScale(d[0]);
                })
                .attr("cy", function (d: any) {
                  return yScale(d[1]);
                })
                .call(drag as any);
            }
          };

          const dragended = (event: any) => {
            if (event.cancelable) {
              event.preventDefault();
            }
          };

          const drag = d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
          chartContent.selectAll("circle").call(drag as any);
        });

        chartContent.on("contextmenu", (event) => {
          event.preventDefault();
        });
      };
      chart();
    }
  }, [svgHeight, svgWidth, colorspace, isReset]);

  return (
    <Box
      h="525px"
      w="900px"
      bgColor={bgColor[colorMode]}
      borderRadius="lg"
      ml={90}
    >
      <Flex direction="column" alignItems="center" h="100%" w="100%">
        <Flex>
          {values.map((value: string, index: any) => (
            <Box key={index} bgColor={value} w="90px" h="40px" fontSize="xs" />
          ))}
        </Flex>
        <Box>
          <svg ref={svgRef} overflow="visible">
            <g className="xAxis" />
            <g className="yAxis" />
          </svg>
        </Box>
        <Flex justifyContent="flex-end" alignItems="center">
          <RadioGroup onChange={setColorspace} value={colorspace}>
            <Stack direction="row">
              <Radio value="hsl">hsl</Radio>
              <Radio value="hsv">hsv</Radio>
            </Stack>
          </RadioGroup>
          <Button ml={4} colorScheme="blue" onClick={handleSave}>
            save
          </Button>
          <Button ml={4} colorScheme="blue" onClick={handleReset}>
            reset
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

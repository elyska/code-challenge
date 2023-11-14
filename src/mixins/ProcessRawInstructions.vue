<template>

</template>

<script lang="ts">
interface Ship {
  x: number;
  y: number;
  orientation: string;
  steps: string;
}

interface ProcessedInstructions {
  width: number;
  height: number;
  ships: Ship[];
}

function isValidCoordinate(coord: string): boolean {
  // checks the coordinate is a number within given bounds 0 - 50
  const intCoord: number = Number(coord);
  return Number.isInteger(intCoord) && intCoord >= 0 && intCoord <= 50;
}

function isValidOrientation(orientation: string): boolean {
  // checks the coordinate is a number within given bounds 0 - 50
  return ["N", "S", "W", "E"].includes(orientation);
}

function isValidInstructionSet(instr: string): boolean {
  const regex: RegExp = new RegExp(`^[LRF]+$`);
  return regex.test(instr);
}

export default {
  name: "ProcessRawInstructions",
  methods: {
    rawToObj(instructions: string): ProcessedInstructions {
      let lines: string[] = instructions.split(/\r?\n/);
      console.log(lines);
      // get the grid dimensions
      const gridDimensions: string[] = lines[0].split(" ");
      if (gridDimensions.length !== 2 || !isValidCoordinate(gridDimensions[0]) || !isValidCoordinate(gridDimensions[1])) {
        throw new Error("Incorrect grid dimensions: " + gridDimensions);
      }
      const width: number = Number(gridDimensions[0]);
      const height: number = Number(gridDimensions[1]);

      // get ship positions and instructions
      const shipLines: string[] = lines.slice(1).filter((line: string) => line.replaceAll(" ", "") !== ""); // filter out empty lines
      if (shipLines.length % 2 !== 0) {
        throw new Error("Incorrect instructions.");
      }

      const ships: Ship[] = [];
      for (let i: number = 0; i < shipLines.length; i += 2) {
        const shipPos: string[] = shipLines[i].split(" ");
        if (shipPos.length !== 3 || !isValidCoordinate(shipPos[0]) || !isValidCoordinate(shipPos[1]) || !isValidOrientation(shipPos[2])) {
          throw new Error("Incorrect ship position: " + shipLines[i]);
        }
        const x: number = Number(shipPos[0]);
        const y: number = Number(shipPos[1]);
        const orientation: string = shipPos[2];

        const steps: string = shipLines[i + 1];
        if (!isValidInstructionSet(steps)) {
          throw new Error("Incorrect ship instructions: " + steps);
        }

        ships.push({
          x: x,
          y: y,
          orientation: orientation,
          steps: steps,
        });
      }

      return {
        width: width,
        height: height,
        ships: ships,
      };
    },
  },
};
</script>

<style scoped>

</style>
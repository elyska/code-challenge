<template>

</template>

<script lang="ts">


import {ProcessedInstructions, Ship, Coordinates, ShipState} from "@/interfaces";

// checks the coordinate is a number within given bounds 0 - 50
function isValidCoordinate(coord: string): boolean {
  const intCoord: number = Number(coord);
  return Number.isInteger(intCoord) && intCoord >= 0 && intCoord <= 50;
}

// checks the coordinate is a number within given bounds 0 - 50
function isValidOrientation(orientation: string): boolean {
  return ["N", "S", "W", "E"].includes(orientation);
}

// checks if the instructions contain only L, R, F
function isValidInstructionSet(instr: string): boolean {
  const regex: RegExp = new RegExp(`^[LRF]+$`);
  return regex.test(instr);
}

// returns new orientation based on currentOrientation and command
function turn(currentOrientation: string, command: string): string {
  const directions: string[] = ["N", "E", "S", "W"]; // clockwise
  const indexCurrent: number = directions.indexOf(currentOrientation);
  // console.log(indexCurrent)
  let newIndex: number;
  if (command === "L") newIndex = indexCurrent - 1;
  else if (command === "R") newIndex = indexCurrent + 1;

  if (newIndex >= directions.length) newIndex = 0;
  else if (newIndex < 0) newIndex = directions.length - 1;

  // console.log(newIndex)
  // console.log(directions[newIndex])
  return directions[newIndex];
}

// returns a new position
function move(orientation, currentX, currentY): Coordinates {
  switch (orientation) {
    case "N":
      return {
        x: currentX,
        y: currentY + 1,
      };
    case "W":
      return {
        x: currentX - 1,
        y: currentY,
      };
    case "E":
      return {
        x: currentX + 1,
        y: currentY,
      };
    case "S":
      return {
        x: currentX,
        y: currentY - 1,
      };
  }
}

export default {
  name: "ProcessInstructions",
  methods: {
    rawToObj(instructions: string): ProcessedInstructions {
      let lines: string[] = instructions.split(/\r?\n/);
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
        if (x > width || x < 0 || y > height || y < 0) {
          throw new Error("Ship off the grid: " + shipLines[i]);
        }

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
    carryOutInstructions(instructions: ProcessedInstructions): string[] {
      const output: string[] = [];
      const warnings: Coordinates[] = []; // last locations of lost ship
      for (const shipData: Ship of instructions.ships) {
        const currentShipState: ShipState = {
          x: shipData.x,
          y: shipData.y,
          orientation: shipData.orientation,
          lost: false,
        }
        for (const step: string of shipData.steps) {
          // turn
          if (step === "L" || step === "R") {
            const newOrientation: string = turn(currentShipState.orientation, step);
            currentShipState.orientation = newOrientation;
          }
          // move
          else if (step === "F") {
            const newPosition: Coordinates = move(currentShipState.orientation, currentShipState.x, currentShipState.y);

            // check the new position is not out of the grid
            if (newPosition.x > instructions.width || newPosition.x < 0 ||
                newPosition.y > instructions.height || newPosition.y < 0) {
              // check warnings
              let warned: boolean = false;
              for (const warning of warnings) {
                if (currentShipState.x === warning.x && currentShipState.y === warning.y) {
                  warned = true;
                  break;
                }
              }
              if (warned) continue; // ignore command to move out of the grid

              currentShipState.lost = true;
              warnings.push({ x: currentShipState.x, y: currentShipState.y });
              break;
            }

            currentShipState.x = newPosition.x;
            currentShipState.y = newPosition.y;
          }
        }

        const shipOutput: string = `${currentShipState.x} ${currentShipState.y} ${currentShipState.orientation} ${currentShipState.lost ? "LOST" : ""}`;
        output.push(shipOutput)
      }
      return output;
    },
  },
};
</script>

<style scoped>

</style>
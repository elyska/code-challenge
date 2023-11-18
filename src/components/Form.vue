<template>
  <div class="container mt-3">
    <div class="row gx-5">
      <div class="col-12 col-sm-3">
        <h1>SURVEY SHIPS</h1>
        <h2>INPUT</h2>
        <form @submit.prevent>
          <textarea class="form-control mb-2 mt-2"
                    rows="10" cols="50"
                    v-model="instructions"
                    placeholder="Instructions"
          ></textarea>
          <button type="submit" @click="handleInput">Submit</button>
          <p v-if="errorMessage" class="alert alert-warning mt-4" role="alert">
            {{ errorMessage }}
          </p>
        </form>

        <div  v-if="output.length > 0" class="mt-3">
          <h2>OUTPUT</h2>
          <div class="output-container">
            <p v-for="line in output">
              {{ line }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-9 mt-3 grid-container">
        <OceanGrid v-if="processedInstructions" :instructions="processedInstructions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ProcessCommands from '@/mixins/ProcessCommands.vue';
import {Coordinates, Orientation, ProcessedInstructions, Ship, ShipState} from "@/interfaces";
import OceanGrid from "@/components/OceanGrid.vue";


export default {
  name: "Form",
  components: {OceanGrid},
  mixins: [ProcessCommands],
  data(): {
    instructions: string;
    output: string[];
    errorMessage: string;
    processedInstructions: ProcessedInstructions | undefined;
  } {
    return {
      instructions: '5 3\n' +
          '1 1 E\n' +
          'RFRFRFRF\n' +
          '\n' +
          '3 2 N\n' +
          'FRRFLLFFRRFLL\n' +
          '\n' +
          '0 3 W\n' +
          'LLFFFLFLFL',
      output: [],
      errorMessage: "",
      processedInstructions: undefined,
    };
  },
  methods: {
    handleInput(): void {
      this.errorMessage = "";
      this.output = [];
      this.processedInstructions = undefined;
      try {

        this.processedInstructions = this.rawToObj(this.instructions);
        const output: string[] = this.carryOutInstructions(this.processedInstructions);
        this.output = output;
      }
      catch (message) {
        this.errorMessage = message;
      }
    },
    rawToObj(instructions: string): ProcessedInstructions {
      let lines: string[] = instructions.split(/\r?\n/);
      // get the grid dimensions
      const gridDimensions: string[] = lines[0].split(" ");
      if (gridDimensions.length !== 2 || !this.isValidCoordinate(gridDimensions[0]) || !this.isValidCoordinate(gridDimensions[1])) {
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
        if (shipPos.length !== 3 || !this.isValidCoordinate(shipPos[0]) || !this.isValidCoordinate(shipPos[1]) || !this.isValidOrientation(shipPos[2])) {
          throw new Error("Incorrect ship position: " + shipLines[i]);
        }
        const x: number = Number(shipPos[0]);
        const y: number = Number(shipPos[1]);
        if (x > width || x < 0 || y > height || y < 0) {
          throw new Error("Ship off the grid: " + shipLines[i]);
        }

        const orientation: string = shipPos[2];

        const steps: string = shipLines[i + 1];
        if (!this.isValidInstructionSet(steps)) {
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
            const newOrientation: Orientation = this.turn(currentShipState.orientation, step);
            currentShipState.orientation = newOrientation;
          }
          // move
          else if (step === "F") {
            const newPosition: Coordinates = this.move(currentShipState.orientation, currentShipState.x, currentShipState.y);

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
    isValidCoordinate(coord: string): boolean { // checks the coordinate is a number within given bounds 0 - 50
      const intCoord: number = Number(coord);
      return Number.isInteger(intCoord) && intCoord >= 0 && intCoord <= 50;
    },
    isValidOrientation(orientation: string): boolean { // checks the orientation is "N", "S", "W" or "E"
      return ["N", "S", "W", "E"].includes(orientation);
    },
    isValidInstructionSet(instr: string): boolean { // checks if the instructions contain only L, R, F
      const regex: RegExp = new RegExp(`^[LRF]+$`);
      return regex.test(instr);
    },
  }
}
</script>
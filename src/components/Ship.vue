<template>
  <div class="grid" :style="{ width: `${width * gridPointDistance}px`, height: `${height * gridPointDistance}px` }">
    <img v-for="(ship, index) in ships" :id="'ship' + index" class="ship" src="public/images/ship.svg" :style="{ bottom: `${ship.y * gridPointDistance}px`, left: `${ship.x * gridPointDistance}px` }">
  </div>
</template>

<script lang="ts">
import {onUpdated} from "vue";
import anime from 'animejs/lib/anime.es.js';
import ProcessCommands from "@/mixins/ProcessCommands.vue";
import Constants from "@/mixins/Constants.vue";
import {Command, Coordinates, Orientation, ProcessedInstructions, Ship} from "@/interfaces";

export default {
  name: "Ship",
  mixins: [ProcessCommands, Constants],
  props: {
    instructions: {
      type: Object as () => ProcessedInstructions,
    },
  },
  data(): {
    width: number,
    height: number,
    gridPoints: Coordinates[],
    ships: Ship[],
    warnings: Coordinates[],
    shipX: number,
    shipY: number,
    orientation: Orientation | undefined,
  } {
    return {
      width: 0,
      height: 0,
      gridPoints: [],
      ships: [],
      warnings: [],
      shipX: 0,
      shipY: 0,
      orientation: undefined,
    }
  },
  methods: {
    createGrid(): void {
      this.width = this.instructions.width;
      this.height = this.instructions.height;

      this.ships = this.instructions.ships;
      this.warnings = [];
    },
    animate(): void {
      const t = anime.timeline({
        easing: 'easeOutExpo',
      });

      for (let i = 0; i < this.ships.length; i++) {
        // reset - hide all ships
        t.add({
          targets: `#ship${i}`,
          opacity: 0,
          scale: 1,
          duration: 1,
        })
      }
      for (let i = 0; i < this.ships.length; i++) {
        // set current ship data
        this.shipX = this.ships[i].x;
        this.shipY = this.ships[i].y;
        this.orientation = this.ships[i].orientation;
        // position ship on the starting point
        t.add({
          targets: `#ship${i}`,
          opacity: 1,
          translateX: -20,
          translateY: 20,
          rotate: this.orientationToRotation(this.ships[i].orientation),
          duration: 1
        })

        for (let j = 0; j < this.ships[i].steps.length; j++) {
          const command: Command = this.ships[i].steps[j];
          // set new orientation and position
          if (command === "L" || command === "R") {
            const newOrientation: Orientation = this.turn(this.orientation, command);
            this.orientation = newOrientation;
          }
          else if (command === "F") {
            const newPosition: Coordinates = this.move(this.orientation, this.shipX, this.shipY);

            this.shipX = newPosition.x;
            this.shipY = newPosition.y;

          }
          // animate changes in orientation / position
          t.add({
            targets:`#ship${i}`,
            bottom: this.shipY * this.gridPointDistance,
            left: this.shipX * this.gridPointDistance,
            rotate: this.orientationToRotation(this.orientation),
            duration: 200
          });
        }
      }
    },
    orientationToRotation(orientation: Orientation): number { // get css rotation for a given orientation
      switch (orientation) {
        case "N":
          return -90;
        case "S":
          return 90;
        case "W":
          return 180;
        default:
          return 0;
      }
    }
  },
  mounted() {
    this.createGrid();
    this.animate();
    onUpdated(() => {
      this.createGrid();
      this.animate();
    });
  }
}

</script>

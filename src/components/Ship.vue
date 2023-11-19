<template>
  <div class="ships" :style="'padding:' + offset/2 + 'px'">
    <div class="ships-container">
      <img v-for="(ship, index) in ships" :id="'ship' + index" class="ship" src="public/images/ship.svg" :style="{ bottom: `${ship.y * gridPointDistanceY}%`, left: `${ship.x * gridPointDistanceX}%`, width: `${offset}px`}">
    </div>
  </div>
</template>

<script lang="ts">
import {onUpdated} from "vue";
import anime from 'animejs/lib/anime.es.js';
import ProcessCommands from "@/mixins/ProcessCommands.vue";
import {Command, Coordinates, Orientation, ProcessedInstructions, Ship} from "@/interfaces";

export default {
  name: "Ship",
  mixins: [ProcessCommands],
  props: {
    instructions: {
      type: Object as () => ProcessedInstructions,
    },
    offset: {
      type: Number,
    }
  },
  data(): {
    width: number,
    height: number,
    gridPoints: Coordinates[],
    ships: Ship[],
    warnings: Coordinates[],
    shipX: number,
    shipY: number,
    gridPointDistanceX: number,
    gridPointDistanceY: number,
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
      gridPointDistanceX: 0,
      gridPointDistanceY: 0,
    }
  },
  methods: {
    createGrid(): void {
      this.width = this.instructions.width;
      this.height = this.instructions.height;

      this.ships = this.instructions.ships;
      this.warnings = [];

      // convert to percentages
      this.gridPointDistanceX = 100/this.instructions.width;
      this.gridPointDistanceY = 100/this.instructions.height;
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
          translateX: -this.offset/2,
          translateY: this.offset/2,
          rotate: this.orientationToRotation(this.ships[i].orientation),
          duration: 1
        })

        for (let j = 0; j < this.ships[i].steps.length; j++) {
          const command: Command = this.ships[i].steps[j];
          // set orientation and position
          if (command === "L" || command === "R") {
            const newOrientation: Orientation = this.turn(this.orientation, command);
            this.orientation = newOrientation;
          }
          else if (command === "F") {
            const newPosition: Coordinates = this.move(this.orientation, this.shipX, this.shipY);

            // check the new position is not out of the grid
            if (newPosition.x > this.width || newPosition.x < 0 ||
                newPosition.y > this.height || newPosition.y < 0) {
              // check warnings
              let warned: boolean = false;
              for (const warning of this.warnings) {
                if (this.shipX === warning.x && this.shipY === warning.y) {
                  warned = true;
                  break;
                }
              }
              if (!warned) {
                // add warning for other ships
                this.warnings.push({ x: this.shipX, y: this.shipY });
                // disappear
                t.add({
                  targets: `#ship${i}`,
                  opacity: 0.5,
                  scale: 0.7,
                  duration: 500
                });
                break;
              }
              if (warned) continue; // ignore command to move out of the grid
            }
            else {
              this.shipX = newPosition.x;
              this.shipY = newPosition.y;
            }
          }
          // animate changes in orientation / position
          t.add({
            targets:`#ship${i}`,
            bottom: `${this.shipY * this.gridPointDistanceY}%`,
            left: `${this.shipX * this.gridPointDistanceX}%`,
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

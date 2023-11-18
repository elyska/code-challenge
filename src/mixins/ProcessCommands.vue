
<script lang="ts">
import {Command, Coordinates, Orientation} from "@/interfaces";

export default {
  name: "ProcessCommands",
  methods: {
    move(orientation: Orientation, currentX: number, currentY: number): Coordinates { // returns a new position
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
    },
    turn(currentOrientation: Orientation, command: Command): Orientation { // returns new orientation based on currentOrientation and command
      const directions: Orientation[] = ["N", "E", "S", "W"]; // clockwise
      const indexCurrent: number = directions.indexOf(currentOrientation);

      let newIndex: number;
      if (command === "L") newIndex = indexCurrent - 1;
      else if (command === "R") newIndex = indexCurrent + 1;

      if (newIndex >= directions.length) newIndex = 0;
      else if (newIndex < 0) newIndex = directions.length - 1;

      return directions[newIndex];
    },
  },
};
</script>
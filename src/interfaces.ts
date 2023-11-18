
export type Orientation = "N" | "E" | "S" | "W";

export type Command = "L" | "R" | "F";
export interface Ship {
    x: number;
    y: number;
    orientation: Orientation;
    steps: string;
}
export interface ShipState {
    x: number;
    y: number;
    orientation: Orientation;
    lost: boolean;
}

export interface ProcessedInstructions {
    width: number;
    height: number;
    ships: Ship[];
}
export interface Coordinates {
    x: number;
    y: number;
}
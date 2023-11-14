export interface Ship {
    x: number;
    y: number;
    orientation: string;
    steps: string;
}
export interface ShipState {
    x: number;
    y: number;
    orientation: string;
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
export interface IPoint {
    x: number;
    y: number;
}
export interface IDrawLine {
    points: IPoint[];
    color: string;
    width: number;
}
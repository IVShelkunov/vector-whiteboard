import type { IDrawLine } from "../../types/drawing";

export const drawStroke = (line: IDrawLine, ctx: CanvasRenderingContext2D, width: number, color: string) => {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(line.points[0].x, line.points[0].y);
    for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
}
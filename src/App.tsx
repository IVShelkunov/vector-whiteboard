import { useEffect, useRef, useState } from "react";
import "./App.css";
import type { IDrawLine, IPoint } from "./types/drawing";
import { useTemporal } from "use-temporal-state-history";
import { drawStroke } from "./lib/utils/drawUtils";
import ControlButton from "./components/ui/ControlButton";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines, { undo, redo, clear, canUndo, canRedo }] =
    useTemporal<IDrawLine[]>([]);
  const [currentLine, setCurrentLine] = useState<IDrawLine | null>(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(4);
  //begin draw
  //mouse coord helper
  const getMousePos = (e: MouseEvent | TouchEvent): IPoint => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = (e as TouchEvent).touches
      ? (e as TouchEvent).touches[0].clientX
      : (e as MouseEvent).clientX;
    const clientY = (e as TouchEvent).touches
      ? (e as TouchEvent).touches[0].clientY
      : (e as MouseEvent).clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };
  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    if (e.type === "touchstart") e.preventDefault();
    const { x, y } = getMousePos(e);
    const newLine: IDrawLine = {
      points: [{ x, y }],
      color: brushColor,
      width: brushWidth,
    };
    setCurrentLine(newLine);
  };
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (e.type === "touchmove") e.preventDefault();
    if (!currentLine) return;
    const { x, y } = getMousePos(e);
    setCurrentLine({
      ...currentLine,
      points: [...currentLine.points, { x, y }],
    });
  };
  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    if (e.type === "touchend") e.preventDefault();
    if (!currentLine) return;
    setLines([...lines, currentLine]);
    setCurrentLine(null);
  };
  const handleClear = () => {
    setLines([]);
    clear();
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resizeCanvas();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    lines.forEach((line) => {
      drawStroke(line, ctx, line.width, line.color);
    });
    if (currentLine) {
      drawStroke(currentLine, ctx, currentLine.width, currentLine.color);
    }
    //mouse listeners
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    //touch listeners
    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("touchend", handleMouseUp);
    console.log(lines);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("touchend", handleMouseUp);
    };
  }, [lines, currentLine, brushColor, brushWidth]);
  return (
    <main className="h-dvh bg-slate-950 text-slate-200 p-8 flex flex-col items-center gap-6">
      <h1 className="md:text-5xl text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
        Vector whiteboard
      </h1>
      <div className="flex flex-col  md:flex-row gap-4" ref={containerRef}>
        <div className="w-full max-w-4xl h-[60vh] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-crosshair">
          <canvas className="block w-full h-full" ref={canvasRef} />
        </div>
        {/* control panel */}
        <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-4 shadow-2xl shadow-indigo-500/10 ">
          <div className="flex gap-2">
            <ControlButton variant="undo" condition={canUndo} action={undo}>
              ↩
            </ControlButton>
            <ControlButton variant="redo" condition={canRedo} action={redo}>
              ↪
            </ControlButton>
            <ControlButton
              variant="clear"
              condition={lines.length !== 0}
              action={handleClear}
            >
              Clear
            </ControlButton>
          </div>
          <div className="h-8 w-px bg-slate-700" /> {/* Divider */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Color</label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <label className="text-sm font-medium">Width:{brushWidth}</label>
            <input
              type="range"
              min={1}
              max={100}
              value={brushWidth}
              onChange={(e) => setBrushWidth(Number(e.target.value))}
              className="accent-indigo-500"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;

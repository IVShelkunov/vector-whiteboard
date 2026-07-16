import { useRef, useState } from "react";
import { TemporalEngine } from "../engine/TemporalEngine";

export function useTemporal<T>(initialValue: T, options?: { clone?: boolean; limit?: number }) {
    const engineRef = useRef(new TemporalEngine(initialValue, options?.clone, options?.limit));
    const [, setTick] = useState(0);
    const forceUpdate = () => setTick((t) => t + 1);
    const set = (newValue: T, skipHistory?: boolean) => {
        engineRef.current.set(newValue, skipHistory);
        forceUpdate();
    }
    const undo = () => {
        const success = engineRef.current.undo();
        if (success) {
            forceUpdate();
        }
    }
    const redo = () => {
        const success = engineRef.current.redo();
        if (success) {
            forceUpdate();
        }
    }
    const clear = () => {
        engineRef.current.clear();
        forceUpdate();
    }
    const state = engineRef.current.getPresent();
    const canUndo = engineRef.current.canUndo();
    const canRedo = engineRef.current.canRedo();
    const history = engineRef.current.getPast();
    return [
        state,
        set,
        {
            undo,
            redo,
            clear,
            canUndo,
            canRedo,
            history
        }
    ] as const;
}
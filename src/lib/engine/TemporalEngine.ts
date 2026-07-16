export class TemporalEngine<T> {
    private past: T[] = [];
    private present: T;
    private future: T[] = [];
    private clone: boolean;
    private limit: number;
    constructor(initialValue: T, clone: boolean = false, limit: number = Infinity) {
        this.clone = clone;
        this.present = this.cloneValue(initialValue);
        this.limit = limit;
    }
    private cloneValue(value: T): T {
        return this.clone ? structuredClone(value) : value;
    }
    private cutHistory(): void {
        if (this.past.length > this.limit) {
            this.past.shift();
        }
    }
    public getPresent(): T {
        return this.present;
    }
    public getPast(): T[] {
        return this.past;
    }
    public getFuture(): T[] {
        return this.future;
    }
    public canUndo(): boolean {
        return this.past.length !== 0;

    }
    public canRedo(): boolean {
        return this.future.length !== 0;
    }
    public set(newValue: T, skipHistory: boolean = false): void {
        if (skipHistory) {
            this.present = this.cloneValue(newValue);
        } else {
            this.past.push(this.cloneValue(this.present));
            this.cutHistory();
            this.present = this.cloneValue(newValue);
            this.future = [];
        }

    }
    public undo(): boolean {
        if (this.canUndo()) {
            this.future.push(this.cloneValue(this.present));
            const previousState = this.past.pop();
            if (previousState !== undefined) {
                this.present = this.cloneValue(previousState);
            }
            return true;
        } else {
            return false;
        }
    }
    public redo(): boolean {
        if (this.canRedo()) {
            const lastState = this.future.pop();
            if (lastState !== undefined) {
                this.past.push(this.cloneValue(this.present));
                this.cutHistory();
                this.present = this.cloneValue(lastState);
            }
            return true;
        } else {
            return false;
        }
    }
    public clear(): void {
        this.past = [];
        this.future = [];
    }
}
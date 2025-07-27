import { GridInitialState } from "@mui/x-data-grid";

export type DemoActions =
    | { type: "createView"; value: GridInitialState }
    | { type: "deleteView"; id: string }
    | { type: "setNewViewLabel"; label: string }
    | { type: "setActiveView"; id: string | null }
    | { type: "togglePopper"; element: HTMLElement }
    | { type: "closePopper" };

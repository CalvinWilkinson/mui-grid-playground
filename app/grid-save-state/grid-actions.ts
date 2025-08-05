import { GridInitialState } from "@mui/x-data-grid";

export type GridActions =
    | { type: "createView"; value: GridInitialState }
    | { type: "deleteView"; id: string }
    | { type: "setNewViewLabel"; label: string }
    | { type: "setActiveView"; id: string | null }
    | { type: "togglePopupMenu"; element: HTMLElement }
    | { type: "closePopupMenu" };

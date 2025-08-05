import { GridInitialState } from "@mui/x-data-grid";

/**
 * Represents a saved view state for the MUI Data Grid component.
 * This interface defines the structure for storing and managing
 * different grid configurations that users can save and restore.
 */
export interface StateView {
    /**
     * The display name for this saved view state.
     * This label will be shown to users when selecting between different views.
     */
    label: string;
    
    /**
     * The actual grid state configuration containing all the settings
     * such as column order, filters, sorting, pagination, and other
     * grid properties that define how the grid should be displayed.
     */
    value: GridInitialState;
}


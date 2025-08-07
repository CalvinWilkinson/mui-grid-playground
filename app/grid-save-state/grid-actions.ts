import { GridInitialState } from "@mui/x-data-grid";

/**
 * Union type defining all possible actions that can be dispatched to modify grid state.
 * These actions are used with a reducer pattern to manage grid view configurations,
 * menu interactions, and user interface state changes in a predictable way.
 */
export type GridActions =
    /**
     * Creates a new grid view with the provided configuration.
     * The value contains the complete grid state including column settings,
     * filters, sorting preferences, and other display options.
     */
    | { type: "createView"; value: GridInitialState }

    /**
     * Removes an existing grid view from the saved configurations.
     * The id parameter specifies which view should be deleted from
     * the collection of saved views.
     */
    | { type: "deleteView"; id: string }

    /**
     * Updates the label text for a new grid view being created.
     * This action is typically triggered when users type in input fields
     * to name their custom grid configurations.
     */
    | { type: "setViewLabel"; label: string }

    /**
     * Changes the currently active grid view to the specified view.
     * When id is null, it deselects the current view and returns
     * the grid to its default state.
     */
    | { type: "setActiveView"; id: string | null }

    /**
     * Toggles the visibility of the popup menu and sets its anchor element.
     * The element parameter determines where the menu will be positioned
     * relative to the grid interface.
     */
    | { type: "togglePopupMenu"; element: HTMLElement }

    /**
     * Closes the popup menu and clears its anchor element reference.
     * This action is used to hide dropdown menus and cleanup
     * any associated UI state.
     */
    | { type: "closePopupMenu" };

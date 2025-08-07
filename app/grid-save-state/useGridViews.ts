import { Dispatch, useCallback, useMemo, useReducer, useEffect, RefObject } from "react";
import { gridToolbarReducer, INITIAL_STATE } from "./grid-toolbar-reducer";
import { GridActions } from "./grid-actions";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { GridState } from "./grid-state";

/**
 * Interface defining the return type of the useGridViews hook
 */
interface HookResult {
    /**
     * Current state of the grid views
     */
    state: typeof INITIAL_STATE;

    /**
     * Dispatch function for updating state
     */
    dispatch: Dispatch<GridActions>;

    initView: () => void;

    /**
     * Function to create a new view from current grid state
     */
    createNewView: () => void;

    /**
     * Function to delete a specific view by ID
     */
    handleDeleteView: (viewId: string) => void;

    /**
     * Function to set a specific view as active and restore its state
     */
    handleSetActiveView: (viewId: string) => void;

    /**
     * Boolean indicating if the new view label is valid (not empty and unique)
     */
    isNewViewLabelValid: boolean;
}

/**
 * Custom hook for managing MUI Data Grid view states.
 * 
 * This hook provides functionality to:
 * - Create new views by capturing the current grid state
 * - Delete existing views
 * - Switch between different saved views
 * - Validate new view labels for uniqueness
 * - Maintain independent state for different grid instances
 * 
 * @returns {HookResult} Object containing state, dispatch function, and view management functions
 */
export function useGridViews(apiRef: RefObject<GridApiCommunity | null>): HookResult {
    // Initialize state with reducer for managing views
    const [state, dispatch] = useReducer(gridToolbarReducer, INITIAL_STATE);

    const initView = useCallback(() => {
        let gridStateJsonData = localStorage?.getItem("dataGridState");

        if (!gridStateJsonData) {
            localStorage.setItem("dataGridState", JSON.stringify(INITIAL_STATE));
            gridStateJsonData = localStorage?.getItem("dataGridState");
        }

        const gridState: GridState = JSON.parse(gridStateJsonData || "{}");

        dispatch({
            type: "setActiveView",
            id: gridState.currentViewId
        });
    }, []);

    /**
     * Creates a new view by capturing the current state of the grid.
     * Exports the current grid state (columns, filters, sorting, etc.) 
     * and dispatches it to be saved as a new view.
     */
    const createNewView = useCallback(() => {
        if (apiRef === null || apiRef.current === null) {
            throw new Error("The api reference to the MUI data grid cannot be null.");
        }

        dispatch({
            type: "createView",
            value: apiRef.current.exportState(),
        });
    }, [apiRef]);

    /**
     * Deletes a view by its unique identifier.
     * 
     * @param {string} viewId - The unique ID of the view to delete
     */
    const handleDeleteView = useCallback((viewId: string) => {
        dispatch({ type: "deleteView", id: viewId });
    }, []);

    /**
     * Sets a view as active and restores the grid to that view's saved state.
     * This will restore columns, filters, sorting, and other grid configurations
     * that were saved when the view was created.
     * @param {string} viewId - The unique ID of the view to activate
     */
    const handleSetActiveView = useCallback((viewId: string) => {
        if (apiRef === null || apiRef.current === null) {
            throw new Error("The api reference to the MUI data grid cannot be null.");
        }

        apiRef.current.restoreState(state.viewConfigs[viewId].value);
        dispatch({ type: "setActiveView", id: viewId });
    }, [apiRef, state.viewConfigs]);

    /**
     * Validates whether the current new view label is acceptable.
     * A label is valid if:
     * 1. It's not empty (has at least 1 character)
     * 2. It's unique (no existing view has the same label)
     * @returns {boolean} True if the label is valid, false otherwise
     */
    const isNewViewLabelValid = useMemo(() => {
        if (state.viewName.length === 0) {
            return false;
        }

        return Object.values(state.viewConfigs).every((view) => view.label !== state.viewName);
    }, [state.viewConfigs, state.viewName]);

    // Add useEffect to react to state changes
    useEffect(() => {
        console.log('Updated state:', state);

        // Example: Save to localStorage whenever views change
        localStorage.setItem("dataGridState", JSON.stringify(state));
    }, [state]);

    return {
        state,
        initView,
        dispatch,
        createNewView,
        handleDeleteView,
        handleSetActiveView,
        isNewViewLabelValid,
    };
}

import { Dispatch, useCallback, useMemo, useReducer, useEffect } from "react";
import { useGridApiContext } from "@mui/x-data-grid";
import { toolbarReducer, INITIAL_STATE } from "./toolbar-reducer";
import { GridActions } from "./grid-actions";

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

// Global state storage for multiple grid instances
const gridStates = new Map<string, typeof INITIAL_STATE>();

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
 * @param gridId - Unique identifier for this grid instance
 * @returns {HookResult} Object containing state, dispatch function, and view management functions
 */
export function useGridViews(gridId: string = "default"): HookResult {
    // Get the MUI Data Grid API reference for accessing grid state
    const apiRef = useGridApiContext();
    
    // Get or create initial state for this grid instance
    const getInitialState = useCallback(() => {
        if (!gridStates.has(gridId)) {
            gridStates.set(gridId, { ...INITIAL_STATE });
        }
        return gridStates.get(gridId)!;
    }, [gridId]);

    // Initialize state with reducer for managing views
    const [state, dispatch] = useReducer(toolbarReducer, getInitialState());

    // Update the global state whenever local state changes
    useEffect(() => {
        gridStates.set(gridId, state);
    }, [gridId, state]);

    /**
     * Creates a new view by capturing the current state of the grid.
     * Exports the current grid state (columns, filters, sorting, etc.) 
     * and dispatches it to be saved as a new view.
     */
    const createNewView = useCallback(() => {
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
        if (state.viewName.length === 0) return false;
        return Object.values(state.viewConfigs).every((view) => view.label !== state.viewName);
    }, [state.viewConfigs, state.viewName]);

    return {
        state,
        dispatch,
        createNewView,
        handleDeleteView,
        handleSetActiveView,
        isNewViewLabelValid,
    };
}

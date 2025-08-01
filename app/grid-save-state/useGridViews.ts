import { ReactNode, useCallback, useMemo, useReducer } from "react";
import { useGridApiContext } from "@mui/x-data-grid";
import { toolbarReducer, INITIAL_STATE } from "./toolbar-reducer";
import { DemoActions } from "./demo-actions";

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
    dispatch: React.Dispatch<DemoActions>;
    
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
 * 
 * @returns {HookResult} Object containing state, dispatch function, and view management functions
 */
export function useGridViews(): HookResult {
    // Get the MUI Data Grid API reference for accessing grid state
    const apiRef = useGridApiContext();
    
    // Initialize state with reducer for managing views
    const [state, dispatch] = useReducer(toolbarReducer, INITIAL_STATE);

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
        apiRef.current.restoreState(state.views[viewId].value);
        dispatch({ type: "setActiveView", id: viewId });
    }, [apiRef, state.views]);

    /**
     * Validates whether the current new view label is acceptable.
     * A label is valid if:
     * 1. It's not empty (has at least 1 character)
     * 2. It's unique (no existing view has the same label)
     * @returns {boolean} True if the label is valid, false otherwise
     */
    const isNewViewLabelValid = useMemo(() => {
        if (state.newViewLabel.length === 0) return false;
        return Object.values(state.views).every((view) => view.label !== state.newViewLabel);
    }, [state.views, state.newViewLabel]);

    return {
        state,
        dispatch: dispatch as React.Dispatch<DemoActions>,
        createNewView,
        handleDeleteView,
        handleSetActiveView,
        isNewViewLabelValid,
    };
}

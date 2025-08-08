import { Reducer } from "react";
import { GridState } from "./grid-state";
import { GridActions } from "./grid-actions";

/**
 * Reducer function for managing the grid toolbar state and view management.
 * Handles all actions related to creating, deleting, and switching between grid views,
 * as well as managing the UI state for the view selector menu.
 * 
 * @param state - The current grid state
 * @param action - The action to be processed
 * @returns The new state after applying the action
 */
export const gridToolbarReducer: Reducer<GridState, GridActions> = (state: GridState, action: GridActions) => {
    switch (action.type) {
        case "hydrate": {
            // Replace entire state with persisted version
            return { ...action.payload };
        }

        /**
         * Creates a new view with the current grid state.
         * Generates a random ID for the view, uses the current newViewLabel as the display name,
         * adds the view to the views collection, sets it as active, clears the input field,
         * and closes the menu.
         */
        case "createView": {
            const id = crypto.randomUUID();
            const label = state.viewName;

            return {
                ...state,
                currentViewId: id,
                viewName: "",
                viewConfigs: {
                    ...state.viewConfigs,
                    [id]: { label: label, value: action.value },
                },
                isMenuOpened: false,
            };
        }

        /**
         * Deletes a specific view from the views collection.
         * If the deleted view was the active one, automatically selects the first
         * available view as the new active view, or sets activeViewId to null
         * if no views remain.
         */
        case "deleteView": {
            const views = Object.fromEntries(
                Object.entries(state.viewConfigs).filter(([id]) => id !== action.id),
            );

            let activeViewId: string | null;
            if (state.currentViewId !== action.id) {
                activeViewId = state.currentViewId;
            } else {
                const viewIds = Object.keys(state.viewConfigs);

                if (viewIds.length === 0) {
                    activeViewId = null;
                } else {
                    activeViewId = viewIds[0];
                }
            }

            return {
                ...state,
                viewConfigs: views,
                currentViewId: activeViewId,
            };
        }

        /**
         * Sets a specific view as the currently active view.
         * Updates the activeViewId and closes the menu to provide
         * a smooth user experience when switching between views.
         */
        case "setActiveView": {
            return {
                ...state,
                currentViewId: action.id,
                isMenuOpened: false,
            };
        }

        /**
         * Updates the label for a new view that is being created.
         * This is typically called when the user types in the new view name input field.
         */
        case "setViewLabel": {
            return {
                ...state,
                viewName: action.label,
            };
        }

        /**
         * Toggles the visibility of the view selector popup menu.
         * Sets the anchor element for proper positioning of the popup
         * and toggles the isMenuOpened state.
         */
        case "togglePopupMenu": {
            return {
                ...state,
                isMenuOpened: !state.isMenuOpened,
                menuAnchorElement: action.element,
            };
        }

        /**
         * Closes the view selector popup menu.
         * Sets isMenuOpened to false, typically called when clicking outside
         * the menu or when an action that should close the menu is performed.
         */
        case "closePopupMenu": {
            return {
                ...state,
                isMenuOpened: false,
            };
        }

        /**
         * Default case to handle any unrecognized actions.
         * Returns the current state unchanged to maintain state consistency.
         */
        default: {
            return state;
        }
    }
};

/**
 * Initial state for the grid toolbar reducer.
 * Defines the default values for all state properties when the component is first initialized.
 * 
 * @property views - Empty object to store saved grid views
 * @property newViewLabel - Empty string for the new view input field
 * @property isMenuOpened - False to keep the menu closed initially
 * @property menuAnchorEl - Null as no anchor element is set initially
 * @property activeViewId - Null as no view is selected initially
 */
export const INITIAL_STATE: GridState = {
    /**
     * Collection of saved grid view configurations.
     * Each key is a unique view ID, and the value contains the view's
     * display label and configuration data for restoring grid state.
     */
    viewConfigs: {},

    /**
     * Current value of the new view name input field.
     * Used when creating a new view to store the user-entered name
     * before the view is actually created and saved.
     */
    viewName: "",

    /**
     * Boolean flag indicating whether the view selector popup menu is open.
     * Controls the visibility of the dropdown menu that shows available views
     * and options for creating/deleting views.
     */
    isMenuOpened: false,

    /**
     * Reference to the DOM element that serves as the anchor for the popup menu.
     * Used by Material-UI's Menu component to position the popup relative
     * to the trigger button or element.
     */
    menuAnchorElement: null,

    /**
     * ID of the currently active/selected grid view.
     * When null, no view is selected (default state).
     * Used to determine which view configuration to apply to the grid.
     */
    currentViewId: null,
};

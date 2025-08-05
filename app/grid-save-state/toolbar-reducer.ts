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
export const toolbarReducer: Reducer<GridState, GridActions> = (state: GridState, action: GridActions) => {
    switch (action.type) {
        /**
         * Creates a new view with the current grid state.
         * Generates a random ID for the view, uses the current newViewLabel as the display name,
         * adds the view to the views collection, sets it as active, clears the input field,
         * and closes the menu.
         */
        case "createView": {
            const id = Math.random().toString();
            const label = state.newViewLabel;

            return {
                ...state,
                activeViewId: id,
                newViewLabel: "",
                views: {
                    ...state.views,
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
                Object.entries(state.views).filter(([id]) => id !== action.id),
            );

            let activeViewId: string | null;
            if (state.activeViewId !== action.id) {
                activeViewId = state.activeViewId;
            } else {
                const viewIds = Object.keys(state.views);

                if (viewIds.length === 0) {
                    activeViewId = null;
                } else {
                    activeViewId = viewIds[0];
                }
            }

            return {
                ...state,
                views,
                activeViewId,
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
                activeViewId: action.id,
                isMenuOpened: false,
            };
        }

        /**
         * Updates the label for a new view that is being created.
         * This is typically called when the user types in the new view name input field.
         */
        case "setNewViewLabel": {
            return {
                ...state,
                newViewLabel: action.label,
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
                menuAnchorEl: action.element,
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
    views: {},
    newViewLabel: "",
    isMenuOpened: false,
    menuAnchorEl: null,
    activeViewId: null,
};

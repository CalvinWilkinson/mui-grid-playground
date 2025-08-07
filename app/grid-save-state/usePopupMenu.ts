import { useCallback, KeyboardEvent, MouseEvent, Dispatch } from "react";
import { GridActions } from "./grid-actions";

/**
 * Interface defining the return type of the usePopupMenu hook.
 */
interface UsePopupMenuResult {
    /**
     * Function to handle clicks on the popper anchor element.
     * Toggles the popper menu and prevents event bubbling.
     */
    handleClick: (event: MouseEvent) => void;

    /**
     * Function to close the popper menu.
     */
    handleClose: () => void;

    /**
     * Function to handle keyboard events on the popper list.
     * Closes menu on Tab or Escape key press.
     */
    handleListKeyDown: (event: KeyboardEvent) => void;

    /**
     * Boolean indicating if the menu can be opened.
     * True when menu is opened and anchor element exists.
     */
    canBeMenuOpened: boolean;
}

/**
 * Keys that close the popup menu when pressed.
 */
const CLOSE_MENU_KEYS = ["Tab", "Escape"];

/**
 * Custom hook for managing popup/dropdown menu behavior.
 * 
 * This hook provides functionality to:
 * - Handle clicks on the anchor element to toggle the menu
 * - Close the menu programmatically
 * - Handle keyboard navigation (Tab/Escape to close)
 * - Determine if the menu can be opened based on state
 * - Provide accessibility ID for the popper
 * 
 * @param {Dispatch<GridActions>} dispatch - Function to dispatch state changes
 * @param {boolean} isMenuOpened - Current state of whether menu is opened
 * @param {HTMLElement | null} menuAnchorEl - DOM element that anchors the menu
 * @param {UsePopupMenuOptions} options - Optional configuration for the hook
 * @returns {UsePopupMenuResult} Object containing event handlers and menu state
 */
export function usePopupMenu(
    dispatch: Dispatch<GridActions>,
    isMenuOpened: boolean,
    menuAnchorEl: HTMLElement | null,
): UsePopupMenuResult {
    /**
     * Handles clicks on the popup anchor element.
     * Toggles the popup menu state and prevents the event from bubbling up.
     */
    const handleClick = useCallback((event: MouseEvent) => {
        dispatch({ type: "togglePopupMenu", element: event.currentTarget as HTMLElement });
        event.stopPropagation();
    }, [dispatch]);

    /**
     * Closes the popup menu by dispatching the close action.
     */
    const handleClose = useCallback(() => {
        dispatch({ type: "closePopupMenu" });
    }, [dispatch]);

    /**
     * Handles keyboard events on the popup list for accessibility.
     * Closes the menu when Tab or Escape keys are pressed.
     */
    const handleListKeyDown = useCallback((event: KeyboardEvent) => {
        if (CLOSE_MENU_KEYS.includes(event.key)) {
            if (event.key === "Tab") {
                event.preventDefault();
            }

            dispatch({ type: "closePopupMenu" });
        }
    }, [dispatch]);

    // Determine if the menu can be opened (both conditions must be true)
    const canBeMenuOpened = isMenuOpened && Boolean(menuAnchorEl);

    return {
        handleClick,
        handleClose,
        handleListKeyDown,
        canBeMenuOpened,
    };
}

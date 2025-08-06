import { useCallback, KeyboardEvent, MouseEvent, Dispatch } from "react";
import { GridActions } from "./grid-actions";

/**
 * Interface defining the return type of the usePopper hook.
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

    /**
     * ID for the popper element, used for accessibility.
     * Defined only when menu can be opened.
     */
    popperId: string | undefined;
}

/**
 * Custom hook for managing popper/dropdown menu behavior.
 * 
 * This hook provides functionality to:
 * - Handle clicks on the anchor element to toggle the menu
 * - Close the menu programmatically
 * - Handle keyboard navigation (Tab/Escape to close)
 * - Determine if the menu can be opened based on state
 * - Provide accessibility ID for the popper
 * @param {Dispatch<GridActions>} dispatch - Function to dispatch state changes
 * @param {boolean} isMenuOpened - Current state of whether menu is opened
 * @param {HTMLElement | null} menuAnchorEl - DOM element that anchors the menu
 * @returns {UsePopupMenuResult} Object containing event handlers and menu state
 */
export function usePopupMenu(
    dispatch: Dispatch<GridActions>,
    isMenuOpened: boolean,
    menuAnchorEl: HTMLElement | null
): UsePopupMenuResult {
    /**
     * Handles clicks on the popper anchor element.
     * Toggles the popper menu state and prevents the event from bubbling up.
     * @param {MouseEvent} event - The mouse click event
     */
    const handlePopperAnchorClick = useCallback((event: MouseEvent) => {
        dispatch({ type: "togglePopupMenu", element: event.currentTarget as HTMLElement });
        event.stopPropagation();
    }, [dispatch]);

    /**
     * Closes the popper menu by dispatching the closePopper action.
     */
    const handleClosePopper = useCallback(() => {
        dispatch({ type: "closePopupMenu" });
    }, [dispatch]);

    /**
     * Handles keyboard events on the popper list for accessibility.
     * - Tab key: Prevents default behavior and closes the menu
     * - Escape key: Closes the menu
     * @param {KeyboardEvent} event - The keyboard event
     */
    const handleListKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === "Tab") {
            event.preventDefault();
            dispatch({ type: "closePopupMenu" });
        } else if (event.key === "Escape") {
            dispatch({ type: "closePopupMenu" });
        }
    }, [dispatch]);

    // Determine if the menu can be opened (both conditions must be true)
    const canBeMenuOpened = isMenuOpened && Boolean(menuAnchorEl);

    // Set popper ID for accessibility when menu can be opened
    const popperId = canBeMenuOpened ? "transition-popper" : undefined;

    return {
        handleClick: handlePopperAnchorClick,
        handleClose: handleClosePopper,
        handleListKeyDown,
        canBeMenuOpened,
        popperId,
    };
}

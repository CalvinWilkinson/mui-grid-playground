import { useCallback, KeyboardEvent, MouseEvent } from "react";
import { DemoActions } from "./demo-actions";

export function usePopper(
    dispatch: React.Dispatch<DemoActions>, 
    isMenuOpened: boolean, 
    menuAnchorEl: HTMLElement | null
) {
    const handlePopperAnchorClick = useCallback((event: MouseEvent) => {
        dispatch({ type: "togglePopper", element: event.currentTarget as HTMLElement });
        event.stopPropagation();
    }, [dispatch]);

    const handleClosePopper = useCallback(() => {
        dispatch({ type: "closePopper" });
    }, [dispatch]);

    const handleListKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === "Tab") {
            event.preventDefault();
            dispatch({ type: "closePopper" });
        } else if (event.key === "Escape") {
            dispatch({ type: "closePopper" });
        }
    }, [dispatch]);

    const canBeMenuOpened = isMenuOpened && Boolean(menuAnchorEl);
    const popperId = canBeMenuOpened ? "transition-popper" : undefined;

    return {
        handlePopperAnchorClick,
        handleClosePopper,
        handleListKeyDown,
        canBeMenuOpened,
        popperId,
    };
}

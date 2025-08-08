import { ChangeEvent, ReactNode, RefObject, useEffect } from "react";
import { Button, ClickAwayListener, Fade, MenuList, Paper, Popper } from "@mui/material";
import { Toolbar } from "@mui/x-data-grid";
import { PopupMenuItem } from "./PopupMenuItem";
import { NewGridViewButton } from "./NewGridViewButton";
import { useGridViews } from "./useGridViews";
import { usePopupMenu } from "./usePopupMenu";
import { GridApiCommunity } from "@mui/x-data-grid/internals";

interface GridToolbarProps {
    /**
     * Reference to the MUI Data Grid API.
     * Used to access grid state and methods for managing views.
     */
    apiRef: RefObject<GridApiCommunity | null>;

    /**
     * Unique identifier for this grid instance to maintain independent views
     */
    gridId?: string;

    /**
     * Optional title for the views button
     */
    title?: string;
}

const DEFAULT_PROPS = {
    gridId: "default",
    title: "Custom view"
} as const;

export default function GridToolbar(props: GridToolbarProps): ReactNode {
    const { apiRef: gridApiRef, gridId, title } = { ...DEFAULT_PROPS, ...props };

    const {
        state,
        initView,
        dispatch,
        createNewView,
        handleDeleteView,
        handleSetActiveView,
        isNewViewLabelValid,
    } = useGridViews(gridApiRef);

    const {
        handleClick: handleMenuClick,
        handleClose: handleCloseMenu,
        handleListKeyDown,
        canBeMenuOpened,
    } = usePopupMenu(dispatch, state.isMenuOpened, state.menuAnchorElement);

    const handleNewViewLabelChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setViewLabel", label: event.target.value });
    };

    useEffect(() => {
        initView();
    }, [initView]);

    return (
        <Toolbar>
            <Button
                type="button"
                size="small"
                id={`custom-view-button-${gridId}`}
                aria-controls={state.isMenuOpened ? `custom-view-menu-${gridId}` : undefined}
                aria-expanded={state.isMenuOpened ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}>
                {title} ({Object.keys(state.viewConfigs).length})
            </Button>

            <Popper
                open={canBeMenuOpened}
                anchorEl={state.menuAnchorElement}
                role={undefined}
                transition
                placement="bottom-start"
                sx={{ zIndex: 1300 }}>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleCloseMenu}>
                                <MenuList
                                    id={`custom-view-menu-${gridId}`}
                                    autoFocusItem={state.isMenuOpened}
                                    aria-labelledby={`custom-view-button-${gridId}`}
                                    onKeyDown={handleListKeyDown}>
                                    {Object.entries(state.viewConfigs).map(([viewId, view]) => (
                                        <PopupMenuItem
                                            key={viewId}
                                            view={view}
                                            viewId={viewId}
                                            selected={viewId === state.currentViewId}
                                            onDelete={handleDeleteView}
                                            onSelect={handleSetActiveView} />
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>

            <NewGridViewButton
                label={state.viewName}
                onLabelChange={handleNewViewLabelChange}
                onSubmit={createNewView}
                isValid={isNewViewLabelValid} />
        </Toolbar>
    );
}

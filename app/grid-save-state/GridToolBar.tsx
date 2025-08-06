import { ChangeEvent, ReactNode } from "react";
import { Button, ClickAwayListener, Fade, MenuList, Paper, Popper } from "@mui/material";
import { Toolbar } from "@mui/x-data-grid";
import { PopupMenuItem } from "./PopupMenuItem";
import { NewGridViewButton } from "./NewGridViewButton";
import { useGridViews } from "./useGridViews";
import { usePopupMenu } from "./usePopupMenu";

interface GridToolbarProps {
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
    const { gridId, title } = { ...DEFAULT_PROPS, ...props };

    const {
        state,
        dispatch,
        createNewView,
        handleDeleteView,
        handleSetActiveView,
        isNewViewLabelValid,
    } = useGridViews(gridId);

    const {
        handleClick: handlePopperAnchorClick,
        handleClose: handleClosePopper,
        handleListKeyDown,
        canBeMenuOpened,
        popperId,
    } = usePopupMenu(dispatch, state.isMenuOpened, state.menuAnchorElement);

    const handleNewViewLabelChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setViewLabel", label: event.target.value });
    };

    return (
        <Toolbar>
            <Button
                aria-describedby={popperId}
                type="button"
                size="small"
                id={`custom-view-button-${gridId}`}
                aria-controls={state.isMenuOpened ? `custom-view-menu-${gridId}` : undefined}
                aria-expanded={state.isMenuOpened ? "true" : undefined}
                aria-haspopup="true"
                onClick={handlePopperAnchorClick}>
                {title} ({Object.keys(state.viewConfigs).length})
            </Button>

            <Popper
                id={popperId}
                open={canBeMenuOpened}
                anchorEl={state.menuAnchorElement}
                role={undefined}
                transition
                placement="bottom-start"
                sx={{ zIndex: 1300 }}>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClosePopper}>
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

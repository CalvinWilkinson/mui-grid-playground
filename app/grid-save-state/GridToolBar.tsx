import { ChangeEvent, ReactNode } from "react";
import { Button, ClickAwayListener, Fade, MenuList, Paper, Popper } from "@mui/material";
import { Toolbar } from "@mui/x-data-grid";
import { ViewListItem } from "./ViewListItem";
import { NewViewListButton } from "./NewViewListButton";
import { useGridViews } from "./useGridViews";
import { usePopper } from "./usePopper";


export default function GridToolbar(): ReactNode {
    const {
        state,
        dispatch,
        createNewView,
        handleDeleteView,
        handleSetActiveView,
        isNewViewLabelValid,
    } = useGridViews();

    const {
        handlePopperAnchorClick,
        handleClosePopper,
        handleListKeyDown,
        canBeMenuOpened,
        popperId,
    } = usePopper(dispatch, state.isMenuOpened, state.menuAnchorEl);

    const handleNewViewLabelChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setNewViewLabel", label: event.target.value });
    };

    return (
        <Toolbar>
            <Button
                aria-describedby={popperId}
                type="button"
                size="small"
                id="custom-view-button"
                aria-controls={state.isMenuOpened ? "custom-view-menu" : undefined}
                aria-expanded={state.isMenuOpened ? "true" : undefined}
                aria-haspopup="true"
                onClick={handlePopperAnchorClick}>
                Custom view ({Object.keys(state.views).length})
            </Button>

            <Popper
                id={popperId}
                open={canBeMenuOpened}
                anchorEl={state.menuAnchorEl}
                role={undefined}
                transition
                placement="bottom-start"
                sx={{ zIndex: 1300 }}>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClosePopper}>
                                <MenuList
                                    id="custom-view-menu"
                                    autoFocusItem={state.isMenuOpened}
                                    aria-labelledby="custom-view-button"
                                    onKeyDown={handleListKeyDown}>
                                    {Object.entries(state.views).map(([viewId, view]) => (
                                        <ViewListItem
                                            key={viewId}
                                            view={view}
                                            viewId={viewId}
                                            selected={viewId === state.activeViewId}
                                            onDelete={handleDeleteView}
                                            onSelect={handleSetActiveView} />
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>

            <NewViewListButton
                label={state.newViewLabel}
                onLabelChange={handleNewViewLabelChange}
                onSubmit={createNewView}
                isValid={isNewViewLabelValid} />
        </Toolbar>
    );
}

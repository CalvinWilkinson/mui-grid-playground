import { ChangeEvent, ReactNode, useCallback, useMemo, useReducer, MouseEvent, KeyboardEvent, Reducer, Fragment, useState, FormEventHandler } from "react";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Fade, IconButton, MenuItem, MenuList, Paper, Popper, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Toolbar, useGridApiContext } from "@mui/x-data-grid";
import { StateView } from "./state-view";
import { DemoState } from "./demo-state";
import { DemoActions } from "./demo-actions";


function ViewListItem(props: {
    view: StateView;
    viewId: string;
    selected: boolean;
    onDelete: (viewId: string) => void;
    onSelect: (viewId: string) => void;
}): ReactNode {
    console.log("ViewListItem Invoked");
    const { view, viewId, selected, onDelete, onSelect, ...other } = props;

    return (
        <MenuItem selected={selected} onClick={() => onSelect(viewId)} {...other}>
            {view.label}
            <IconButton
                edge="end"
                aria-label="delete"
                size="small"
                onClick={(event) => {
                    event.stopPropagation();
                    onDelete(viewId);
                }}>
                <DeleteIcon />
            </IconButton>
        </MenuItem>
    );
}

function NewViewListButton(props: {
    label: string;
    onLabelChange: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    onSubmit: () => void;
    isValid: boolean;
}): ReactNode {
    const { label, onLabelChange, onSubmit, isValid } = props;
    const [isAddingView, setIsAddingView] = useState(false);

    const handleSubmitForm: FormEventHandler = (event) => {
        onSubmit();
        setIsAddingView(false);
        event.preventDefault();
    };

    return (
        <Fragment>
            <Button
                endIcon={<AddIcon />}
                size="small"
                onClick={() => setIsAddingView(true)}>
                Save current view
            </Button>

            <Dialog onClose={() => setIsAddingView(false)} open={isAddingView}>
                <form onSubmit={handleSubmitForm}>
                    <DialogTitle>New custom view</DialogTitle>

                    <DialogContent>
                        <TextField
                            autoFocus
                            value={label}
                            onChange={onLabelChange}
                            margin="dense"
                            size="small"
                            label="Custom view label"
                            variant="standard"
                            fullWidth/>
                    </DialogContent>

                    <DialogActions>
                        <Button type="button" onClick={() => setIsAddingView(false)}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={!isValid}>
                            Create view
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Fragment>
    );
}

const demoReducer: Reducer<DemoState, DemoActions> = (state: DemoState, action: DemoActions) => {
    switch (action.type) {
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

        case "setActiveView": {
            return {
                ...state,
                activeViewId: action.id,
                isMenuOpened: false,
            };
        }

        case "setNewViewLabel": {
            return {
                ...state,
                newViewLabel: action.label,
            };
        }

        case "togglePopper": {
            return {
                ...state,
                isMenuOpened: !state.isMenuOpened,
                menuAnchorEl: action.element,
            };
        }

        case "closePopper": {
            return {
                ...state,
                isMenuOpened: false,
            };
        }

        default: {
            return state;
        }
    }
};

const DEMO_INITIAL_STATE: DemoState = {
    views: {},
    newViewLabel: "",
    isMenuOpened: false,
    menuAnchorEl: null,
    activeViewId: null,
};

export default function CustomToolbar(): ReactNode {
    const apiRef = useGridApiContext();
    const [state, dispatch] = useReducer(demoReducer, DEMO_INITIAL_STATE);

    const createNewView = () => {
        dispatch({
            type: "createView",
            value: apiRef.current.exportState(),
        });
    };

    const handleNewViewLabelChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        dispatch({ type: "setNewViewLabel", label: event.target.value });
    };

    const handleDeleteView = useCallback((viewId: string) => {
        dispatch({ type: "deleteView", id: viewId });
    }, []);

    const handleSetActiveView = (viewId: string) => {
        apiRef.current.restoreState(state.views[viewId].value);
        dispatch({ type: "setActiveView", id: viewId });
    };

    const handlePopperAnchorClick = (event: MouseEvent) => {
        console.log("Button clicked, current state:", state);
        dispatch({ type: "togglePopper", element: event.currentTarget as HTMLElement });
        event.stopPropagation();
    };

    const handleClosePopper = () => {
        dispatch({ type: "closePopper" });
    };

    const isNewViewLabelValid = useMemo(() => {
        if (state.newViewLabel.length === 0) {
            return false;
        }

        return Object.values(state.views).every(
            (view) => view.label !== state.newViewLabel,
        );
    }, [state.views, state.newViewLabel]);

    const canBeMenuOpened = state.isMenuOpened && Boolean(state.menuAnchorEl);
    const popperId = canBeMenuOpened ? "transition-popper" : undefined;

    console.log("Render state:", {
        isMenuOpened: state.isMenuOpened,
        menuAnchorEl: state.menuAnchorEl,
        canBeMenuOpened,
        viewsCount: Object.keys(state.views).length
    });

    const handleListKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
            event.preventDefault();
            dispatch({ type: "closePopper" });
        } else if (event.key === "Escape") {
            dispatch({ type: "closePopper" });
        }
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
                                    {Object.entries(state.views).map(([viewId, view]) => {
                                        console.log("Rendering view item:", viewId, view);
                                        return (
                                            <ViewListItem
                                                key={viewId}
                                                view={view}
                                                viewId={viewId}
                                                selected={viewId === state.activeViewId}
                                                onDelete={handleDeleteView}
                                                onSelect={handleSetActiveView} />
                                        );
                                    })}
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

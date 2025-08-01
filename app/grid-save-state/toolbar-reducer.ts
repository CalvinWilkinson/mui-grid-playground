import { Reducer } from "react";
import { DemoState } from "./demo-state";
import { DemoActions } from "./demo-actions";

export const toolbarReducer: Reducer<DemoState, DemoActions> = (state: DemoState, action: DemoActions) => {
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

export const INITIAL_STATE: DemoState = {
    views: {},
    newViewLabel: "",
    isMenuOpened: false,
    menuAnchorEl: null,
    activeViewId: null,
};

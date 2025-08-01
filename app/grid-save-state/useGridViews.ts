import { useCallback, useMemo, useReducer } from "react";
import { useGridApiContext } from "@mui/x-data-grid";
import { toolbarReducer, INITIAL_STATE } from "./toolbar-reducer";
import { DemoActions } from "./demo-actions";

export function useGridViews() {
    const apiRef = useGridApiContext();
    const [state, dispatch] = useReducer(toolbarReducer, INITIAL_STATE);

    const createNewView = useCallback(() => {
        dispatch({
            type: "createView",
            value: apiRef.current.exportState(),
        });
    }, [apiRef]);

    const handleDeleteView = useCallback((viewId: string) => {
        dispatch({ type: "deleteView", id: viewId });
    }, []);

    const handleSetActiveView = useCallback((viewId: string) => {
        apiRef.current.restoreState(state.views[viewId].value);
        dispatch({ type: "setActiveView", id: viewId });
    }, [apiRef, state.views]);

    const isNewViewLabelValid = useMemo(() => {
        if (state.newViewLabel.length === 0) return false;
        return Object.values(state.views).every((view) => view.label !== state.newViewLabel);
    }, [state.views, state.newViewLabel]);

    return {
        state,
        dispatch: dispatch as React.Dispatch<DemoActions>,
        createNewView,
        handleDeleteView,
        handleSetActiveView,
        isNewViewLabelValid,
    };
}

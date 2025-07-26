import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useDemoData } from "@mui/x-data-grid-generator";
import {
    GridInitialState,
    DataGrid,
    useGridApiRef,
} from "@mui/x-data-grid";
import { useCallback, useLayoutEffect, useState } from "react";

export default function SaveAndRestoreStorageGrid() {
    const apiRef = useGridApiRef();
    const { data, loading } = useDemoData({
        dataSet: "Commodity",
        rowLength: 100,
        maxColumns: 10,
    });

    const [initialState, setInitialState] = useState<GridInitialState>();

    const saveSnapshot = useCallback(() => {
        if (apiRef?.current?.exportState && localStorage) {
            const currentState = apiRef.current.exportState();
            localStorage.setItem("dataGridState", JSON.stringify(currentState));
        }
    }, [apiRef]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect called");
        const stateFromLocalStorage = localStorage?.getItem("dataGridState");
        setInitialState(stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {});

        // handle refresh and navigating away/refreshing
        window.addEventListener("beforeunload", saveSnapshot);

        return () => {
            // in case of an SPA remove the event-listener
            window.removeEventListener("beforeunload", saveSnapshot);
            saveSnapshot();
        };
    }, [saveSnapshot]);

    if (!initialState) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ height: 300, width: "100%" }}>
            <DataGrid
                {...data}
                apiRef={apiRef}
                loading={loading}
                initialState={{
                    ...data.initialState,
                    ...initialState,
                }}
            />
        </Box>
    );
}

import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useDemoData } from "@mui/x-data-grid-generator";
import {
    GridInitialState,
    DataGrid,
    useGridApiRef,
} from "@mui/x-data-grid";
import { useCallback, useLayoutEffect, useState } from "react";
import GridToolbar from "./grid-save-state/GridToolBar";
import { INITIAL_STATE } from "./grid-save-state/grid-toolbar-reducer";

export default function SaveAndRestoreStorageGrid() {
    const customerApiRef = useGridApiRef();

    const { data, loading } = useDemoData({
        dataSet: "Commodity",
        rowLength: 100,
        maxColumns: 10,
    });

    const [initialState, setInitialState] = useState<GridInitialState>();

    // const saveSnapshot = useCallback(() => {
    //     if (customerApiRef?.current?.exportState && localStorage) {
    //         const currentState = customerApiRef.current.exportState();
    //         localStorage.setItem("dataGridState", JSON.stringify(currentState));
    //     }
    // }, [customerApiRef]);

    // useLayoutEffect(() => {
    //     console.log("useLayoutEffect called");
    // }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Stack spacing={4} sx={{ height: "100vh", width: "100%", p: 2 }}>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Customers Grid (Commodity Data)
                </Typography>
                <Box sx={{ height: 400, width: "100%" }}>
                    <DataGrid
                        {...data}
                        showToolbar={true}
                        loading={loading}
                        apiRef={customerApiRef}
                        slots={{
                            toolbar: () => (
                                <GridToolbar apiRef={customerApiRef} gridId="customers" title="Customer Views" />
                            )
                        }}
                        initialState={{
                            ...data.initialState,
                            ...initialState,
                        }}
                    />
                </Box>
            </Box>
        </Stack>
    );
}

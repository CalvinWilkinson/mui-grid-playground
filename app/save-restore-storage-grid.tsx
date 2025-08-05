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

export default function SaveAndRestoreStorageGrid() {
    const customerApiRef = useGridApiRef();
    const orderApiRef = useGridApiRef();

    const { data, loading } = useDemoData({
        dataSet: "Commodity",
        rowLength: 100,
        maxColumns: 10,
    });

    // Second dataset for the orders grid
    const { data: ordersData, loading: ordersLoading } = useDemoData({
        dataSet: "Employee",
        rowLength: 50,
        maxColumns: 8,
    });

    const [initialState, setInitialState] = useState<GridInitialState>();

    const saveSnapshot = useCallback(() => {
        if (customerApiRef?.current?.exportState && localStorage) {
            const currentState = customerApiRef.current.exportState();
            localStorage.setItem("dataGridState", JSON.stringify(currentState));
        }
    }, [customerApiRef]);

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

    if (!initialState || loading || ordersLoading) {
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
                        slots={{ toolbar: () => (
                            <GridToolbar gridId="customers" title="Customer Views" />
                        )}}
                        initialState={{
                            ...data.initialState,
                            ...initialState,
                        }}
                    />
                </Box>
            </Box>

            <Box>
                <Typography variant="h6" gutterBottom>
                    Orders Grid (Employee Data)
                </Typography>
                <Box sx={{ height: 400, width: "100%" }}>
                    <DataGrid
                        {...ordersData}
                        showToolbar={true}
                        loading={ordersLoading}
                        apiRef={orderApiRef}
                        slots={{ toolbar: () => (
                            <GridToolbar gridId="orders" title="Order Views" />
                        )}}
                        initialState={ordersData.initialState}
                    />
                </Box>
            </Box>
        </Stack>
    );
}

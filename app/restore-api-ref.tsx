import { ReactNode } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import Box from "@mui/material/Box";
import GridToolbar from "./grid-save-state/GridToolBar";

export default function RestoreApiRef(): ReactNode {
    const apiRef = useGridApiRef();
    const { data, loading } = useDemoData({
        dataSet: "Commodity",
        rowLength: 500,
    });

    return (
        <Box sx={{ width: "100%", height: 400 }}>
            <DataGrid
                slots={{ toolbar: GridToolbar }}
                showToolbar={true}
                loading={loading}
                apiRef={apiRef}
                pagination
                {...data}/>
        </Box>
    );
}

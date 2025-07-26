"use client";

import { useCallback, useState, MouseEvent } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import {
    DataGrid,
    FilterPanelTrigger,
    GridDensity,
    GridInitialState,
    GridSlotProps,
    Toolbar,
    useGridApiContext,
    useGridRootProps,
} from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides {
        syncState: (stateToSave: GridInitialState) => void;
        density: GridDensity;
        onDensityChange: (newDensity: GridDensity) => void;
    }
}

function GridCustomToolbar({ syncState, density, onDensityChange }: GridSlotProps["toolbar"]) {
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleDensityClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDensityClose = () => {
        setAnchorEl(null);
    };

    const handleDensitySelect = (newDensity: GridDensity) => {
        onDensityChange(newDensity);
        handleDensityClose();
    };

    const densityLabels: Record<GridDensity, string> = {
        compact: "Compact",
        standard: "Standard",
        comfortable: "Comfortable"
    };

    return (
        <Toolbar>
            <FilterPanelTrigger />
            <Button
                size="small"
                startIcon={<rootProps.slots.columnSelectorIcon />}
                onClick={() => syncState(apiRef.current.exportState())}
                {...rootProps.slotProps?.baseButton}>
                Recreate the 2nd grid
            </Button>

            <Tooltip title="Density">
                <Button
                    size="small"
                    onClick={handleDensityClick}
                    sx={{ ml: 1 }}
                    {...rootProps.slotProps?.baseButton}>
                    Density: {densityLabels[density]}
                </Button>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleDensityClose}
                slotProps={{ list: { "aria-labelledby": "density-button" } }}>
                {Object.entries(densityLabels).map(([densityValue, label]) => (
                    <MenuItem
                        key={densityValue}
                        onClick={() => handleDensitySelect(densityValue as GridDensity)}
                        selected={density === densityValue}>
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </Toolbar>
    );
}

export default function SaveRestoreGrid() {
    const [density, setDensity] = useState<GridDensity>("compact");
    const { data, loading } = useDemoData({
        dataSet: "Commodity",
        rowLength: 100,
        maxColumns: 6,
    });

    const [savedState, setSavedState] = useState<{
        count: number;
        initialState: GridInitialState;
    }>({ count: 0, initialState: data.initialState! });

    const syncState = useCallback((newInitialState: GridInitialState) => {
        setSavedState((prev) => ({
            count: prev.count + 1,
            initialState: newInitialState,
        }));
    }, []);

    return (
        <Stack spacing={2} sx={{ width: "100%" }}>
            <Box sx={{ height: 336 }}>
                <DataGrid
                    {...data}
                    density={density}
                    onDensityChange={(newDensity) => setDensity(newDensity)}
                    loading={loading}
                    slots={{ toolbar: GridCustomToolbar }}
                    slotProps={{ toolbar: { syncState, density, onDensityChange: setDensity } }}
                    showToolbar/>
            </Box>
            <Box sx={{ height: 300 }}>
                <DataGrid
                    {...data}
                    loading={loading}
                    initialState={savedState.initialState}
                    key={savedState.count}/>
            </Box>
        </Stack>
    );
}

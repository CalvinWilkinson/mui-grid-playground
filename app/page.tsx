"use client";

import SaveAndRestoreStorageGrid from "./save-restore-storage-grid";
import { Stack } from "@mui/material";

export default function Home() {
    return (
        <Stack direction="column">
            <SaveAndRestoreStorageGrid />
            {/* <RestoreApiRef /> */}
            {/* <SaveRestoreGrid /> */}
        </Stack>
    );
}

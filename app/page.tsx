"use client";

import Image from "next/image";
import SaveRestoreGrid from "./save-restore-grid";
import SaveAndRestoreStorageGrid from "./save-restore-storage-grid";
import RestoreApiRef from "./restore-api-ref";
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

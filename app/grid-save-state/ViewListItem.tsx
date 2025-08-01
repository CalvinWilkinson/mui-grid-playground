import { ReactNode } from "react";
import { IconButton, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { StateView } from "./state-view";

interface ViewListItemProps {
    view: StateView;
    viewId: string;
    selected: boolean;
    onDelete: (viewId: string) => void;
    onSelect: (viewId: string) => void;
}

export function ViewListItem(props: ViewListItemProps): ReactNode {
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

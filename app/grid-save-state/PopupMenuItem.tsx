import { ReactNode } from "react";
import { IconButton, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { StateView } from "./state-view";

/**
 * Props for the PopupMenuItem component.
 * Defines the interface for a single menu item in the view selector popup.
 */
interface PopupMenuItemProps {
    /** 
     * The view data containing label and grid state configuration.
     */
    view: StateView;

    /** 
     * Unique identifier for this view.
     */
    viewId: string;

    /** 
     * Whether this menu item is currently selected/active.
     */
    selected: boolean;

    /** 
     * Callback function called when the delete button is clicked.
     */
    onDelete: (viewId: string) => void;

    /** 
     * Callback function called when the menu item is selected.
     */
    onSelect: (viewId: string) => void;
}

/**
 * A menu item component for the view selector popup.
 * Renders a clickable menu item that displays a saved view's label
 * and provides a delete button for removing the view.
 * 
 * Features:
 * - Displays the view label as the main content
 * - Shows visual indication when selected
 * - Includes a delete button with proper event handling
 * - Prevents event bubbling when delete button is clicked
 * 
 * @param props - The component props
 * @returns A ReactNode representing the menu item
 */
export function PopupMenuItem(props: PopupMenuItemProps): ReactNode {
    const { view, viewId, selected, onDelete, onSelect, ...other } = props;

    return (
        <MenuItem selected={selected} onClick={() => onSelect(viewId)} {...other}>
            {view.label}
            {/* Delete Button */}
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

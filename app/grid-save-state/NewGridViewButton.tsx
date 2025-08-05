import { ChangeEvent, Fragment, ReactNode, useState, FormEventHandler } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/**
 * Props for the {@link NewGridViewButton} component.
 */
interface NewGridViewButtonProps {
    /**
     * The current value of the new view label input field.
     */
    label: string;
    
    /**
     * Handler function called when the label input value changes.
     */
    onLabelChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    
    /**
     * Handler function called when the form is submitted to create a new view.
     */
    onSubmit: () => void;
    
    /**
     * Boolean indicating whether the current label is valid for creating a new view.
     */
    isValid: boolean;
}

/**
 * A component that renders a button to save the current grid view state.
 * When clicked, it opens a dialog where users can enter a label for the new view.
 * The component handles the dialog state and form submission internally.
 * @param {NewGridViewButtonProps} props - The component props
 * @returns {ReactNode} The rendered button and dialog components
 */
export function NewGridViewButton(props: NewGridViewButtonProps): ReactNode {
    const { label, onLabelChange, onSubmit, isValid } = props;
    
    /**
     * Local state to control whether the "Add View" dialog is currently open.
     */
    const [isAddingView, setIsAddingView] = useState(false);

    /**
     * Handles form submission for creating a new view.
     * Calls the onSubmit callback, closes the dialog, and prevents default form submission.
     * @param {FormEvent} event - The form submission event
     */
    const handleSubmitForm: FormEventHandler = (event) => {
        onSubmit();
        setIsAddingView(false);
        event.preventDefault();
    };

    return (
        <Fragment>
            {/* 
             * Main button that triggers the "Add View" dialog.
             * Displays an add icon and descriptive text.
             */}
            <Button
                endIcon={<AddIcon />}
                size="small"
                onClick={() => setIsAddingView(true)}>
                Save current view
            </Button>

            {/* 
             * Dialog for creating a new view with a custom label.
             * Contains a form with text input and action buttons.
             */}
            <Dialog onClose={() => setIsAddingView(false)} open={isAddingView}>
                <form onSubmit={handleSubmitForm}>
                    <DialogTitle>New custom view</DialogTitle>

                    <DialogContent>
                        {/* 
                         * Text input field for entering the new view label.
                         * Auto-focused when dialog opens and controlled by parent component.
                         */}
                        <TextField
                            autoFocus
                            value={label}
                            onChange={onLabelChange}
                            margin="dense"
                            size="small"
                            label="Custom view label"
                            variant="standard"
                            fullWidth/>
                    </DialogContent>

                    <DialogActions>
                        {/* CANCEL BUTTON */}
                        <Button type="button" onClick={() => setIsAddingView(false)}>
                            Cancel
                        </Button>

                        {/* CREATE VIEW BUTTON */}
                        <Button type="submit" disabled={!isValid}>
                            Create view
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Fragment>
    );
}

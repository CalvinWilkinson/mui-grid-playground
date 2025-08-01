import { ChangeEvent, Fragment, ReactNode, useState, FormEventHandler } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface NewViewListButtonProps {
    label: string;
    onLabelChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    isValid: boolean;
}

export function NewViewListButton(props: NewViewListButtonProps): ReactNode {
    const { label, onLabelChange, onSubmit, isValid } = props;
    const [isAddingView, setIsAddingView] = useState(false);

    const handleSubmitForm: FormEventHandler = (event) => {
        onSubmit();
        setIsAddingView(false);
        event.preventDefault();
    };

    return (
        <Fragment>
            <Button
                endIcon={<AddIcon />}
                size="small"
                onClick={() => setIsAddingView(true)}>
                Save current view
            </Button>

            <Dialog onClose={() => setIsAddingView(false)} open={isAddingView}>
                <form onSubmit={handleSubmitForm}>
                    <DialogTitle>New custom view</DialogTitle>

                    <DialogContent>
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
                        <Button type="button" onClick={() => setIsAddingView(false)}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={!isValid}>
                            Create view
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Fragment>
    );
}

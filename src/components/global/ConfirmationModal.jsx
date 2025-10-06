import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

export default function ConfirmationModal({
    title,
    isOpen,
    onClose,
    primaryText,
    isSuccessColor,
    secondaryText,
    primaryAction,
    secondaryAction,
    content
}) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={secondaryAction} color="inherit">
                    {secondaryText}
                </Button>
                <Button
                    onClick={primaryAction}
                    color={isSuccessColor ? "success" : "error"}
                    variant="contained"
                >
                    {primaryText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

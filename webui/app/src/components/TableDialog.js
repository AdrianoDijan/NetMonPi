import React from 'react';
import DeviceTable from './DeviceTable'
import { Dialog, DialogTitle, DialogContent, Container, DialogActions, Button } from '@material-ui/core';


class TableDialog extends React.Component {
    render() {
        return (
            <Dialog
                fullWidth={this.props.fullWidth}
                maxWidth={this.props.maxWidth}
                open={this.props.open}
                onClose={this.props.handleClose}
                aria-labelledby="max-width-dialog-title"
                scroll="body"
            >
                <DialogTitle id="max-width-dialog-title">Online uređaji</DialogTitle>
                <DialogContent>
                    <Container maxWidth={'xl'}>
                    <DeviceTable />
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Zatvori
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default TableDialog;
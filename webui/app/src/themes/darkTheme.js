import { unstable_createMuiStrictModeTheme as createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

export default function darkTheme() {
    return (
        responsiveFontSizes(
            createMuiTheme(
                {
                    palette: {
                        primary: {
                            main: '#2a8bf4',
                            chartTitle: '#43464a',
                            chartText: '#5a5b5c'
                        },
                        text: {
                            primary: "#d3d7db"
                        },
                        background: {
                            default: "#1f1e2e",
                            paper: "#28293d"
                        },
                        secondary: {
                            main: '#f57f17',
                        },
                    },
                    root: {
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        minHeight: "100vh",
                        left: 0,
                        top: 0,
                        zIndex: 10,
                    },
                    body: {
                        overflow: "hidden"
                    },
                    menuButton: {
                        marginRight: 36,
                    },
                    menuButtonHidden: {
                        display: 'none',
                    },
                    title: {
                        flexGrow: 1,
                    },
                    content: {
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    },
                    paper: {
                        display: 'flex',
                        overflow: 'auto',
                        flexDirection: 'column',
                    },
                    fixedHeight: {
                        height: 240,
                    },
                    typography: {
                        fontFamily: [
                            'Poppins',
                            'Roboto',
                            '"Helvetica Neue"',
                            'Arial',
                            'sans-serif'
                        ].join(','),
                    },
                    card: {
                        background: "rgb(70, 0, 0)",
                    },
                    page: {
                        backgroundColor: "rgb(70,80,90)"
                    },
                    table: {
                        border: "none",
                    },
                    overrides: {
                        MuiDataGrid: {
                            root: {
                                border: "none",
                                '& .MuiDataGrid-columnSeparator': {
                                    color: "rgba(0,0,0,0)",
                                },
                                '& .MuiDataGrid-sortIcon': {
                                    color: "#d3d7db",
                                },
                                '& .MuiDataGrid-row': {
                                    cursor: "pointer"
                                }
                            },
                        },
                    }
                }
            ))
    );
}
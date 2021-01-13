import { unstable_createMuiStrictModeTheme as createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

export default function darkTheme() {
    return (
        responsiveFontSizes(
            createMuiTheme(
                {
                    palette: {
                        primary: {
                            main: '#2a8bf4',
                            chartTitle: '#fafafa',
                            chartText: '#f2f2f2'
                        },
                        text: {
                            primary: "#1f1e2e"
                        },
                        background: {
                            default: "#fafafa",
                            paper: "#f2f2f2"
                        },
                        secondary: {
                            main: '#f57f17',
                        },
                    },
                    root: {
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        zIndex: 10,
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
                                    color: "#1f1e2e",
                                },
                                '& .MuiDataGrid-menuIconButton': {
                                    color: "#1f1e2e",
                                },
                                '& .MuiDataGrid-row': {
                                    cursor: "pointer"
                                },
                                '& .MuiFormControl-root': {
                                    color: "#1f1e2e"
                                },
                                '& .MuiDataGrid-colCellTitleContainer': {
                                    '& .MuiIconButton-root': {
                                        color: "#1f1e2e",
                                    },
                                },
                            },
                        },
                        MuiDataGridFilterForm: {
                            root: {
                                '& .MuiFormLabel-root': {
                                    color: "#d3d7db",
                                },
                                '& .MuiIconButton-root': {
                                    color: "#d3d7db",
                                },
                                '& .MuiSelect-icon': {
                                    color: "#d3d7db",
                                }
                            }
                        },
                    },
                }
            ))
    );
}
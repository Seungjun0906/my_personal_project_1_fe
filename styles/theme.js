import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
    components: {
        MuiTableCell: {
            defaultProps: {
                size: "small",
                align: "center",
                padding: "none",
                sx: {
                    fontSize: "12px",
                },
            },
        },
        MuiInputBase: {
            defaultProps: {
                sx: {
                    fontSize: 12,
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                variants: [
                    {
                        props: { variant: "body2" },
                        sx: {
                            fontSize: 12,
                        },
                    },
                ],
            },
        },
        MuiChip: {
            defaultProps: {
                padding: "none",
                sx: {
                    fontSize: "12px",
                    padding: "4px 4px 4px 4px",
                    borderRadius: "4px",
                    height: "20px",
                },
            },
        },
        MuiButton: {
            defaultProps: {
                sx: {
                    paddingX: "8px",
                },
            },
        },
    },
    breakpoints: {
        values: {
            xl: 1920,
        },
    },
});

export default theme;

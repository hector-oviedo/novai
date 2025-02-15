import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Typography, Box } from "@mui/material";

export const AuthLayout = ({ children, title }) => {
  const theme = useTheme();
  
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 4,
      }}
    >
      <Box
        sx={{
          width: { sm: 400 },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography textAlign="center" variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {children}
      </Box>
    </Grid>
  );
};

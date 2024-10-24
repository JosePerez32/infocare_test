import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      gap={2}
    >
      <Typography variant="h3" color="error">
        Access Denied
      </Typography>
      <Typography variant="h6">
        You don't have permission to access this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;
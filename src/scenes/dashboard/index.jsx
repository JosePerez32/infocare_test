import { useEffect } from "react";
import { Box, useTheme, Typography, Card, CardContent, CardHeader } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import HandshakeIcon from '@mui/icons-material/Handshake';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const Dashboard = ({ accessToken }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const t = localStorage.getItem('accessToken');
      if (t) {
        try {
          const response = await fetch(process.env.REACT_APP_API_URL + '/userinfo', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`, // Use the access token
            },
          });
          const data = await response.json();
          console.log("User Info:", data);

          // Store organization in localStorage
          if (data.organisation) {
            localStorage.setItem('organization', data.organisation);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="INFOCARE" subtitle="Welcome to Infocare" />
      </Box>
      
      {/* ROW 1: Logo Section */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="300px" // Increased height for better visibility
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: "10px",
          boxShadow: 3,
          marginY: "20px", // Added margin for spacing
        }}
      >
        <img 
          src="./assets/infoCare_Logo_v2.png" 
          alt="Logo" 
          style={{ maxHeight: "80%", maxWidth: "80%", objectFit: "contain" }} 
        />
      </Box>

      {/* ROW 2: Cards Section */}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Card sx={{ bgcolor: colors.primary[400], borderRadius: "10px", boxShadow: 2 }}>
          <CardHeader 
            title={
              <Box display="flex" alignItems="center">
                <HandshakeIcon sx={{ mr: 1, color: colors.grey[100] }} />
                Sustainable Partnership
              </Box>
            }
            sx={{ textAlign: "center", fontWeight: 'bold', color: colors.grey[100] }} 
          />
          <CardContent>
            <Typography variant="body2" color={colors.grey[200]}>
              We prioritize creating enduring bonds with both our clients and employees. Our vision is rooted in executing transformative projects that not only challenge the norm but also provide sustained value to our clients. We believe in growth, and our approach ensures that both our clients and employees grow alongside us.
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: colors.primary[400], borderRadius: "10px", boxShadow: 2 }}>
          <CardHeader 
            title={
              <Box display="flex" alignItems="center">
                <AutoAwesomeIcon sx={{ mr: 1, color: colors.grey[100] }} />
                Mastery in Innovation
              </Box>
            }
            sx={{ textAlign: "center", fontWeight: 'bold', color: colors.grey[100] }} 
          />
          <CardContent>
            <Typography variant="body2" color={colors.grey[200]}>
              Our edge lies in our expertise in cutting-edge technologies. We don't just follow technological trends; we master them, ensuring our clients and employees benefit from the very forefront of technological advancements. Through continuous education, collaboration, and undivided focus, we ensure that we remain a beacon of innovation in our field.
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: colors.primary[400], borderRadius: "10px", boxShadow: 2 }}>
          <CardHeader 
            title={
              <Box display="flex" alignItems="center">
                <MoreTimeIcon sx={{ mr: 1, color: colors.grey[100] }} />
                Beyond the Clock Commitment
              </Box>
            }
            sx={{ textAlign: "center", fontWeight: 'bold', color: colors.grey[100] }} 
          />
          <CardContent>
            <Typography variant="body2" color={colors.grey[200]}>
              We go beyond the constraints of traditional working hours. We don't endorse a mere 9 to 5 mindset; we champion ownership, flexibility, and unwavering dedication. Our team is always ready, ensuring that we meet client needs while also fostering an environment where our employees can flourish without feeling confined.
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
    </Box>
  );
};

export default Dashboard;

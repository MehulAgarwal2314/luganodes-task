import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import CustomizedTables from './transactions/Table.jsx';
import { styled } from '@mui/material/styles';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Custom styling for the container
const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3c72 10%, #2a5298 100%)',
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  minHeight: '100vh',
}));

// Title styling
const Title = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: '2rem',
  color: '#ffffff',
  letterSpacing: '0.1rem',
  textTransform: 'uppercase',
  textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

// Custom footer styles
const Footer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: '#ffffff',
  padding: theme.spacing(3),
  borderTop: '1px solid rgba(255, 255, 255, 0.3)',
  '& svg': {
    color: '#ffffff',
    marginRight: theme.spacing(1),
  },
}));

// Main App component
function App() {
  return (
    <StyledContainer maxWidth="md">
      <Box className="title" mt={4} mb={4} textAlign="center">
        <Title variant="h4" component="h1">
          Ethereum Deposit Tracker by Mehul Agarwal
        </Title>
        <Typography variant="subtitle1" style={{ color: '#ffffff' }}>
          Stay updated with the latest Ethereum transactions in real-time.
        </Typography>
      </Box>

      {/* Table Section */}
      <Box className="tables" mb={4}>
        <CustomizedTables />
      </Box>

      {/* Footer */}
      <Footer>
        <Typography variant="body2">
          Copyright - 21BEC0961
        </Typography>
        <Box mt={2}>
          <a href="https://github.com/mehul-agarwal" target="_blank" rel="noopener noreferrer">
            {/* <GitHubIcon /> */}
          </a>
          <a href="https://www.linkedin.com/in/mehul-agarwal" target="_blank" rel="noopener noreferrer">
            {/* <LinkedInIcon /> */}
          </a>
        </Box>
      </Footer>
    </StyledContainer>
  );
}

export default App;

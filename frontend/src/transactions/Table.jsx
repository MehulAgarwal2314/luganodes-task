import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';

// Define custom animation for hovering on rows
const hoverEffect = keyframes`
  0% { background-color: transparent; }
  100% { background-color: rgba(0, 150, 136, 0.2); }
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [&.${tableCellClasses.head}]: {
        background: 'linear-gradient(45deg, #1e88e5 30%, #43a047 90%)',
        color: theme.palette.common.white,
        fontWeight: 'bold',
        letterSpacing: '0.1rem',
    },
    [&.${tableCellClasses.body}]: {
        fontSize: 16,
        color: theme.palette.text.primary,
        transition: 'background-color 0.3s ease',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        animation: ${hoverEffect} 0.5s forwards,
    },
    transition: 'background-color 0.3s ease',
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function CustomizedTables() {
    const [depositData, setDepositData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDeposits = () => {
            setLoading(true);
            axios.get('http://localhost:3001/track/deposits')
                .then(response => {
                    setDepositData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("There was an error fetching the data!", error);
                    setLoading(false);
                });
        };

        fetchDeposits();
        const intervalId = setInterval(fetchDeposits, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Card
            variant="elevation"
            sx={{ maxWidth: '100%', mt: 4, borderRadius: 3, boxShadow: '0px 10px 30px rgba(0,0,0,0.1)' }}
        >
            <CardContent>
                <Typography
                    variant="h4"
                    component="div"
                    gutterBottom
                    align="center"
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: '500',
                        letterSpacing: '0.15rem',
                        color: '#333',
                    }}
                >
                    Ethereum Deposit Tracker
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 2, fontStyle: 'italic' }}
                    >
                        Polling every 5 minutes
                    </Typography>
                )}

                <TableContainer
                    component={Paper}
                    sx={{ mt: 3, borderRadius: '12px', overflow: 'hidden' }}
                >
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Block Number</StyledTableCell>
                                <StyledTableCell align="right">Block Timestamp</StyledTableCell>
                                <StyledTableCell align="right">Fee</StyledTableCell>
                                <StyledTableCell align="right">Hash</StyledTableCell>
                                <StyledTableCell align="right">Pubkey</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {depositData.map((deposit) => (
                                <StyledTableRow key={deposit.hash}>
                                    <StyledTableCell component="th" scope="row">
                                        {deposit.blockNumber}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{deposit.blockTimestamp}</StyledTableCell>
                                    <StyledTableCell align="right">{deposit.fee}</StyledTableCell>
                                    <StyledTableCell align="right">{deposit.hash}</StyledTableCell>
                                    <StyledTableCell align="right">{deposit.pubkey}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}

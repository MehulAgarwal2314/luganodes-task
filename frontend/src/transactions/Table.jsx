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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function CustomizedTables() {
    const [depositData, setDepositData] = useState([]);
    const [loading, setLoading] = useState(false);  // Add a loading state

    useEffect(() => {
        // Function to fetch deposit data
        const fetchDeposits = () => {
            setLoading(true); // Set loading to true before fetching
            axios.get('http://localhost:3001/track/deposits')
                .then(response => {
                    setDepositData(response.data);
                    setLoading(false); // Set loading to false after data is fetched
                })
                .catch(error => {
                    console.error("There was an error fetching the data!", error);
                    setLoading(false); // Set loading to false if there's an error
                });
        };

        // Initial fetch when the component mounts
        fetchDeposits();

        // Setting up interval to fetch data every 3 seconds
        const intervalId = setInterval(fetchDeposits, 3000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <TableContainer component={Paper}>
            {loading ? (<Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>) : (<h1>Polling every 5 minutes</h1>)}
            <br></br>
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
    );
}

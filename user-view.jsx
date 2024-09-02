import axios from "axios";
import * as React from 'react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Container } from '@mui/system';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { login, listpayments } from './api';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.grey,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    paddingLeft: theme.spacing(1),
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setPayments] = useState([]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      if (res.status) {
        const paymentData = await listpayments("otp", res.token);
        setPayments(paymentData);
        console.log(res);
      }
    } catch (error) {
      console.error('Login or fetching payments failed:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const options = {
    method: 'GET',
    url: 'https://otpninja.com/api/v1/listservices?type=mdn',
    headers: {'X-OTPNINJA-TOKEN': 'hLAPySpZEuGtGJVCbglgToIVLdjdssMR'}
  };

  axios.request(options).then((response) => {
    console.log(response.data);
  }).catch((error) => {
    console.error(error);
  });
  

  const rows = users
    .map((user) => ({
      id: user.id,
      number: user.number,
      message: user.message,
      date: new Date(user.messagedate),
    }))
    .sort((a, b) => a.date - b.date);

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth margin="normal">
          <Typography variant="h6" gutterBottom>
            Login
          </Typography>
          <FormControl fullWidth margin="normal">
            <Typography>Username</Typography>
            <input type="text" placeholder="Username" onChange={handleUsernameChange} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Typography>Password</Typography>
            <input type="password" placeholder="Password" onChange={handlePasswordChange} />
          </FormControl>
          <Button variant="contained" onClick={handleLogin}>Login</Button>
        </FormControl>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
          spacing={2}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              fontSize: '2rem',
            }}
          >
            Verifications
          </Typography>
        </Stack>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Number</StyledTableCell>
                <StyledTableCell align="left">Message</StyledTableCell>
                <StyledTableCell align="left">Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell align="left">{row.number}</StyledTableCell>
                  <StyledTableCell align="left">{row.message}</StyledTableCell>
                  <StyledTableCell align="left">{row.date.toLocaleDateString()}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Container>
  );
}

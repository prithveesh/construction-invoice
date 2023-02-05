import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Spinner from '../../components/Spinner';
import WeekPicker from './week-picker';
import Day from './day';
import Totals from './totals';
import { getInvoice, setInvoice, reset } from '../../features/invoice/slice';
import { WEEKDAYS, round, calStartDate, getOffsetDate } from './utils';
import Labor from './labor';
import Material from './material';

function Invoice() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [date, setDate] = useState(() => new Date());
  const startDate = calStartDate(date);
  const key = startDate.toDateString().split(' ').join('-');
  // const { user } = useSelector((state) => state.auth)
  const { invoice, laborPrices, materialPrices, isLoading, isError, message } =
    useSelector((state) => state.invoice);
  const [paid, setPaid] = useState(0);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    // if (!user) {
    //   navigate('/login')
    // }

    dispatch(getInvoice(key));

    return () => {
      dispatch(reset());
    };
  }, [
    // user,
    navigate,
    isError,
    message,
    dispatch,
    key,
  ]);

  const saveInvoice = useCallback(() => {
    dispatch(setInvoice(paid));
  }, [dispatch, paid]);

  const printInvoice = useCallback(() => {
    setTimeout(() => window.print());
  }, []);

  if (isLoading || !invoice) {
    return <Spinner />;
  }
  console.log(materialPrices, laborPrices);
  return (
    <div style={{ paddingBottom: '60px' }}>
      <Typography variant="h3">Invoice</Typography>
      <WeekPicker date={date} setDate={setDate} />
      <Labor date={startDate} />
      <Divider variant={'fullWidth'} sx={{ margin: '10px 0' }} />
      <Material date={startDate} />
      <Divider variant={'fullWidth'} sx={{ margin: '10px 0' }} />
      <Typography variant="h5">Invoice Summary</Typography>
      <TableContainer sx={{ border: '2px solid rgba(0,0,0,0.2)' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{ borderBottom: '1px solid rgba(0,0,0,1)' }}>
            <TableRow>
              <TableCell align="center">Labor Cost</TableCell>
              <TableCell align="center">Labor Commission</TableCell>
              <TableCell align="center">Labor Total</TableCell>
              <TableCell align="center">Material Cost</TableCell>
              <TableCell align="center">Material Commission</TableCell>
              <TableCell align="center">Material Tax</TableCell>
              <TableCell align="center">Material Total</TableCell>
              <TableCell align="center">Total Comission</TableCell>
              <TableCell align="center">Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ '& td': { border: '1px solid black' } }}>
              <TableCell align="center">${laborPrices.cost}</TableCell>
              <TableCell align="center">${laborPrices.commission}</TableCell>
              <TableCell align="center">${laborPrices.total}</TableCell>
              <TableCell align="center">${materialPrices.cost}</TableCell>
              <TableCell align="center">${materialPrices.commission}</TableCell>
              <TableCell align="center">${materialPrices.tax}</TableCell>
              <TableCell align="center">${materialPrices.total}</TableCell>
              <TableCell align="center">
                ${laborPrices.commission + materialPrices.commission}
              </TableCell>
              <TableCell align="center">
                ${laborPrices.total + materialPrices.total}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Card sx={{ padding: '10px', marginTop: '10px', textAlign: 'left' }}>
        <Typography
          variant="subtitle1"
          align="left"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Paid: $
          <TextField
            onChange={(event) => setPaid(+event.target.value)}
            size="small"
            type="number"
            value={paid}
          ></TextField>
        </Typography>
        <Typography variant="subtitle1" align="left">
          Due: ${round(laborPrices.total + materialPrices.total - paid)}
        </Typography>
      </Card>
      <Stack
        spacing={2}
        direction="row"
        sx={{
          padding: '20px 0',
          position: 'sticky',
          bottom: '0',
          justifyContent: 'center',
        }}
      >
        <Button variant="contained" onClick={saveInvoice}>
          Save
        </Button>
        <Button variant="contained" onClick={printInvoice}>
          Print
        </Button>
      </Stack>
    </div>
  );

  // return (
  //   <div style={{ paddingBottom: '60px' }}>
  //     <Typography variant="h3">Invoice</Typography>
  //     <WeekPicker date={date} setDate={setDate} />
  //     <Box component="form">
  //       {WEEKDAYS.map((day, index) => (
  //         <Day
  //           expand={expand}
  //           updatePrices={updatePrices}
  //           key={day}
  //           date={getOffsetDate(startDate, index)}
  //           day={day}
  //           config={config}
  //           invoice={days[index]}
  //           index={index}
  //         />
  //       ))}
  //     </Box>
  //   </div>
  // );
}

export default Invoice;

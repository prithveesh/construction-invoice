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
import Spinner from '../../components/Spinner';
import WeekPicker from './week-picker';
import Day from './day';
import Totals from './totals';
import { getInvoice, setInvoice, reset } from '../../features/invoice/slice';
import { WEEKDAYS, round, calStartDate, getOffsetDate } from './utils';

function Invoice() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [date, setDate] = useState(() => new Date());
  const startDate = calStartDate(date);
  const key = startDate.toDateString().split(' ').join('-');
  // const { user } = useSelector((state) => state.auth)
  const { invoice, isLoading, isError, message } = useSelector(
    (state) => state.invoice,
  );
  const [paid, setPaid] = useState(0);
  const [expand, setExpand] = useState(false);
  const [prices, setPrices] = useState(
    new Array(7).fill({
      cost: 0,
      tax: 0,
      commission: 0,
      total: 0,
    }),
  );

  const updatePrices = useCallback((index, totals) => {
    setPrices((values) => {
      values[index] = totals;
      return values;
    });
  }, []);

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

  const { config, days } = invoice;

  return (
    <div style={{ paddingBottom: '60px' }}>
      <Typography variant="h3">Invoice</Typography>
      <WeekPicker date={date} setDate={setDate} />
      <Box component="form">
        {WEEKDAYS.map((day, index) => (
          <Day
            expand={expand}
            updatePrices={updatePrices}
            key={day}
            date={getOffsetDate(startDate, index)}
            day={day}
            config={config}
            invoice={days[index]}
            index={index}
          />
        ))}
      </Box>
      <Divider variant={'fullWidth'} sx={{ margin: '10px 0' }} />
      <Card sx={{ padding: '10px', marginTop: '10px', textAlign: 'left' }}>
        <Totals
          cost={prices.reduce((sum, price) => sum + price.cost, 0)}
          tax={prices.reduce((sum, price) => sum + price.tax, 0)}
          commission={prices.reduce((sum, price) => sum + price.commission, 0)}
          total={prices.reduce((sum, price) => sum + price.total, 0)}
        />
      </Card>
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
          Due: $
          {round(prices.reduce((sum, price) => sum + price.total, 0) - paid)}
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
}

export default Invoice;

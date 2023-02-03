import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Spinner from '../components/Spinner';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  getInvoice,
  updateInvoice,
  setInvoice,
  reset,
} from '../features/invoice/slice';

const round = (value) => {
  return Math.round(value * 100) / 100;
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const WEEKDAYS = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

const calStartDate = (d) => {
  const date = new Date(d);
  date.setDate(date.getDate() - date.getDay() + 1);
  return date;
};

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));

export function DatePickers({ date, setDate }) {
  const startDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const [value, setValue] = useState(dayjs(startDate));

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!value) {
      return <PickersDay {...pickersDayProps} />;
    }

    const start = value.startOf('week');
    const end = value.endOf('week');

    const dayIsBetween = date.isBetween(start, end, null, '[]');
    const isFirstDay = date.isSame(start, 'day');
    const isLastDay = date.isSame(end, 'day');

    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3} sx={{ maxWidth: '200px', margin: '20px 0' }}>
        <DatePicker
          label="Responsive"
          openTo="day"
          views={['year', 'month', 'day']}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            setDate(newValue.toDate());
          }}
          renderDay={renderWeekPickerDay}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}

const Labor = (props) => {
  const { fieldId, rates, setPrices, data, setData } = props;
  const cost = data.noOfWorkers * data.hoursWorked * rates.labor;
  const commission = round(cost * props.commission);
  const totalCost = data.ownerHours * rates.owner + cost + commission;

  const onChange = useCallback(
    (event, key) => {
      const value = +event.target.value;
      if (value < 0) return;
      setData({
        ...data,
        [key]: value,
      });
    },
    [data, setData],
  );

  useEffect(() => {
    setPrices?.({
      cost: cost,
      tax: 0,
      commission: commission,
      total: totalCost,
    });
  }, [commission, cost, setPrices, totalCost]);

  return (
    <>
      <Typography variant="h6" align="left">
        Labor
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">No of Workers</TableCell>
              <TableCell align="center">Hours</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Labor
              </TableCell>
              <TableCell align="center">
                <TextField
                  onChange={(event) => onChange(event, 'noOfWorkers')}
                  id={`${fieldId}-noOfWorkers`}
                  size="small"
                  type="number"
                  value={data.noOfWorkers}
                ></TextField>
              </TableCell>
              <TableCell align="center">
                <TextField
                  onChange={(event) => onChange(event, 'hoursWorked')}
                  id={`${fieldId}-hoursWorked`}
                  size="small"
                  type="number"
                  value={data.hoursWorked}
                ></TextField>
              </TableCell>
              <TableCell align="center">${cost}</TableCell>
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Preston
              </TableCell>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">
                <TextField
                  onChange={(event) => onChange(event, 'ownerHours')}
                  id={`${fieldId}-ownerHours`}
                  size="small"
                  type="number"
                  value={data.ownerHours}
                ></TextField>
              </TableCell>
              <TableCell align="center">
                ${1 * data.ownerHours * rates.owner}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ height: '10px' }}></div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item>
            Commission: <b>${commission}</b>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            Cost: <b>${totalCost}</b>
          </Item>
        </Grid>
      </Grid>
    </>
  );
};

const Material = (props) => {
  const { setPrices, data, setData } = props;
  const [newItem, setNewItem] = useState({ item: '', price: 0 });
  const cost = data.reduce((sum, item) => sum + item.price, 0);
  const commission = round(cost * props.commission);
  const tax = round(cost * props.tax);
  const totalCost = cost + tax + commission;

  const onChange = useCallback(
    (value, index, key) => {
      const items = data?.map((item) => ({ ...item }));
      items[index][key] = value;
      setData([...items]);
    },
    [data, setData],
  );

  const onNewItemChange = useCallback(
    (value, key) => {
      newItem[key] = value;
      setNewItem({ ...newItem });
    },
    [newItem],
  );

  const onAdd = useCallback(() => {
    setData([...data, newItem]);
    setNewItem({ item: '', price: 0 });
  }, [data, newItem, setData]);

  useEffect(() => {
    setPrices?.({
      cost: cost,
      tax: tax,
      commission: commission,
      total: totalCost,
    });
  }, [commission, cost, setPrices, tax, totalCost]);

  return (
    <>
      <Typography variant="h6" align="left">
        Material
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Item Name</TableCell>
              <TableCell align="center">Item Price (in $)</TableCell>
              <TableCell align="center">Tax</TableCell>
              <TableCell align="center">Item Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">
                  <TextField
                    onChange={(event) =>
                      onChange(event.target.value, index, 'item')
                    }
                    size="small"
                    type="text"
                    value={item.item}
                  ></TextField>
                </TableCell>
                <TableCell align="center">
                  <TextField
                    onChange={(event) =>
                      onChange(+event.target.value, index, 'price')
                    }
                    size="small"
                    type="number"
                    value={item.price}
                    defaultValue={0}
                  ></TextField>
                </TableCell>
                <TableCell align="center">
                  ${round(item.price * props.tax)}
                </TableCell>
                <TableCell align="center">
                  ${round(item.price * (1 + props.tax))}
                </TableCell>
              </TableRow>
            ))}
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">
                <TextField
                  onChange={(event) =>
                    onNewItemChange(event.target.value, 'item')
                  }
                  size="small"
                  type="text"
                  value={newItem.item}
                  placeholder="Item Name"
                ></TextField>
              </TableCell>
              <TableCell align="center">
                <TextField
                  onChange={(event) =>
                    onNewItemChange(+event.target.value, 'price')
                  }
                  size="small"
                  type="number"
                  value={newItem.price}
                  placeholder="Item Price"
                ></TextField>
              </TableCell>
              <TableCell align="center">${0}</TableCell>
              <TableCell align="center">${0}</TableCell>
              <TableCell align="center">
                <Button onClick={onAdd} variant="contained">
                  Add
                </Button>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">Totals</TableCell>
              <TableCell align="center">
                <b>${cost}</b>
              </TableCell>
              <TableCell align="center">
                <b>${tax}</b>
              </TableCell>
              <TableCell align="center">
                <b>${cost + tax}</b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ height: '10px' }}></div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item>
            Commission: <b>${commission}</b>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            Cost: <b>${totalCost}</b>
          </Item>
        </Grid>
      </Grid>
    </>
  );
};

const Day = (props) => {
  const dispatch = useDispatch();
  const { date, invoice, config, index, updatePrices } = props;
  const { rates, tax, commission } = config;
  const [laborPrices, setLaborPrices] = useState({
    cost: 0,
    tax: 0,
    commission: 0,
    total: 0,
  });
  const [materialPrices, setMaterialPrices] = useState({
    cost: 0,
    tax: 0,
    commission: 0,
    total: 0,
  });

  const totals = useMemo(
    () => ({
      cost: laborPrices.cost + materialPrices.cost,
      tax: laborPrices.tax + materialPrices.tax,
      commission: laborPrices.commission + materialPrices.commission,
      total: laborPrices.total + materialPrices.total,
    }),
    [laborPrices, materialPrices],
  );

  useEffect(() => {
    updatePrices(index, totals);
  }, [totals, index, updatePrices]);

  const [labor, setLabor] = useState(invoice?.labor);
  const [material, setMaterial] = useState([
    ...invoice?.material?.map((item) => ({ ...item })),
  ]);

  useEffect(() => {
    dispatch(
      updateInvoice({
        index,
        data: {
          labor,
          material,
        },
      }),
    );
  }, [dispatch, index, labor, material]);

  const totalCost = laborPrices.total + materialPrices.total;
  return (
    <Accordion disabled={!labor && !material?.length}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography variant="h6">{date.toDateString()}</Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <b>{'$' + totalCost}</b>
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ padding: '10px', marginTop: '10px', textAlign: 'left' }}>
          {labor && (
            <Labor
              setPrices={setLaborPrices}
              setData={setLabor}
              commission={commission}
              tax={tax.labor}
              rates={rates}
              data={labor}
            />
          )}
        </Box>
        <Divider variant={'fullWidth'} sx={{ margin: '10px 0' }} />
        <Box sx={{ padding: '10px', marginTop: '10px', textAlign: 'left' }}>
          {material && (
            <Material
              setPrices={setMaterialPrices}
              setData={setMaterial}
              commission={commission}
              tax={tax.material}
              data={material}
            />
          )}
        </Box>
        <Divider variant={'fullWidth'} sx={{ margin: '10px 0' }} />
        <Card sx={{ padding: '10px', marginTop: '10px', textAlign: 'left' }}>
          <Typography variant="h5" align="left">
            Totals
          </Typography>
          <Typography variant="subtitle1" align="left">
            Cost: ${totals.cost}
          </Typography>
          <Typography variant="subtitle1" align="left">
            Total Commission: ${totals.commission}
          </Typography>
          <Typography variant="subtitle1" align="left">
            Total Tax: ${totals.tax}
          </Typography>
          <Typography variant="subtitle1" align="left">
            Total Cost: ${totals.total}
          </Typography>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};

const getOffsetDate = (date, offset) => {
  const d = new Date(date);
  d.setDate(d.getDate() + offset);
  return d;
};

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
      <DatePickers date={date} setDate={setDate} />
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
        <Typography variant="h5" align="left">
          Totals
        </Typography>
        <Typography variant="subtitle1" align="left">
          Cost: ${prices.reduce((sum, price) => sum + price.cost, 0)}
        </Typography>
        <Typography variant="subtitle1" align="left">
          Total Commission: $
          {prices.reduce((sum, price) => sum + price.commission, 0)}
        </Typography>
        <Typography variant="subtitle1" align="left">
          Total Tax: ${prices.reduce((sum, price) => sum + price.tax, 0)}
        </Typography>
        <Typography variant="subtitle1" align="left">
          Total Cost: ${prices.reduce((sum, price) => sum + price.total, 0)}
        </Typography>
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
          {round(prices.reduce((sum, price) => sum + price.total, 0)) - paid}
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

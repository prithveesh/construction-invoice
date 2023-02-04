import { useCallback, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { round } from '../utils';
import Totals from '../totals';

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
      <Totals cost={cost} commission={commission} total={totalCost} />
    </>
  );
};

export default Labor;

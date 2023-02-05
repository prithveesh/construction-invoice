import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Field from '../Field';
import { round, WEEKDAYS, getOffsetDate } from '../utils';
import {
  updateLabors,
  updateLaborPrices,
} from '../../../features/invoice/slice';

const Labor = ({ date, isReadOnly = false }) => {
  const {
    invoice: {
      labor: labors,
      config: { rates, commission },
    },
  } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();
  const noOfWorkers = WEEKDAYS.reduce((sum, _, index) => {
    return sum + labors[index].noOfWorkers;
  }, 0);
  const hoursWorked = WEEKDAYS.reduce(
    (sum, _, index) => sum + labors[index].hoursWorked,
    0,
  );
  const ownerHours = WEEKDAYS.reduce(
    (sum, _, index) => sum + labors[index].ownerHours,
    0,
  );
  const cost = noOfWorkers * hoursWorked * rates.labor;
  const commissionTotal = cost * commission;
  const totalCost = commissionTotal + ownerHours * rates.owner + cost;

  const onChange = useCallback(
    (event, dataKey, index) => {
      const value = +event.target.value;
      if (value < 0) return;
      dispatch(
        updateLabors({
          ...labors,
          [index]: {
            ...labors[index],
            [dataKey]: value,
          },
        }),
      );
    },
    [dispatch, labors],
  );

  useEffect(() => {
    dispatch(
      updateLaborPrices({
        cost: cost,
        tax: 0,
        commission: commissionTotal,
        total: totalCost,
      }),
    );
  }, [commissionTotal, cost, dispatch, totalCost]);

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" align="left">
                  Labor
                </Typography>
              </TableCell>
              <TableCell align="center">No of Labor</TableCell>
              <TableCell align="center">No of Laboor Hours</TableCell>
              <TableCell align="center">No of Preston Hours</TableCell>
              <TableCell align="center">SubTotal</TableCell>
              <TableCell align="center">Comission</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {WEEKDAYS.map((_, index) => {
              const labor = labors[index];
              return (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {getOffsetDate(date, index).toDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      isReadOnly={isReadOnly}
                      index={index}
                      dataKey={'noOfWorkers'}
                      onChange={onChange}
                      id={`${index}-noOfWorkers`}
                      value={labor.noOfWorkers}
                      type={'number'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      isReadOnly={isReadOnly}
                      index={index}
                      dataKey={'hoursWorked'}
                      onChange={onChange}
                      id={`${index}-hoursWorked`}
                      value={labor.hoursWorked}
                      type={'number'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Field
                      isReadOnly={isReadOnly}
                      index={index}
                      dataKey={'ownerHours'}
                      onChange={onChange}
                      id={`${index}-ownerHours`}
                      value={labor.ownerHours}
                      type={'number'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    $
                    {round(labor.noOfWorkers * labor.hoursWorked * rates.labor)}
                  </TableCell>
                  <TableCell align="center">
                    $
                    {round(
                      labor.noOfWorkers *
                        labor.hoursWorked *
                        commission *
                        rates.labor,
                    )}
                  </TableCell>
                  <TableCell align="center">
                    $
                    {round(
                      labor.noOfWorkers *
                        labor.hoursWorked *
                        commission *
                        rates.labor,
                    ) +
                      labor.noOfWorkers * labor.hoursWorked * rates.labor +
                      labor.ownerHours * rates.owner}
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>Totals</TableCell>
              <TableCell align="center">{noOfWorkers}</TableCell>
              <TableCell align="center">{hoursWorked}</TableCell>
              <TableCell align="center">{ownerHours}</TableCell>
              <TableCell align="center">$ {cost}</TableCell>
              <TableCell align="center">$ {commissionTotal}</TableCell>
              <TableCell align="center">$ {totalCost}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Labor;

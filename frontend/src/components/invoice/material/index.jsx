import { useCallback, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { round } from '../utils';
import Totals from '../totals';

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
          </TableBody>
        </Table>
      </TableContainer>
      <Totals cost={cost} tax={tax} commission={commission} total={totalCost} />
    </>
  );
};

export default Material;

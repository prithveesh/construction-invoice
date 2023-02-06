import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getOffsetDate, round } from '../utils';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Totals from '../totals';
import Field from '../Field';
import {
  updateMaterial,
  updateMaterialPrices,
} from '../../../features/invoice/slice';

const MaterialItem = ({
  startDate,
  item,
  index,
  isReadOnly,
  onChange,
  tax,
  children,
}) => {
  // const itemTax = round(item.price * tax);
  // const itemTotal = itemTax + item.price;
  const shouldDisableDate = useCallback(
    (date) => {
      return (
        date.$d.getTime() < startDate.getTime() ||
        date.$d.getTime() > getOffsetDate(startDate, 6).getTime()
      );
    },
    [startDate],
  );
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell
        align="center"
        sx={{
          '& input': { maxWidth: '100px', padding: '3px 10px' },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            shouldDisableDate={shouldDisableDate}
            label=""
            openTo="day"
            value={item.date}
            onChange={(newValue) => {
              onChange({ target: { value: newValue.toDate() } }, 'date', index);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </TableCell>
      <TableCell align="center">
        <Field
          isReadOnly={isReadOnly}
          index={index}
          dataKey={'receipt'}
          type="text"
          onChange={onChange}
          id={`${index}-receipt`}
          value={item.receipt}
        />
      </TableCell>
      <TableCell align="center">
        <Field
          isReadOnly={isReadOnly}
          index={index}
          dataKey={'storeName'}
          onChange={onChange}
          id={`${index}-storeName`}
          value={item.storeName}
        />
      </TableCell>
      <TableCell align="center">
        <Field
          isReadOnly={isReadOnly}
          index={index}
          dataKey={'item'}
          type="text"
          onChange={onChange}
          id={`${index}-item`}
          value={item.item}
        />
      </TableCell>
      <TableCell align="center">
        <Field
          preText={'$'}
          isReadOnly={isReadOnly}
          index={index}
          dataKey={'price'}
          type="number"
          onChange={onChange}
          id={`${index}-price`}
          value={item.price}
        />
      </TableCell>
      {/* <TableCell align="center">
        <Field preText={'$'} isReadOnly={true} value={itemTax} />
      </TableCell>
      <TableCell align="center">
        <Field preText={'$'} isReadOnly={true} value={itemTotal} />
      </TableCell> */}
      {children}
    </TableRow>
  );
};

const BlankMaterialItem = {
  date: '',
  receipt: '',
  storeName: '',
  item: '',
  price: 0,
  type: '',
};

const Material = ({ date, isReadOnly = false }) => {
  const {
    invoice: {
      material,
      config: {
        commission,
        tax: { material: tax },
      },
    },
  } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();

  const [newItem, setNewItem] = useState({ ...BlankMaterialItem, date });
  const totalItemCost = material.reduce((sum, item) => sum + item.price, 0);
  const totalCommission = round(totalItemCost * commission);
  // const totalTax = round(totalItemCost * tax);
  const totalCost = totalItemCost + totalCommission; // + totalTax;

  const onChange = useCallback(
    (event, dataKey, index) => {
      let { value, type } = event.target;
      if (type === 'number') value = +value;
      const updatedMaterial = [...material];
      updatedMaterial[index] = {
        ...updatedMaterial[index],
        [dataKey]: value,
      };
      dispatch(updateMaterial(updatedMaterial));
    },
    [dispatch, material],
  );

  const onNewItemChange = useCallback(
    (event, dataKey) => {
      let { value, type } = event.target;
      if (type === 'number') value = +value;
      newItem[dataKey] = value;
      setNewItem({ ...newItem });
    },
    [newItem],
  );

  const onAdd = useCallback(() => {
    const updatedMaterial = [...material, newItem];
    dispatch(updateMaterial(updatedMaterial));
    setNewItem({
      ...BlankMaterialItem,
      date: new Date(newItem.date),
      receipt: newItem.receipt,
      storeName: newItem.storeName,
    });
  }, [dispatch, material, newItem]);

  const onRemove = useCallback(
    (index) => {
      const updatedMaterial = [...material];
      updatedMaterial.splice(index, 1);
      dispatch(updateMaterial(updatedMaterial));
      setNewItem({ ...BlankMaterialItem });
    },
    [dispatch, material],
  );

  useEffect(() => {
    console.log('trigger');
    dispatch(
      updateMaterialPrices({
        cost: totalItemCost,
        // tax: totalTax,
        commission: totalCommission,
        total: totalCost,
      }),
    );
  }, [totalCommission, dispatch, totalItemCost, totalCost]);

  return (
    <>
      <Typography variant="h6" align="left">
        Material
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Reciept</TableCell>
              <TableCell align="center">Store Name</TableCell>
              <TableCell align="center">Item</TableCell>
              <TableCell align="center">Item Price (in $)</TableCell>
              {/* <TableCell align="center">Tax</TableCell>
              <TableCell align="center">Cost</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {material.map((item, index) => (
              <>
                <MaterialItem
                  item={item}
                  index={index}
                  isReadOnly={isReadOnly}
                  onChange={onChange}
                  // tax={tax}
                  startDate={date}
                >
                  <Button
                    onClick={() => onRemove(index)}
                    variant="outlined"
                    sx={{
                      position: 'absolute',
                      color: 'red',
                      borderColor: 'red',
                    }}
                  >
                    X
                  </Button>
                </MaterialItem>
              </>
            ))}
            <MaterialItem
              item={newItem}
              index={material.length}
              isReadOnly={isReadOnly}
              onChange={onNewItemChange}
              // tax={tax}
              startDate={date}
            >
              <Button
                onClick={onAdd}
                variant="contained"
                sx={{ position: 'absolute' }}
              >
                Add
              </Button>
            </MaterialItem>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">$ {totalItemCost}</TableCell>
              {/* <TableCell align="center">Tax</TableCell>
              <TableCell align="center">Cost</TableCell> */}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Totals cost={cost} tax={tax} commission={commission} total={totalCost} /> */}
    </>
  );
};

export default Material;

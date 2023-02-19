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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getOffsetDate, round, getId } from '../utils';
import Totals from '../totals';
import Field from '../Field';
import {
  updateMaterial,
  updateMaterialPrices,
} from '../../../features/invoice/slice';

export function Receipts({ receipts, setReceipt, receipt = '' }) {
  const handleChange = useCallback(
    (event) => {
      setReceipt(event.target.value);
    },
    [setReceipt],
  );
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Receipt</InputLabel>
        <Select value={receipt} label="Receipt" onChange={handleChange}>
          <MenuItem value={''}>None</MenuItem>
          {Array.from(receipts).map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
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
        {isReadOnly ? (
          new Date(item.date).toDateString()
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              shouldDisableDate={shouldDisableDate}
              label=""
              openTo="day"
              value={new Date(item.date)}
              onChange={(newValue) => {
                onChange(
                  { target: { value: newValue.toDate().toDateString() } },
                  'date',
                  index,
                );
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        )}
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
          width="120px"
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
          width="100px"
        />
      </TableCell>
      {/* <TableCell align="center">
        <Field preText={'$'} isReadOnly={true} value={itemTax} />
      </TableCell>
      <TableCell align="center">
        <Field preText={'$'} isReadOnly={true} value={itemTotal} />
      </TableCell> */}
      {!isReadOnly && children}
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
      config: { commission },
    },
  } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();
  const [receipts, setReceipts] = useState(
    () => new Set(material.map((m) => m.receipt)),
  );
  const [receipt, setReceipt] = useState('');
  const [newItem, setNewItem] = useState({
    ...BlankMaterialItem,
    date: date.toDateString(),
  });
  const totalItemCost = material.reduce(
    (sum, item) => (item.item.toLowerCase() !== 'tax' ? sum + item.price : sum),
    0,
  );
  const totalCommission = round(totalItemCost * commission);
  const totalTax = material.reduce(
    (sum, item) => (item.item.toLowerCase() === 'tax' ? sum + item.price : sum),
    0,
  );
  const totalCost = totalItemCost + totalCommission; // + totalTax;

  const onChange = useCallback(
    (event, dataKey, itemId) => {
      let { value, type } = event.target;
      if (type === 'number') value = +value;
      const index = material.findIndex((item) => item.itemId === itemId);
      const updatedMaterial = [...material];
      updatedMaterial[index] = {
        itemId: getId(),
        ...updatedMaterial[index],
        [dataKey]: value,
      };
      if (dataKey === 'receipt') {
        setReceipts((value) => {
          value.add(updatedMaterial[index].receipt);
          return value;
        });
      }
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
    const updatedMaterial = [...material, { itemId: getId(), ...newItem }];
    dispatch(updateMaterial(updatedMaterial));
    setNewItem({
      ...BlankMaterialItem,
      date: newItem.date,
      receipt: newItem.receipt,
      storeName: newItem.storeName,
    });
    setReceipts((value) => {
      value.add(newItem.receipt);
      return value;
    });
    if (receipt !== newItem.receipt) setReceipt('');
  }, [dispatch, material, newItem, receipt]);

  const onRemove = useCallback(
    (itemId) => {
      const index = material.findIndex((item) => item.itemId === itemId);
      const updatedMaterial = [...material];
      updatedMaterial.splice(index, 1);
      dispatch(updateMaterial(updatedMaterial));
    },
    [dispatch, material],
  );

  useEffect(() => {
    dispatch(
      updateMaterialPrices({
        cost: round(totalItemCost),
        tax: totalTax,
        commission: round(totalCommission),
        total: round(totalCost),
      }),
    );
  }, [totalCommission, dispatch, totalItemCost, totalCost, totalTax]);
  let sum = 0;
  let tax = 0;
  return (
    <>
      <Typography
        variant="h6"
        align="left"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>Material</span>
        <Receipts
          setReceipt={setReceipt}
          receipt={receipt}
          receipts={receipts}
        />
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
            {material
              .filter((item) => receipt === '' || item.receipt === receipt)
              .map((item, index) => {
                if (item.item !== 'tax') sum += item.price;
                else tax += item.price;
                return (
                  <MaterialItem
                    item={item}
                    index={item.itemId}
                    isReadOnly={isReadOnly}
                    onChange={onChange}
                    // tax={tax}
                    startDate={date}
                    key={item.itemId}
                  >
                    <Button
                      onClick={() => onRemove(item.itemId)}
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
                );
              })}
            {!isReadOnly && (
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
            )}
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">SubTotal</TableCell>
              <TableCell align="center">$ {round(sum)}</TableCell>
              {/* <TableCell align="center">Tax</TableCell>
              <TableCell align="center">Cost</TableCell> */}
            </TableRow>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Tax</TableCell>
              <TableCell align="center">$ {round(tax)}</TableCell>
              {/* <TableCell align="center">Tax</TableCell>
              <TableCell align="center">Cost</TableCell> */}
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">$ {round(tax) + round(sum)}</TableCell>
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

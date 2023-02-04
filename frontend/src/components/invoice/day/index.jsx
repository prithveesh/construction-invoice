import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Labor from '../labor';
import Material from '../material';
import { updateInvoice } from '../../../features/invoice/slice';

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

export default Day;

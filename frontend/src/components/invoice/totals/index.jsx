import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { round } from '../utils';

const Totals = (props) => {
  const { cost, tax, total, commission } = props;

  return (
    <>
      <TableContainer sx={{ border: '2px solid rgba(0,0,0,0.2)' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{ borderBottom: '1px solid rgba(0,0,0,0.8)' }}>
            <TableRow>
              <TableCell align="center">Cost</TableCell>
              <TableCell align="center">Comission</TableCell>
              {!isNaN(tax) && <TableCell align="center">Tax</TableCell>}
              <TableCell align="center">Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">${round(cost)}</TableCell>
              <TableCell align="center">${round(commission)}</TableCell>
              {!isNaN(tax) && (
                <TableCell align="center">${round(tax)}</TableCell>
              )}
              <TableCell align="center">${round(total)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Totals;

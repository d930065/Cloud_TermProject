import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}


const BasicTable = ({rowin}) => {
  const classes = useStyles();
  const rows = rowin;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rule</TableCell>
            <TableCell align="right">Support</TableCell>
            <TableCell align="right">Confidence</TableCell>
            <TableCell align="right">Conviction</TableCell>
            <TableCell align="right">Lift</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.rule}>
              <TableCell component="th" scope="row">
                {row.rule}
              </TableCell>
              <TableCell align="right">{row.sup}</TableCell>
              <TableCell align="right">{row.conf}</TableCell>
              <TableCell align="right">{row.conv}</TableCell>
              <TableCell align="right">{row.lift}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable
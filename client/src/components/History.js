import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const BasicTable = ({rowin}) => {
  const classes = useStyles();
  const rows = rowin;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell align="right">CSV</TableCell>
            <TableCell align="right">Min Sup</TableCell>
            <TableCell align="right">Min Conf</TableCell>
            <TableCell align="right">Max Output</TableCell>
            <TableCell align="right">Sorted By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.time}>
              <TableCell component="th" scope="row">
                {row.time}
              </TableCell>
              <TableCell align="right">{row.csv}</TableCell>
              <TableCell align="right">{row.min_sup}</TableCell>
              <TableCell align="right">{row.min_conf}</TableCell>
              <TableCell align="right">{row.max_output}</TableCell>
              <TableCell align="right">{row.sort}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable

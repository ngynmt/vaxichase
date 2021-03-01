import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function VaxTable({ locations, reports }) {
  return (
    <div className="gutters">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell align="right">Attempts</TableCell>
              <TableCell align="right">Success Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => {
              let attempts = reports?.filter(report => report.locationId === location.id).length;
              let successes = reports?.filter(report => report.locationId === location.id && report.success).length;
              let rate = attempts === 0 ? 0 : (successes / attempts) * 100;
              return (
                <TableRow key={location.id}>
                  <TableCell component="th" scope="row">{location.name}</TableCell>
                  <TableCell align="right">{attempts}</TableCell>
                  <TableCell align="right">{rate + '%'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
};

export default VaxTable;
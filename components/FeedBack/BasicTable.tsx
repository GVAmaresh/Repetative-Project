import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "next/link";

interface RowData {
  name: string;
  imf: string | string[];
}

interface BasicTableProps {
  rows: RowData[];
}

function BasicTable({ rows }: BasicTableProps) {
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              {row.name != "Drive" || Array.isArray(row.imf) ? (
                <TableCell align="left">{row.imf}</TableCell>
              ) : (
                <TableCell align="left">
                  <Link
                    href={row.imf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300"
                  >
                    {row.imf}
                  </Link>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable;

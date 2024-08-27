'use client'

import { useEffect, useState } from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { TableVisualizer } from "@/components/LineageVisualizer/TableVisualizer";

export default function TableDetailsPage({ params }) {
  const { tableName } = params;

  const [tableDetails, setTableDetails] = useState();

  const fetchTableDetails = async () => {
    const resp = await fetch(`/api/v1/tables/${tableName}`);
    const json = await resp.json();
    setTableDetails(json);
  }

  useEffect(() => {
    fetchTableDetails();
  }, [])

  return (
    <>
      <Link className="text-sm text-blue-500 underline" href="/tables">Back to all tables</Link>
      <h1>{tableName} details</h1>
      {tableDetails
        ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(tableDetails.columns).map(columnName => (
                  <TableRow key={columnName}>
                    <TableCell className="font-medium">{columnName}</TableCell>
                    <TableCell>{tableDetails.columns[columnName].type}</TableCell>
                    <TableCell>{tableDetails.columns[columnName].description || <span className='italic text-gray-400'>No description defined</span>}</TableCell>
                    <TableCell>
                      <Link className="text-blue-500 underline" href={`/tables/${tableName}/columns/${columnName}/edit`}>
                        Edit Column
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableVisualizer
              table={{ name: tableName, columns: tableDetails.columns }}
              upstreamTables={tableDetails.upstream_tables}
              downstreamTables={tableDetails.downstream_tables}
            />
          </>
        ) : (
          <h2>Fetching...</h2>
        )
      }
    </>
  )
}
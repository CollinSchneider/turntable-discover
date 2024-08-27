'use client'

import { useEffect, useState } from "react"
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";

export default function TablesListPage() {
  const [tablesList, setTablesList] = useState(null);

  const fetchTables = async () => {
    const resp = await fetch("/api/v1/tables");
    if (resp.ok) {
      const json = await resp.json();
      const formattedTables = Object.keys(json.tables).map(tableName => ({
        name: tableName,
        columns: Object.keys(json.tables[tableName])
      }))
      setTablesList(formattedTables);
    } else {
      throw new Error("An errror occurred fetching tables.")
    }
  }

  useEffect(() => {
    fetchTables();
  }, [])

  return (
    tablesList === null
      ? (
        <h1>Fetching tables...</h1>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Name</TableHead>
              <TableHead>Number of Columns</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tablesList.map(table => (
              <TableRow key={table.name}>
                <TableCell className="font-medium">{table.name}</TableCell>
                <TableCell>{table.columns.length}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/tables/${table.name}`}>
                    View details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
  )
}
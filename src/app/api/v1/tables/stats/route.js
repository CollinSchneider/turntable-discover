import WAREHOUSE_SCHEMA from "@/data/warehouseSchema"

export async function GET() {
  const numTables = Object.keys(WAREHOUSE_SCHEMA.tables).length;
  let totalNumColumns = 0;
  let totalNumDocumentedColumns = 0;
  Object.keys(WAREHOUSE_SCHEMA.tables).forEach(tableName => {
    Object.keys(WAREHOUSE_SCHEMA.tables[tableName]).map(columnName => {
      totalNumColumns += 1;
      if (WAREHOUSE_SCHEMA.tables[tableName][columnName].description) {
        totalNumDocumentedColumns += 1;
      }
    })
  })

  return Response.json({
    tables: numTables,
    columns: totalNumColumns,
    documented_columns: totalNumDocumentedColumns
  })
}
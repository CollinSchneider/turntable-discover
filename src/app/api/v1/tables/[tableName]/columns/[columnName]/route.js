import WAREHOUSE_SCHEMA from "@/data/warehouseSchema"
import updateColumn from "@/lib/updateColumn";

export async function PUT(request, { params }) {
  const { tableName, columnName } = params;
  const table = WAREHOUSE_SCHEMA.tables[tableName];

  if (table) {
    if (table[columnName]) {
      const updateResults = await updateColumn(tableName, columnName, request.json());
      return Response.json(updateResults)
    } else {
      return Response.json({
        message: `No column of ${columnName} within ${tableName} table.`
      })
    }

  } else {
    return Response.json({
      message: `No table found with name of: ${tableName}`
    }, { status: 404 })
  }
}
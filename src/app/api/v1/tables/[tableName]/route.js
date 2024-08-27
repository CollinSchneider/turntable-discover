import WAREHOUSE_SCHEMA from "@/data/warehouseSchema"
import { getImmediateDownstreamTables, getImmediateUpstreamTables } from "@/lib/lineageManager";

export async function GET(_request, { params }) {
  const { tableName } = params;
  const table = WAREHOUSE_SCHEMA.tables[tableName];

  if (table) {
    return Response.json({
      columns: table,
      upstream_tables: getImmediateUpstreamTables(tableName),
      downstream_tables: getImmediateDownstreamTables(tableName),
    });
  } else {
    return Response.json({
      message: `No table found with name of: ${tableName}`
    }, { status: 404 })
  }
}
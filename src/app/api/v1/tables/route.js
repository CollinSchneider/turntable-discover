import WAREHOUSE_SCHEMA from "@/data/warehouseSchema"

export async function GET() {
  return Response.json(WAREHOUSE_SCHEMA)
}
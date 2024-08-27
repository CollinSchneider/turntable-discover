import LINEAGE from "@/data/lineage"
import WAREHOUSE_SCHEMA from "@/data/warehouseSchema"

// export const getImmediateUpstreamTables = (table) => {
export const getImmediateDownstreamTables = (table) => {
  const upstreamTables = [];
  LINEAGE.column_relationships.forEach(relationship => {
    if (relationship.type === 'select' && relationship.target.split('.')[0] === table) {
      const tableName = relationship.source.split('.')[0];
      const columns = WAREHOUSE_SCHEMA.tables[tableName];
      if (!columns) {
        throw new Error(`Table ${tableName} does not exist in the warehouse schema`);
      }
      upstreamTables.push({ name: tableName, columns, relationship });
    }
  });
  return upstreamTables;
}

// export const getImmediateDownstreamTables = (table) => {
export const getImmediateUpstreamTables = (table) => {
  const downstreamTables = [];
  LINEAGE.column_relationships.forEach(relationship => {
    if (relationship.type === 'select' && relationship.source.split('.')[0] === table) {
      const tableName = relationship.target.split('.')[0];
      const columns = WAREHOUSE_SCHEMA.tables[tableName];
      if (!columns) {
        throw new Error(`Table ${tableName} does not exist in the warehouse schema`);
      }
      downstreamTables.push({ name: tableName, columns, relationship });
    }
  });
  return downstreamTables;
}
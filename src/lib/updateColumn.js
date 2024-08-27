import WAREHOUSE_SCHEMA from "@/data/warehouseSchema"
import LINEAGE from "@/data/lineage"

const updateColumnRecursively = ({ table, column, data, direction, updatedColumns = [] }) => {
  if (!['upstream', 'downstream'].includes(direction)) throw new Error(`Invalid direction type, must be either "upstream" or "downstream", received: ${direction}`);
  LINEAGE.column_relationships.forEach(relationship => {
    if (relationship.type === 'select') {
      if (relationship[direction === 'upstream' ? 'target' : 'source'] === `${table}.${column}`) {
        // if we are moving upstream, we want to update the source column where the target is the column we are updating
        const tableToUpdate = relationship[direction === 'upstream' ? 'source' : 'target'].split('.')[0];
        const columnToUpdate = relationship[direction === 'upstream' ? 'source' : 'target'].split('.')[1];
        WAREHOUSE_SCHEMA.tables[tableToUpdate][columnToUpdate].description = {
          ...WAREHOUSE_SCHEMA.tables[tableToUpdate][columnToUpdate].description,
          ...data
        };
        updatedColumns.push(`${tableToUpdate}.${columnToUpdate}`);
        updateColumnRecursively({ table: tableToUpdate, column: columnToUpdate, data, updatedColumns, direction });
      }
    }
  })
  return updatedColumns;
}

export const updateColumn = async (table, column, data) => {
  if (!WAREHOUSE_SCHEMA.tables[table]) throw new Error(`Table ${table} does not exist in the warehouse schema`);
  if (!WAREHOUSE_SCHEMA.tables[table][column]) throw new Error(`Column ${column} does not exist in table ${table}`);
  WAREHOUSE_SCHEMA.tables[table][column] = {
    ...WAREHOUSE_SCHEMA.tables[table][column],
    ...data
  }
  const downstreamUpdatedColumns = updateColumnRecursively({ table: table, column: column, data, direction: 'downstream' });
  const upstreamUpdatedColumns = updateColumnRecursively({ table: table, column: column, data, direction: 'upstream' });
  return {
    updated: true,
    upstream_updates: upstreamUpdatedColumns,
    downstream_updates: downstreamUpdatedColumns
  }
}

export default updateColumn;
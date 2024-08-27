import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TableNode from './TableNode';

const NODE_TYPES = {
  table: TableNode
}

export const TableVisualizer = ({ table, upstreamTables, downstreamTables, ...props }) => {
  const primaryTableNode = {
    id: 'primary-table',
    data: { table, className: 'border-2 border-blue-400 bg-blue-50' },
    position: { x: 300, y: 100 },
    type: 'table',
  }
  const downstreamNodes = downstreamTables.map((downstreamTable, index) => ({
    id: `downstream-table-${downstreamTable.name}`,
    data: { table: downstreamTable, includeLeftHandle: false },
    position: { x: 0, y: 100 + (index * 150) },
    type: 'table',
  }))
  const upstreamNodes = upstreamTables.map((upstreamTable, index) => ({
    id: `upstream-table-${upstreamTable.name}`,
    data: { table: upstreamTable, includeRightHandle: false },
    position: { x: 600, y: 100 + (index * 150) },
    type: 'table',
  }))

  const edges = [
    ...upstreamTables.map(upstreamTable => ({
      id: `${upstreamTable.name}-to-${table.name}`,
      source: `upstream-table-${upstreamTable.name}`,
      target: 'primary-table',
      type: 'step'
    })),
    ...downstreamTables.map(downstreamTable => ({
      id: `${table.name}-to-${downstreamTable.name}`,
      source: 'primary-table',
      target: `downstream-table-${downstreamTable.name}`,
      type: 'step'
    }))
  ]
  return (
    <div className="h-[50vh] border border-gray-200 rounded-md" {...props}>
      <ReactFlow
        nodes={[primaryTableNode, ...upstreamNodes, ...downstreamNodes]}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView={true}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
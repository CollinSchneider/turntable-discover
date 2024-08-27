import { Handle, Position } from "@xyflow/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const TableNode = ({ data, ...props }) => {
  const { table, includeLeftHandle = true, includeRightHandle = true } = data;
  return (
    <>
      {includeLeftHandle && <Handle type="source" position={Position.Left} />}
      {includeRightHandle && <Handle type="target" position={Position.Right} />}
      <div  {...props} className={`border border-gray-200 bg-white rounded-md py-2 px-4 ${data.className || ""}`}>
        <h1 className="text-md font-semibold">{table.name}</h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="text-xs font-normal py-2">{Object.keys(table.columns).length} Columns</AccordionTrigger>
            <AccordionContent>
              {Object.keys(table.columns).map(columnName => (
                <li className={`text-xs text-gray-700 font-mono flex justify-between space-x-2`}>
                  <span>{columnName}</span>
                  <span>{table.columns[columnName].type}</span>
                </li>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}

export default TableNode;
'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useEffect, useState } from "react";

const DATA_TYPES = [
  'DATETIME',
  'DECIMAL',
  'INTEGER',
  'TEXT',
  'VARCHAR(20)',
  'VARCHAR(255)',
]

export default function EditColumnPage({ params }) {
  const { tableName, columnName } = params;
  const { toast } = useToast();

  const [columnDetails, setColumnDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getColumnDetails = async () => {
    const resp = await fetch(`/api/v1/tables/${tableName}`);
    const json = await resp.json();
    console.log(json)
    setColumnDetails(json.columns[columnName]);
  }

  const updateColumn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const resp = await fetch(`/api/v1/tables/${tableName}/columns/${columnName}`, {
      method: 'PUT',
      body: JSON.stringify(columnDetails),
    })
    setIsLoading(false);
    if (resp.ok) {
      const json = await resp.json();
      let description = <></>;
      if (json.upstream_updates.length > 0) {
        description = (
          <span>
            Also updated the {json.upstream_updates.map((up, index) => (
              <span key={index} className="font-bold">{up}</span>
            ))} upstream columns
          </span>
        );
      }
      if (json.downstream_updates.length > 0) {
        if (json.upstream_updates.length > 0) {
          description = (
            <>
              {description}
              <span> and the {json.downstream_updates.map((down, index) => (
                <span key={index} className="font-bold">{down}</span>
              ))} downstream columns.</span>
            </>
          );
        } else {
          description = (
            <span>
              Also updated the {json.downstream_updates.map((down, index) => (
                <span key={index} className="font-bold">{down}</span>
              ))} downstream columns.
            </span>
          );
        }
      }
      toast({
        title: <span className="text-sm"><span className="font-bold">{tableName}.{columnName}</span> column updated</span>,
        description: <span className="text-xs">{description}</span>,
        duration: 15_000,
      });
    } else {
      toast({ title: 'Error updating column', variant: 'destructive' });
    }
  }

  useEffect(() => {
    getColumnDetails();
  }, [])

  return (
    <>
      <Link className="text-sm text-blue-500" href={`/tables/${tableName}`}>Back to {tableName} table details</Link>
      <h1 className="text-lg mb-4">Edit <span className="font-bold">{tableName}.{columnName}</span> column</h1>
      {columnDetails
        ? (
          <form onSubmit={updateColumn} className="space-y-4">
            <div>
              <label>Data Type</label>
              <Select onValueChange={(value) => setColumnDetails({ ...columnDetails, type: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={columnDetails?.type} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Data Type</SelectLabel>
                    {DATA_TYPES.map(dataType => (
                      <SelectItem key={dataType} value={dataType}>
                        {dataType}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label>Description</label>
              <Input
                value={columnDetails?.description}
                onChange={(e) => setColumnDetails({ ...columnDetails, description: e.target.value })}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className={isLoading ? 'bg-gray-400 cursor-not-allowed' : ''}
              >{isLoading ? 'Updating...' : 'Update Column'}</Button>
            </div>
          </form>
        ) : (
          <h1>Fetching...</h1>
        )}
    </>
  )
}
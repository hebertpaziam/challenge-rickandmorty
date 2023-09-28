import "./data-table.component.scss";

import Link from "next/link";
import { IList } from "@/interfaces/list.interface";

export type DataTableProps<T> = { data: IList; onTableDataChange: Function };

export function DataTable({ data, onTableDataChange }: DataTableProps<any>) {
  let debouncingTimeout: NodeJS.Timeout;
  const updateFilter = (colKey: string, term: string) => {
    clearTimeout(debouncingTimeout);
    debouncingTimeout = setTimeout(() => {
      const filter = data?.info?.filter || {};

      if (term) {
        filter[colKey] = term;
      } else {
        delete filter[colKey];
      }

      onTableDataChange({ ...data, info: { ...data.info, filter } });
    }, 1000);
  };

  return (
    <>
      {!!data?.results && (
        <table>
          <thead>
            <tr>
              {data?.columns?.map((col) => (
                <th key={col.key}>
                  <span>{col.label}</span>
                  <input
                    className="field"
                    type="text"
                    disabled={!col.searchable}
                    name={col.key}
                    onChange={(e) => updateFilter(col.key, e.target.value)}
                    id={`${col.key}-input`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.results.map((item) => (
              <tr key={item.id}>
                {data?.columns?.map((col) => (
                  <td key={col.key}>
                    <Link href={`${data.entity}/${item.id}`}>
                      {item[col.key]}
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
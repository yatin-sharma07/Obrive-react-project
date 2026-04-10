import React from "react";
import FONTS from "@/assets/fonts";

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  bold?: boolean;
}

export interface TableRow {
  [key: string]: React.ReactNode;
}

// Old interface for backward compatibility
interface ImpactMetric {
  metric: string;
  beforeObrive: string | React.ReactNode;
  afterObrive: string | React.ReactNode;
}

interface ResourceTheImpactTableProps {
  title?: string;
  columns?: TableColumn[];
  data?: TableRow[];
  firstColumnBold?: boolean;
  metrics?: ImpactMetric[];
  beforeHeader?: string;
  afterHeader?: string;
}

export default function ResourceTheImpactTable({
  title,
  columns,
  data,
  firstColumnBold = true,
  metrics,
  beforeHeader = "Before Obrive",
  afterHeader = "After Obrive",
}: ResourceTheImpactTableProps) {
  const isLegacyMode = !columns && !data && metrics;

  const effectiveColumns: TableColumn[] = isLegacyMode
    ? [
        { key: "metric", header: "Metric", width: "35%" },
        { key: "beforeObrive", header: beforeHeader, width: "32.5%" },
        { key: "afterObrive", header: afterHeader, width: "32.5%" },
      ]
    : columns || [];

  const effectiveData: TableRow[] = isLegacyMode
    ? (metrics || []).map((item) => ({
        metric: item.metric,
        beforeObrive: item.beforeObrive,
        afterObrive: item.afterObrive,
      }))
    : data || [];

  // calculate grid template columns
  const gridTemplateColumns = effectiveColumns
    .map((col) => col.width || "1fr")
    .join(" ");

  return (
    <section className="my-8">
      {title && (
        <h2 className={`${FONTS.microgrammaBold.className} text-3xl mb-6`}>
          {title}
        </h2>
      )}

      <div className="border border-gray-300 rounded-lg overflow-hidden hidden md:block">
        {/* Table Header */}
        <div className="grid bg-gray-100" style={{ gridTemplateColumns }}>
          {effectiveColumns.map((column, colIndex) => (
            <div
              key={column.key}
              className={`p-4 ${
                colIndex < effectiveColumns.length - 1
                  ? "border-r border-gray-300"
                  : ""
              } ${FONTS.microgrammaBold.className} text-sm font-semibold`}
            >
              {column.header}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        {effectiveData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid border-t border-gray-300"
            style={{ gridTemplateColumns }}
          >
            {effectiveColumns.map((column, colIndex) => (
              <div
                key={column.key}
                className={`p-4 ${
                  colIndex < effectiveColumns.length - 1
                    ? "border-r border-gray-300"
                    : ""
                } ${
                  colIndex === 0 && firstColumnBold ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div
                  className={`text-sm leading-relaxed ${
                    column.bold ? FONTS.microgrammaBold.className : ""
                  }`}
                >
                  {row[column.key as keyof typeof row]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="md:hidden space-y-4">
        {effectiveData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden"
          >
            {effectiveColumns.map((column, colIndex) => (
              <div
                key={column.key}
                className={`px-4 py-3 ${
                  colIndex < effectiveColumns.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <div
                  className={`text-xs uppercase tracking-wide text-gray-600 ${FONTS.microgrammaBold.className}`}
                >
                  {column.header}
                </div>
                <div
                  className={`mt-2 text-sm leading-relaxed text-gray-800 ${
                    colIndex === 0 && firstColumnBold
                      ? FONTS.microgrammaBold.className
                      : column.bold
                      ? FONTS.microgrammaBold.className
                      : ""
                  }`}
                >
                  {row[column.key as keyof typeof row]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

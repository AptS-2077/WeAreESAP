// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { memo } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from "reactflow";
import { RelationshipType } from "@/types/relationship";
import { getRelationshipColor } from "@/lib/relationship-utils";

export interface RelationshipEdgeData {
  label: string; // 关系简短标签
  type: RelationshipType; // 关系类型
  description?: string; // 完整描述
}

const RelationshipEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  }: EdgeProps<RelationshipEdgeData>) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const color = data?.type ? getRelationshipColor(data.type) : "#6b7280";

    return (
      <>
        {/* 边路径 */}
        <path
          id={id}
          className="react-flow__edge-path transition-all duration-200"
          d={edgePath}
          strokeWidth={2}
          stroke={color}
          fill="none"
          style={{
            opacity: 0.6,
          }}
        />

        {/* 边标签 */}
        <EdgeLabelRenderer>
          <div
            className="
              absolute
              transform -translate-x-1/2 -translate-y-1/2
              px-2.5 py-1
              rounded-full
              text-xs font-medium
              bg-background/90 backdrop-blur-sm
              border
              shadow-sm
              pointer-events-auto
              cursor-help
              transition-all duration-200
              hover:scale-110 hover:shadow-md
              whitespace-nowrap
            "
            style={{
              left: `${labelX}px`,
              top: `${labelY}px`,
              borderColor: color,
              color: color,
            }}
            title={data?.description || data?.label}
          >
            {data?.label || "关系"}
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }
);

RelationshipEdge.displayName = "RelationshipEdge";

export default RelationshipEdge;

'use client';

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: number;
  color?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 14, radius = 4, color = '#ffffff', style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: color + '20',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

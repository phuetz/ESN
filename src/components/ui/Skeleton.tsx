import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded';
      case 'text':
        return 'rounded h-4';
      default:
        return '';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-shimmer';
      case 'none':
        return '';
      default:
        return 'animate-pulse';
    }
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={clsx(
        'bg-gray-200',
        getVariantClasses(),
        getAnimationClasses(),
        className
      )}
      style={style}
    />
  );
};

// Prebuilt skeleton components for common use cases
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('bg-white rounded-lg shadow p-6 space-y-4', className)}>
    <Skeleton variant="text" width="60%" height={24} />
    <Skeleton variant="text" width="100%" />
    <Skeleton variant="text" width="100%" />
    <Skeleton variant="text" width="80%" />
    <div className="flex gap-2 pt-4">
      <Skeleton variant="rectangular" width={80} height={36} />
      <Skeleton variant="rectangular" width={80} height={36} />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="border-b p-4 flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={20} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b p-4 flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            width={`${100 / columns}%`}
            height={16}
          />
        ))}
      </div>
    ))}
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton variant="circular" width={80} height={80} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
    </div>
  </div>
);

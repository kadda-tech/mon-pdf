'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { NumberPosition } from '@/lib/pdf/page-numbering';

interface PositionSelectorProps {
  value: NumberPosition;
  onChange: (position: NumberPosition) => void;
  disabled?: boolean;
}

const positions: { id: NumberPosition; label: string; row: number; col: number }[] = [
  { id: 'top-left', label: 'Top Left', row: 0, col: 0 },
  { id: 'top-center', label: 'Top Center', row: 0, col: 1 },
  { id: 'top-right', label: 'Top Right', row: 0, col: 2 },
  { id: 'middle-left', label: 'Middle Left', row: 1, col: 0 },
  { id: 'middle-center', label: 'Middle Center', row: 1, col: 1 },
  { id: 'middle-right', label: 'Middle Right', row: 1, col: 2 },
  { id: 'bottom-left', label: 'Bottom Left', row: 2, col: 0 },
  { id: 'bottom-center', label: 'Bottom Center', row: 2, col: 1 },
  { id: 'bottom-right', label: 'Bottom Right', row: 2, col: 2 },
];

export function PageNumberPositionSelector({ value, onChange, disabled }: PositionSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Visual PDF Page Representation */}
      <div className="relative mx-auto w-full max-w-sm">
        <div className="relative aspect-[8.5/11] rounded-lg border-2 border-dashed border-muted-foreground/30 bg-gradient-to-br from-background to-muted/20 p-4 shadow-lg">
          {/* PDF Page Decoration */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* Grid of position buttons */}
          <div className="relative h-full grid grid-rows-3 gap-2">
            {[0, 1, 2].map((row) => (
              <div key={row} className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((col) => {
                  const position = positions.find((p) => p.row === row && p.col === col);
                  if (!position) return null;

                  const isSelected = value === position.id;
                  const isCorner = (row === 0 || row === 2) && (col === 0 || col === 2);
                  const isEdge = !isCorner && (row === 0 || row === 2 || col === 0 || col === 2);

                  return (
                    <button
                      key={position.id}
                      type="button"
                      onClick={() => !disabled && onChange(position.id)}
                      disabled={disabled}
                      className={cn(
                        'relative flex items-center justify-center rounded-md transition-all duration-200 group',
                        'hover:scale-105 active:scale-95',
                        disabled && 'opacity-50 cursor-not-allowed',
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-lg scale-110 ring-2 ring-primary ring-offset-2'
                          : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
                      )}
                      title={position.label}
                    >
                      {/* Number preview */}
                      <div
                        className={cn(
                          'text-xs font-bold transition-all',
                          isSelected ? 'scale-110' : 'scale-90 group-hover:scale-100'
                        )}
                      >
                        {isSelected ? '1' : '•'}
                      </div>

                      {/* Animated ring on hover */}
                      {!isSelected && (
                        <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute inset-0 rounded-md border-2 border-primary/50 animate-pulse" />
                        </div>
                      )}

                      {/* Position indicator dot */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1">
                          <div className="h-2 w-2 rounded-full bg-primary-foreground animate-ping" />
                          <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Page indicator */}
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50 font-mono">
            PDF Page
          </div>
        </div>

        {/* Shadow effect */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/10 blur-xl rounded-full" />
      </div>

      {/* Selected position label */}
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Selected Position:{' '}
          <span className="text-foreground font-semibold">
            {positions.find((p) => p.id === value)?.label}
          </span>
        </p>
      </div>

      {/* Quick selection chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {['bottom-center', 'top-right', 'bottom-right'].map((posId) => {
          const pos = positions.find((p) => p.id === posId);
          if (!pos) return null;

          return (
            <button
              key={pos.id}
              type="button"
              onClick={() => !disabled && onChange(pos.id as NumberPosition)}
              disabled={disabled}
              className={cn(
                'px-3 py-1 text-xs rounded-full transition-all',
                'border border-border hover:border-primary',
                value === pos.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              )}
            >
              {pos.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

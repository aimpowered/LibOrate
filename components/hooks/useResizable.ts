import { useCallback, useEffect, useRef, useState } from 'react';

interface UseResizableProps {
  minHeight?: number;
  defaultHeight?: number | 'auto';
}

export function useResizable({ minHeight = 100, defaultHeight }: UseResizableProps) {
  const [height, setHeight] = useState(defaultHeight);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement | any>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    e.preventDefault();
  }, []);

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    console.debug(containerRect,'getBoundingClientRect');
    const newHeight = Math.max(minHeight, e.clientY - containerRect.top);
    setHeight(newHeight);
  }, [minHeight]);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDrag, handleDragEnd]);

  return {
    height,
    containerRef,
    handleDragStart,
  };
}
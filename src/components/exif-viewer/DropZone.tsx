import { useDrop } from 'react-dnd';

interface DropZoneProps {
  onDrop: (file: File) => void;
  children: React.ReactNode;
}

export const DropZone = ({ onDrop, children }: DropZoneProps) => {
  const [{ isOver }, drop] = useDrop<{ files: FileList }, void, { isOver: boolean }>(() => ({
    accept: 'image',
    drop: (item) => {
      if (item.files?.[0]) {
        onDrop(item.files[0]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      {children}
    </div>
  );
}; 
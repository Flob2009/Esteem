'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, List, ListItem, Paper } from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  items: string[];
  onChange: (ordered: string[]) => void;
};

function SortableItem({ id }: { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    background: isDragging ? '#e0e0e0' : 'white',
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'grab',
  };

  return (
    <Paper ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </Paper>
  );
}

export default function OrderQuestion({ items, onChange }: Props) {
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  useEffect(() => {
    // Mélanger les items à l'initialisation
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setOrderedItems(shuffled);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = orderedItems.indexOf(active.id);
      const newIndex = orderedItems.indexOf(over.id);
      const newOrder = arrayMove(orderedItems, oldIndex, newIndex);
      setOrderedItems(newOrder);
      onChange(newOrder);
    }
  };

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={orderedItems} strategy={verticalListSortingStrategy}>
          <List>
            {orderedItems.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
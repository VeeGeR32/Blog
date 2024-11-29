import React from 'react';
import { Block } from '../../types';
import { Button } from '../ui/Button';
import { Trash2, GripVertical } from 'lucide-react';

interface ContentBlockProps {
  block: Block;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  onUpdate,
  onDelete,
}) => {
  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            className="w-full p-2 border rounded-md"
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            rows={4}
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Image URL"
              value={block.content.url || ''}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, url: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Alt text"
              value={block.content.alt || ''}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, alt: e.target.value })
              }
            />
          </div>
        );
      case 'video':
        return (
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Video URL (YouTube/Vimeo)"
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
          />
        );
      case 'button':
        return (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Button text"
              value={block.content.text || ''}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, text: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Button URL"
              value={block.content.url || ''}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, url: e.target.value })
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative flex items-start space-x-4 p-4 bg-white border rounded-lg mb-4">
      <div className="flex-none text-gray-400 cursor-move">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-grow">{renderBlockContent()}</div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(block.id)}
        className="flex-none text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};
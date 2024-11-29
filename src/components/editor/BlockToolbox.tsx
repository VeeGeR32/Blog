import React from 'react';
import { Type, Image, Video, Link } from 'lucide-react';
import { Button } from '../ui/Button';

interface BlockToolboxProps {
  onAddBlock: (type: 'text' | 'image' | 'video' | 'button') => void;
}

export const BlockToolbox: React.FC<BlockToolboxProps> = ({ onAddBlock }) => {
  return (
    <div className="flex space-x-2 p-4 bg-white border-b border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAddBlock('text')}
        className="flex items-center"
      >
        <Type className="h-4 w-4 mr-2" />
        Text
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAddBlock('image')}
        className="flex items-center"
      >
        <Image className="h-4 w-4 mr-2" />
        Image
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAddBlock('video')}
        className="flex items-center"
      >
        <Video className="h-4 w-4 mr-2" />
        Video
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAddBlock('button')}
        className="flex items-center"
      >
        <Link className="h-4 w-4 mr-2" />
        Button
      </Button>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useBlogStore } from '../lib/store';
import { BlockToolbox } from '../components/editor/BlockToolbox';
import { ContentBlock } from '../components/editor/ContentBlock';
import { Button } from '../components/ui/Button';
import { generateSlug } from '../lib/utils';
import { Block } from '../types';

export const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, addPost, updatePost } = useBlogStore();
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (id) {
      const post = posts.find((p) => p.id === id);
      if (post) {
        setTitle(post.title);
        setBlocks(post.content);
      }
    }
  }, [id, posts]);

  const handleAddBlock = (type: 'text' | 'image' | 'video' | 'button') => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: type === 'image' || type === 'button' ? { url: '', alt: '' } : '',
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (blockId: string, content: any) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId ? { ...block, content } : block
      )
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter((block) => block.id !== blockId));
  };

  const handleSave = () => {
    const post = {
      id: id || uuidv4(),
      title,
      slug: generateSlug(title),
      content: blocks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (id) {
      updatePost(id, post);
    } else {
      addPost(post);
    }
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full text-3xl font-bold border-none focus:outline-none focus:ring-0"
        />
      </div>

      <BlockToolbox onAddBlock={handleAddBlock} />

      <div className="space-y-4">
        {blocks.map((block) => (
          <ContentBlock
            key={block.id}
            block={block}
            onUpdate={handleUpdateBlock}
            onDelete={handleDeleteBlock}
          />
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => navigate('/')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title}>
          {id ? 'Update' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};
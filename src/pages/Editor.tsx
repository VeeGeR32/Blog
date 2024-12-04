import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { BlockToolbox } from '../components/editor/BlockToolbox';
import { ContentBlock } from '../components/editor/ContentBlock';
import { Button } from '../components/ui/Button';
import { Block } from '../types';
import axios from 'axios';

export const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch post data from backend if editing an existing post
      const fetchPost = async () => {
        try {
          const response = await axios.get(`/api/posts/${id}`);
          setTitle(response.data.title);
          setBlocks(response.data.content);
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Failed to load the post.');
        }
      };
      fetchPost();
    }
  }, [id]);

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

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const post = {
      title,
      slug: title.toLowerCase().replace(/ /g, '-'),
      content: blocks,
    };

    try {
      if (id) {
        // Update existing post
        await axios.put(`/api/posts/${id}`, post);
      } else {
        // Create new post
        await axios.post('/api/posts', post);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save the post.');
    } finally {
      setLoading(false);
    }
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
        <Button onClick={handleSave} disabled={!title || loading}>
          {loading ? 'Saving...' : id ? 'Update' : 'Publish'}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

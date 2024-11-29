import React from 'react';
import { useParams } from 'react-router-dom';
import { useBlogStore } from '../lib/store';

export const Preview: React.FC = () => {
  const { slug } = useParams();
  const { posts } = useBlogStore();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'text':
        return (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      case 'image':
        return (
          <img
            src={block.content.url}
            alt={block.content.alt}
            className="max-w-full h-auto rounded-lg"
          />
        );
      case 'video':
        return (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={block.content}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        );
      case 'button':
        return (
          <a
            href={block.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {block.content.text}
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <article>
        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        <div className="space-y-8">
          {post.content.map((block) => (
            <div key={block.id}>{renderBlock(block)}</div>
          ))}
        </div>
      </article>
    </div>
  );
};
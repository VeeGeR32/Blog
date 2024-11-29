import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { useBlogStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { posts, deletePost } = useBlogStore();

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/preview/${slug}`);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your published and draft posts.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/editor">
            <Button>Create Post</Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <h2 className="text-lg font-medium text-gray-900">
                      {post.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Created on {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => copyLink(post.slug)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <LinkIcon className="h-5 w-5" />
                    </button>
                    <Link
                      to={`/editor/${post.id}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No posts yet. Create your first post to get started!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
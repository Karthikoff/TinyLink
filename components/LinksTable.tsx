'use client';

import { useState } from 'react';
import { Copy, Trash2, BarChart3, ExternalLink } from 'lucide-react';
import NextLink from 'next/link';

interface Link {
    id:number,
  code: string;
  target_url: string;
  total_clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

interface LinksTableProps {
  links: Link[];
  onDelete: (code: string) => void;
}

export default function LinksTable({ links, onDelete }: LinksTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const truncateUrl = (url: string) => {
    return url.length > 50 ? url.substring(0, 50) + '...' : url;
  };

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
        <ExternalLink className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
        <p className="text-gray-500">Create your first short link to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Clicked</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map((link) => (
              <tr key={link.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md font-mono text-sm">
                      {link.code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/${link.code}`, link.code)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Copy short link"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    {copiedCode === link.code && (
                      <span className="text-xs text-green-600">Copied!</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    title={link.target_url}
                  >
                    {truncateUrl(link.target_url)}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {link.total_clicks}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(link.last_clicked_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <NextLink
                      href={`/code/${link.code}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="View stats"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </NextLink>
                    <button
                      onClick={() => {
                        if (confirm(`Delete link "${link.code}"?`)) {
                          onDelete(link.code);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

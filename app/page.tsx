'use client';

import { useState, useEffect } from 'react';
import LinkForm from '@/components/LinkForm';
import LinksTable from '@/components/LinksTable';
import { ExternalLink, BarChart3 } from 'lucide-react';

// Add this interface here ⬇️
interface Link {
  id: number;
  code: string;
  target_url: string;
  total_clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]); // ← Add <Link[]> type here
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (code: string) => {
    try {
      await fetch(`/api/links/${code}`, { method: 'DELETE' });
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const totalClicks = links.reduce((sum, link) => sum + link.total_clicks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TinyLink</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-sm text-gray-600 mb-1">Total Links</p>
            <p className="text-3xl font-bold text-gray-900">{links.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-sm text-gray-600 mb-1">Avg Clicks/Link</p>
            <p className="text-3xl font-bold text-gray-900">
              {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
            </p>
          </div>
        </div>

        <LinkForm onSuccess={fetchLinks} />
        
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <LinksTable links={links} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  );
}

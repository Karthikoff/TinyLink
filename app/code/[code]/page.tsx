import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BarChart3 } from 'lucide-react';


export default async function StatsPage(context: any) {
  const { code } =await context.params;
  
  const result = await sql`
    SELECT * FROM links WHERE code = ${code}
  `;

  if (result.length === 0) {
    notFound();
  }

  const link = result[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Link Statistics</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Short Code</label>
              <p className="mt-1 text-xl font-mono bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg inline-block">
                {link.code}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Short URL</label>
              <p className="mt-1 text-lg text-gray-900 break-all">
                {process.env.NEXT_PUBLIC_BASE_URL}/{link.code}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Target URL</label>
              <a
                href={link.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-lg text-blue-600 hover:underline break-all flex items-center gap-2"
              >
                {link.target_url}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Clicks</label>
                <p className="mt-1 text-4xl font-bold text-indigo-600">{link.total_clicks}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Last Clicked</label>
                <p className="mt-1 text-lg text-gray-900">
                  {link.last_clicked_at 
                    ? new Date(link.last_clicked_at).toLocaleString()
                    : 'Never'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(link.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
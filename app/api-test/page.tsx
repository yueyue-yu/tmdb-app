'use client';

import { useState } from 'react';
import { moviesApiNext } from '../../api/moviesNext';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApis = [
    { name: '热门电影', fn: () => moviesApiNext.getPopular(1) },
    { name: '正在上映', fn: () => moviesApiNext.getNowPlaying(1) },
    { name: '即将上映', fn: () => moviesApiNext.getUpcoming(1) },
    { name: '评分最高', fn: () => moviesApiNext.getTopRated(1) },
    { name: '搜索电影', fn: () => moviesApiNext.search('复仇者联盟', 1) },
  ];

  const handleTest = async (testFn: () => Promise<any>, name: string) => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await testFn();
      setTestResult({ name, data: result });
    } catch (err) {
      setError(`${name} 测试失败: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API 代理测试</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {testApis.map((api) => (
          <button
            key={api.name}
            onClick={() => handleTest(api.fn, api.name)}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '测试中...' : `测试 ${api.name}`}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {testResult && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{testResult.name} 测试结果</h2>
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">总结果数</div>
                <div className="stat-value">{testResult.data.total_results || 'N/A'}</div>
              </div>
              <div className="stat">
                <div className="stat-title">当前页</div>
                <div className="stat-value">{testResult.data.page || 'N/A'}</div>
              </div>
              <div className="stat">
                <div className="stat-title">总页数</div>
                <div className="stat-value">{testResult.data.total_pages || 'N/A'}</div>
              </div>
            </div>
            
            {testResult.data.results && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">前 5 个结果:</h3>
                <div className="grid gap-2">
                  {testResult.data.results.slice(0, 5).map((item: any, index: number) => (
                    <div key={index} className="card bg-base-200 p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.title || item.name}</span>
                        <span className="badge badge-primary">{item.vote_average?.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-base-content/70 mt-1">
                        {item.release_date || item.first_air_date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

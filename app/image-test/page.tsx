'use client';

import Image from 'next/image';

export default function ImageTestPage() {
  const testImages = [
    'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', // 复仇者联盟
    'https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg', // 蜘蛛侠
    'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', // 钢铁侠
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">图片加载测试</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {testImages.map((src, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative aspect-[3/4]">
              <Image
                src={src}
                alt={`测试图片 ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">图片 {index + 1}</p>
              <p className="text-xs text-gray-400 break-all">{src}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-base-100 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">原始 img 标签测试</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testImages.map((src, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={src}
                  alt={`原始图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">原始 img - 图片 {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

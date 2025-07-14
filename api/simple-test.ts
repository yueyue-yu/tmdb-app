/**
 * 独立的API测试脚本
 * 可以在浏览器控制台中直接运行
 */

// 简单的API测试函数，不依赖其他模块
async function simpleApiTest() {
  const API_KEY = 'c07245f6cabd71848d42faa2949c0f61';
  const BASE_URL = 'https://api.themoviedb.org/3';
  
  console.log('🚀 开始简单API测试...');
  
  try {
    // 测试1: 基础连接
    console.log('📡 测试基础连接...');
    const configResponse = await fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`);
    
    if (!configResponse.ok) {
      throw new Error(`HTTP ${configResponse.status}: ${configResponse.statusText}`);
    }
    
    const configData = await configResponse.json();
    console.log('✅ 基础连接成功');
    console.log('📝 配置信息:', configData);
    
    // 测试2: 获取热门电影
    console.log('🎬 测试电影API...');
    const moviesResponse = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`);
    
    if (!moviesResponse.ok) {
      throw new Error(`HTTP ${moviesResponse.status}: ${moviesResponse.statusText}`);
    }
    
    const moviesData = await moviesResponse.json();
    console.log('✅ 电影API测试成功');
    console.log(`📊 获取到 ${moviesData.results?.length || 0} 部电影`);
    
    if (moviesData.results && moviesData.results.length > 0) {
      console.log('🎭 第一部电影:', moviesData.results[0].title);
    }
    
    console.log('🎉 所有测试通过！API工作正常');
    return true;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ API测试失败:', errorMessage);
    console.error('🔧 请检查:');
    console.error('  1. 网络连接是否正常');
    console.error('  2. API密钥是否有效');
    console.error('  3. TMDB服务是否可用');
    return false;
  }
}

// 如果在浏览器环境中，添加到全局对象
if (typeof window !== 'undefined') {
  (window as any).simpleApiTest = simpleApiTest;
  console.log('💡 在浏览器控制台中运行 simpleApiTest() 来测试API');
}

// 如果在Node.js环境中，直接运行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = simpleApiTest;
}

export default simpleApiTest;

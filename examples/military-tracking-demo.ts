/**
 * 军事资产追踪演示
 * Military Asset Tracking Demo
 */

import {
  fetchOpenSkyMilitary,
  fetchMilitaryAircraft,
  predictTrajectory,
  type MilitaryAircraft,
} from '../src/services/military-tracking';

// ==================== 演示1: 获取全球军机位置 ====================

async function demo1_GlobalMilitaryAircraft() {
  console.log('\n=== 演示1: 全球军用飞机追踪（OpenSky免费API）===\n');
  
  const aircraft = await fetchOpenSkyMilitary();
  
  console.log(`发现 ${aircraft.length} 架军用飞机`);
  
  // 按国家分组
  const byCountry = aircraft.reduce((acc, plane) => {
    acc[plane.country] = (acc[plane.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n按国家统计:');
  Object.entries(byCountry).forEach(([country, count]) => {
    console.log(`  ${country}: ${count}架`);
  });
  
  // 显示前5架飞机详情
  console.log('\n前5架飞机详情:');
  aircraft.slice(0, 5).forEach(plane => {
    console.log(`
      呼号: ${plane.callsign}
      国家: ${plane.country}
      位置: ${plane.latitude.toFixed(4)}°N, ${plane.longitude.toFixed(4)}°E
      高度: ${(plane.altitude / 1000).toFixed(1)} km
      速度: ${(plane.velocity * 3.6).toFixed(0)} km/h
      航向: ${plane.heading}°
      类型: ${plane.category}
    `);
  });
}

// ==================== 演示2: 区域军机监控 ====================

async function demo2_RegionalTracking() {
  console.log('\n=== 演示2: 东亚区域军机监控 ===\n');
  
  // 假设有ADS-B Exchange API密钥
  const API_KEY = process.env.ADSB_API_KEY || 'demo_key';
  
  // 监控南海区域
  const southChinaSea = {
    lat: 12.0,
    lon: 116.0,
    radius: 500, // 公里
  };
  
  try {
    const aircraft = await fetchMilitaryAircraft(API_KEY, southChinaSea);
    
    console.log(`南海区域发现 ${aircraft.length} 架军机`);
    
    aircraft.forEach(plane => {
      console.log(`
        ${plane.callsign} (${plane.country})
        类型: ${plane.type}
        位置: ${plane.latitude.toFixed(4)}°, ${plane.longitude.toFixed(4)}°
        高度: ${(plane.altitude / 1000).toFixed(1)} km
        用途: ${plane.category}
      `);
    });
  } catch (error) {
    console.log('需要有效的ADS-B API密钥，请访问 https://www.adsbexchange.com/');
  }
}

// ==================== 演示3: 轨迹预测 ====================

async function demo3_TrajectoryPrediction() {
  console.log('\n=== 演示3: 飞行轨迹预测 ===\n');
  
  // 模拟历史轨迹数据（实际应从数据库读取）
  const mockHistory = [
    { lat: 35.0, lon: 140.0, timestamp: Date.now() / 1000 - 3600, heading: 45, velocity: 250 },
    { lat: 35.5, lon: 140.5, timestamp: Date.now() / 1000 - 2400, heading: 45, velocity: 250 },
    { lat: 36.0, lon: 141.0, timestamp: Date.now() / 1000 - 1200, heading: 45, velocity: 250 },
    { lat: 36.5, lon: 141.5, timestamp: Date.now() / 1000 - 600, heading: 45, velocity: 250 },
    { lat: 37.0, lon: 142.0, timestamp: Date.now() / 1000, heading: 45, velocity: 250 },
  ];
  
  const prediction = predictTrajectory(mockHistory, 6);
  
  console.log(`预测意图: ${prediction.intent}`);
  console.log(`置信度: ${(prediction.confidence * 100).toFixed(1)}%`);
  console.log('\n未来6小时预测位置:');
  
  prediction.positions.forEach((pos, i) => {
    const hours = i + 1;
    const time = new Date(pos.timestamp * 1000);
    console.log(`  ${hours}小时后 (${time.toLocaleTimeString()}): ${pos.lat.toFixed(4)}°, ${pos.lon.toFixed(4)}°`);
  });
}

// ==================== 演示4: 异常检测 ====================

function demo4_AnomalyDetection(aircraft: MilitaryAircraft[]) {
  console.log('\n=== 演示4: 异常活动检测 ===\n');
  
  // 检测异常高速飞行
  const highSpeed = aircraft.filter(a => a.velocity > 300); // > 1080 km/h
  console.log(`高速飞行 (>1080km/h): ${highSpeed.length}架`);
  
  // 检测低空飞行
  const lowAltitude = aircraft.filter(a => a.altitude < 1000 && a.altitude > 0);
  console.log(`低空飞行 (<1km): ${lowAltitude.length}架`);
  
  // 检测特定区域集中
  const concentrationArea = {
    lat: 25.0,
    lon: 121.0,
    radius: 100, // km
  };
  
  const concentrated = aircraft.filter(a => {
    const distance = calculateDistance(
      concentrationArea.lat,
      concentrationArea.lon,
      a.latitude,
      a.longitude
    );
    return distance < concentrationArea.radius;
  });
  
  if (concentrated.length > 3) {
    console.log(`\n⚠️  警告: 台湾海峡区域发现 ${concentrated.length} 架军机集中`);
    concentrated.forEach(a => {
      console.log(`  - ${a.callsign} (${a.country}) @ ${a.altitude}m`);
    });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ==================== 演示5: 地球仪可视化数据 ====================

async function demo5_GlobeVisualization() {
  console.log('\n=== 演示5: 生成地球仪可视化数据 ===\n');
  
  const aircraft = await fetchOpenSkyMilitary();
  
  // 转换为GeoJSON格式（供deck.gl使用）
  const geoJSON = {
    type: 'FeatureCollection',
    features: aircraft.map(plane => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [plane.longitude, plane.latitude, plane.altitude],
      },
      properties: {
        callsign: plane.callsign,
        country: plane.country,
        velocity: plane.velocity,
        heading: plane.heading,
        category: plane.category,
        icon: getIconByCategory(plane.category),
        color: getColorByCountry(plane.country),
      },
    })),
  };
  
  console.log(`生成 ${geoJSON.features.length} 个地理标记点`);
  console.log('\nGeoJSON 示例:');
  console.log(JSON.stringify(geoJSON.features[0], null, 2));
  
  return geoJSON;
}

function getIconByCategory(category: string): string {
  const icons: Record<string, string> = {
    transport: '✈️',
    tanker: '🛢️',
    awacs: '📡',
    patrol: '🔍',
    unknown: '❓',
  };
  return icons[category] || '✈️';
}

function getColorByCountry(country: string): [number, number, number] {
  const colors: Record<string, [number, number, number]> = {
    'United States': [0, 100, 200],
    'Russia': [200, 0, 0],
    'China': [200, 0, 0],
    'United Kingdom': [0, 150, 100],
  };
  return colors[country] || [128, 128, 128];
}

// ==================== 运行所有演示 ====================

async function runAllDemos() {
  console.log('='.repeat(60));
  console.log('军事资产追踪系统演示');
  console.log('='.repeat(60));
  
  try {
    await demo1_GlobalMilitaryAircraft();
    await demo2_RegionalTracking();
    await demo3_TrajectoryPrediction();
    
    const aircraft = await fetchOpenSkyMilitary();
    demo4_AnomalyDetection(aircraft);
    
    await demo5_GlobeVisualization();
    
    console.log('\n' + '='.repeat(60));
    console.log('演示完成！');
    console.log('='.repeat(60));
    console.log('\n使用说明:');
    console.log('1. 免费方案: 使用 fetchOpenSkyMilitary() - 完全免费');
    console.log('2. 付费方案: 使用 fetchMilitaryAircraft() - 需要API密钥');
    console.log('3. API申请: https://www.adsbexchange.com/');
    console.log('\n⚠️  法律声明: 仅供学术研究，遵守当地法律');
    
  } catch (error) {
    console.error('演示错误:', error);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runAllDemos();
}

export {
  demo1_GlobalMilitaryAircraft,
  demo2_RegionalTracking,
  demo3_TrajectoryPrediction,
  demo4_AnomalyDetection,
  demo5_GlobeVisualization,
};

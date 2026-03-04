/**
 * Military Asset Tracking - 军事资产追踪系统
 * 基于公开OSINT数据源（ADS-B, AIS, 卫星图像）
 */

export interface MilitaryAircraft {
  icao24: string; // 唯一识别码
  callsign: string;
  country: string;
  latitude: number;
  longitude: number;
  altitude: number; // 米
  velocity: number; // 米/秒
  heading: number; // 度
  timestamp: number;
  category: 'transport' | 'tanker' | 'awacs' | 'patrol' | 'unknown';
  registration: string;
  type: string; // C-17, KC-135等
}

export interface MilitaryVessel {
  mmsi: string; // 船舶识别码
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  speed: number; // 节
  course: number; // 度
  timestamp: number;
  category: 'carrier' | 'destroyer' | 'submarine' | 'amphibious' | 'supply' | 'unknown';
  displacement: number; // 吨
  class: string; // Nimitz级等
}

export interface TrajectoryPrediction {
  positions: Array<{ lat: number; lon: number; timestamp: number }>;
  confidence: number;
  estimatedDestination?: { lat: number; lon: number; name: string };
  intent: 'patrol' | 'transport' | 'refuel' | 'reconnaissance' | 'unknown';
}

// =================ADS-B Exchange API集成 ====================

const ADSB_CONFIG = {
  // 免费层使用rapidapi.com，付费使用adsbexchange.com
  apiUrl: 'https://adsbexchange-com1.p.rapidapi.com/v2',
  endpoints: {
    aircraft: '/mil', // 军用飞机过滤
    history: '/lat/{lat}/lon/{lon}/dist/{dist}',
  },
  // 军用飞机识别码范围
  militaryICAO: {
    US: ['AE', 'AF'], // 美国
    Russia: ['15'], // 俄罗斯
    China: ['78', '79'], // 中国
    UK: ['43'], // 英国
  },
};

/**
 * 获取全球军用飞机实时位置
 */
export async function fetchMilitaryAircraft(
  apiKey: string,
  region?: { lat: number; lon: number; radius: number }
): Promise<MilitaryAircraft[]> {
  try {
    const url = region
      ? `${ADSB_CONFIG.apiUrl}/lat/${region.lat}/lon/${region.lon}/dist/${region.radius}/`
      : `${ADSB_CONFIG.apiUrl}/mil/`;

    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'adsbexchange-com1.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error(`ADS-B API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.ac || [])
      .filter((aircraft: any) => isMilitary(aircraft))
      .map((aircraft: any) => ({
        icao24: aircraft.hex,
        callsign: aircraft.flight?.trim() || 'N/A',
        country: getCountryFromICAO(aircraft.hex),
        latitude: aircraft.lat,
        longitude: aircraft.lon,
        altitude: aircraft.alt_baro || 0,
        velocity: (aircraft.gs || 0) * 0.51444, // 转换为m/s
        heading: aircraft.track || 0,
        timestamp: aircraft.now || Date.now() / 1000,
        category: classifyAircraft(aircraft),
        registration: aircraft.r || 'Unknown',
        type: aircraft.t || 'Unknown',
      }));
  } catch (error) {
    console.error('Military aircraft fetch error:', error);
    return [];
  }
}

function isMilitary(aircraft: any): boolean {
  const hex = aircraft.hex?.toUpperCase() || '';
  // 检查是否为军用ICAO代码
  return Object.values(ADSB_CONFIG.militaryICAO).some(codes => 
    codes.some(code => hex.startsWith(code))
  );
}

function getCountryFromICAO(icao: string): string {
  const prefix = icao.substring(0, 2).toUpperCase();
  if (ADSB_CONFIG.militaryICAO.US.includes(prefix)) return 'United States';
  if (ADSB_CONFIG.militaryICAO.Russia.includes(prefix)) return 'Russia';
  if (ADSB_CONFIG.militaryICAO.China.includes(prefix)) return 'China';
  if (ADSB_CONFIG.militaryICAO.UK.includes(prefix)) return 'United Kingdom';
  return 'Unknown';
}

function classifyAircraft(aircraft: any): MilitaryAircraft['category'] {
  const type = (aircraft.t || '').toUpperCase();
  const callsign = (aircraft.flight || '').toUpperCase();
  
  // 运输机
  if (type.includes('C-17') || type.includes('C-130') || type.includes('IL-76') || 
      type.includes('Y-20') || callsign.includes('RCH')) {
    return 'transport';
  }
  
  // 加油机
  if (type.includes('KC-') || type.includes('IL-78') || callsign.includes('QID')) {
    return 'tanker';
  }
  
  // 预警机
  if (type.includes('E-3') || type.includes('E-2')) {
    return 'awacs';
  }
  
  // 巡逻/侦察机
  if (type.includes('P-8') || type.includes('P-3')) {
    return 'patrol';
  }
  
  return 'unknown';
}

// ================= AIS船舶追踪集成 ====================

const AIS_CONFIG = {
  apiUrl: 'https://api.vesselfinder.com/v1',
  // 已知军舰MMSI列表（需持续更新）
  knownMilitary: {
    carriers: {
      '368962000': { name: 'USS Gerald R. Ford', class: 'Ford-class' },
      '369970393': { name: 'USS Nimitz', class: 'Nimitz-class' },
      '412440396': { name: 'Liaoning', class: 'Type 001' },
      '412731854': { name: 'Shandong', class: 'Type 002' },
    },
  },
};

/**
 * 获取军舰实时位置（基础示例）
 * 注意：项目已有military-vessels.ts服务，此为演示版本
 */
export async function fetchMilitaryVesselsBasic(
  _apiKey: string,
  _bbox?: { north: number; south: number; east: number; west: number }
): Promise<MilitaryVessel[]> {
  try {
    // 注意：免费API通常不提供军舰数据，需要企业版
    // 这里仅作示例，实际需要付费API或网页爬取
    const vessels: MilitaryVessel[] = [];
    
    // TODO: 实际API调用
    // const response = await fetch(`${AIS_CONFIG.apiUrl}/vessels`, {...});
    
    return vessels;
  } catch (error) {
    console.error('Military vessel fetch error:', error);
    return [];
  }
}

// ================= 轨迹预测算法 ====================

/**
 * 基于历史轨迹预测未来位置
 * 使用简化的线性预测，生产环境应使用Kalman滤波或LSTM
 */
export function predictTrajectory(
  history: Array<{ lat: number; lon: number; timestamp: number; heading: number; velocity: number }>,
  hoursAhead: number = 6
): TrajectoryPrediction {
  if (history.length < 2) {
    return {
      positions: [],
      confidence: 0,
      intent: 'unknown',
    };
  }

  const latest = history[history.length - 1]!;
  
  // 计算平均速度和航向
  const avgVelocity = latest.velocity; // m/s
  const avgHeading = latest.heading; // 度
  
  // 预测未来位置（每小时一个点）
  const predictions: Array<{ lat: number; lon: number; timestamp: number }> = [];
  
  for (let hour = 1; hour <= hoursAhead; hour++) {
    const seconds = hour * 3600;
    const distance = avgVelocity * seconds; // 米
    
    // 简化的大圆计算（实际应使用Haversine公式）
    const R = 6371000; // 地球半径（米）
    const bearing = (avgHeading * Math.PI) / 180;
    const lat1 = (latest.lat * Math.PI) / 180;
    const lon1 = (latest.lon * Math.PI) / 180;
    
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing)
    );
    
    const lon2 = lon1 + Math.atan2(
      Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1),
      Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
    );
    
    predictions.push({
      lat: (lat2 * 180) / Math.PI,
      lon: (lon2 * 180) / Math.PI,
      timestamp: latest.timestamp + seconds,
    });
  }
  
  // 意图识别
  const intent = identifyIntent(history);
  
  return {
    positions: predictions,
    confidence: calculateConfidence(history),
    intent,
  };
}

function identifyIntent(
  history: Array<{ lat: number; lon: number; heading: number; velocity: number }>
): TrajectoryPrediction['intent'] {
  if (history.length < 5) return 'unknown';
  
  // 计算航向变化标准差
  const headings = history.map(h => h.heading);
  const avgHeading = headings.reduce((a, b) => a + b, 0) / headings.length;
  const variance = headings.reduce((sum, h) => sum + Math.pow(h - avgHeading, 2), 0) / headings.length;
  const stdDev = Math.sqrt(variance);
  
  // 椭圆轨迹（巡逻）
  if (stdDev > 30 && stdDev < 90) {
    return 'patrol';
  }
  
  // 直线飞行（运输）
  if (stdDev < 15) {
    return 'transport';
  }
  
  // 螺旋/圆形（加油或侦察）
  if (stdDev > 90) {
    return 'refuel';
  }
  
  return 'unknown';
}

function calculateConfidence(history: Array<any>): number {
  // 基于数据点数量和一致性
  const dataPoints = history.length;
  const recency = Date.now() / 1000 - history[history.length - 1].timestamp;
  
  let confidence = Math.min(dataPoints / 10, 1.0);
  
  // 数据越新，置信度越高
  if (recency < 60) confidence *= 1.0;
  else if (recency < 300) confidence *= 0.9;
  else if (recency < 600) confidence *= 0.7;
  else confidence *= 0.5;
  
  return confidence;
}

// ================= 免费数据源示例 ====================

/**
 * OpenSky Network免费API（完全免费，无需密钥）
 */
export async function fetchOpenSkyMilitary(): Promise<MilitaryAircraft[]> {
  try {
    const response = await fetch('https://opensky-network.org/api/states/all');
    
    if (!response.ok) {
      throw new Error(`OpenSky API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.states || [])
      .filter((state: any) => isMilitaryByICAO(state[0]))
      .map((state: any) => ({
        icao24: state[0],
        callsign: state[1]?.trim() || 'N/A',
        country: getCountryFromICAO(state[0]),
        latitude: state[6],
        longitude: state[5],
        altitude: state[7] || 0,
        velocity: state[9] || 0,
        heading: state[10] || 0,
        timestamp: state[3] || Date.now() / 1000,
        category: 'unknown',
        registration: 'Unknown',
        type: 'Unknown',
      }))
      .filter((aircraft: MilitaryAircraft) => 
        aircraft.latitude !== null && aircraft.longitude !== null
      );
  } catch (error) {
    console.error('OpenSky fetch error:', error);
    return [];
  }
}

function isMilitaryByICAO(icao: string): boolean {
  const prefix = icao.substring(0, 2).toUpperCase();
  const allMilitaryCodes = Object.values(ADSB_CONFIG.militaryICAO).flat();
  return allMilitaryCodes.includes(prefix);
}

// ================= 配置说明 ====================

export const MILITARY_TRACKING_SETUP = {
  dataSources: {
    adsb: {
      name: 'ADS-B Exchange',
      cost: '$29.95/month',
      coverage: '全球军用运输机、加油机、预警机',
      url: 'https://www.adsbexchange.com/',
      realtime: '1-5秒更新',
    },
    opensky: {
      name: 'OpenSky Network',
      cost: '免费',
      coverage: '全球公开飞机（含部分军机）',
      url: 'https://opensky-network.org/',
      realtime: '10秒更新',
      note: '首选免费方案',
    },
    ais: {
      name: 'Marine Traffic',
      cost: '$99/month',
      coverage: '军用补给舰、两栖舰、航母',
      url: 'https://www.marinetraffic.com/',
      realtime: '1-2分钟更新',
    },
  },
  
  legalNote: `
    ⚠️ 法律声明：
    1. 仅使用公开广播的ADS-B/AIS信号
    2. 数据可能不完整或延迟
    3. 仅供学术研究和新闻报道
    4. 不得用于恐怖主义或犯罪活动
    5. 遵守所在国家法律法规
  `,
  
  limitations: [
    '隐身战斗机通常关闭ADS-B',
    '潜艇不发射AIS信号',
    '地面部队无法追踪',
    '部分军机可能使用虚假位置',
  ],
};

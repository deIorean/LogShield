// API Service for FastAPI Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============ LOGS API ============

export async function getLogs(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.severity) queryParams.append('severity', params.severity);
  if (params.source) queryParams.append('source', params.source);
  if (params.startDate) queryParams.append('start_date', params.startDate);
  if (params.endDate) queryParams.append('end_date', params.endDate);
  if (params.search) queryParams.append('search', params.search);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const query = queryParams.toString();
  return apiRequest(`/logs${query ? `?${query}` : ''}`);
}

export async function getLogById(logId) {
  return apiRequest(`/logs/${logId}`);
}

export async function parseLogFile(formData) {
  return apiRequest('/logs/parse', {
    method: 'POST',
    headers: {}, // Let browser set Content-Type for FormData
    body: formData,
  });
}

// ============ THREATS API ============

export async function getThreats(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.status) queryParams.append('status', params.status);
  if (params.severity) queryParams.append('severity', params.severity);
  if (params.type) queryParams.append('type', params.type);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const query = queryParams.toString();
  return apiRequest(`/threats${query ? `?${query}` : ''}`);
}

export async function getThreatById(threatId) {
  return apiRequest(`/threats/${threatId}`);
}

export async function updateThreatStatus(threatId, status) {
  return apiRequest(`/threats/${threatId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function acknowledgeAlert(alertId) {
  return apiRequest(`/alerts/${alertId}/acknowledge`, {
    method: 'POST',
  });
}

// ============ ANALYTICS API ============

export async function getDashboardStats() {
  return apiRequest('/analytics/dashboard');
}

export async function getLogTrends(timeRange = '24h') {
  return apiRequest(`/analytics/logs/trends?range=${timeRange}`);
}

export async function getThreatDistribution() {
  return apiRequest('/analytics/threats/distribution');
}

export async function getSeverityBreakdown() {
  return apiRequest('/analytics/severity');
}

export async function getTopSources(limit = 10) {
  return apiRequest(`/analytics/sources/top?limit=${limit}`);
}

// ============ RULES API ============

export async function getRules() {
  return apiRequest('/rules');
}

export async function createRule(ruleData) {
  return apiRequest('/rules', {
    method: 'POST',
    body: JSON.stringify(ruleData),
  });
}

export async function updateRule(ruleId, ruleData) {
  return apiRequest(`/rules/${ruleId}`, {
    method: 'PUT',
    body: JSON.stringify(ruleData),
  });
}

export async function deleteRule(ruleId) {
  return apiRequest(`/rules/${ruleId}`, {
    method: 'DELETE',
  });
}

export async function toggleRule(ruleId, enabled) {
  return apiRequest(`/rules/${ruleId}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled }),
  });
}

// ============ REAL-TIME / WEBSOCKET ============

export function createWebSocketConnection(onMessage, onError) {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/logs';
  
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('WebSocket message parse error:', e);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  return ws;
}

// ============ EXPORT API ============

export async function exportLogs(format = 'csv', filters = {}) {
  const queryParams = new URLSearchParams({ format, ...filters });
  return apiRequest(`/export/logs?${queryParams.toString()}`);
}

export async function exportThreats(format = 'csv') {
  return apiRequest(`/export/threats?format=${format}`);
}

// ============ HEALTH CHECK ============

export async function healthCheck() {
  return apiRequest('/health');
}

export default {
  getLogs,
  getLogById,
  parseLogFile,
  getThreats,
  getThreatById,
  updateThreatStatus,
  acknowledgeAlert,
  getDashboardStats,
  getLogTrends,
  getThreatDistribution,
  getSeverityBreakdown,
  getTopSources,
  getRules,
  createRule,
  updateRule,
  deleteRule,
  toggleRule,
  createWebSocketConnection,
  exportLogs,
  exportThreats,
  healthCheck,
};

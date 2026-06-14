"use client";

import useSWR from 'swr';
import { useState, useCallback } from 'react';

// Generic fetcher for SWR
const fetcher = async (url: string) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const response = await fetch(`${API_BASE_URL}${url}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Hook for fetching dashboard stats
export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR('/analytics/dashboard', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  return {
    stats: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Hook for fetching logs
export function useLogs(params: Record<string, string | number | undefined> = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });
  
  const query = queryParams.toString();
  const endpoint = `/logs${query ? `?${query}` : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher);

  return {
    logs: data?.logs || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Hook for fetching threats
export function useThreats(params: Record<string, string | number | undefined> = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });
  
  const query = queryParams.toString();
  const endpoint = `/threats${query ? `?${query}` : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
  });

  return {
    threats: data?.threats || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Hook for fetching log trends
export function useLogTrends(timeRange: string = '24h') {
  const { data, error, isLoading, mutate } = useSWR(
    `/analytics/logs/trends?range=${timeRange}`,
    fetcher,
    { refreshInterval: 60000 }
  );

  return {
    trends: data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Hook for fetching threat distribution
export function useThreatDistribution() {
  const { data, error, isLoading, mutate } = useSWR(
    '/analytics/threats/distribution',
    fetcher,
    { refreshInterval: 60000 }
  );

  return {
    distribution: data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Hook for real-time logs (mock for demo)
export function useRealtimeLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    setIsConnected(true);
    // In production, this would connect to WebSocket
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const addLog = useCallback((log: LogEntry) => {
    setLogs((prev) => [log, ...prev].slice(0, 100)); // Keep last 100 logs
  }, []);

  return {
    logs,
    isConnected,
    connect,
    disconnect,
    addLog,
  };
}

// Types
export interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

export interface Threat {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  source_ip: string;
  description: string;
  affected_systems: string[];
  indicators: string[];
}

export interface DashboardStats {
  total_logs: number;
  logs_today: number;
  active_threats: number;
  critical_alerts: number;
  logs_change: number;
  threats_change: number;
}

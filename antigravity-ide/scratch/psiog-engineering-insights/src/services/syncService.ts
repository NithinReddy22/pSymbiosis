import { ConnectorConfig, SyncLogEntry, ToolType } from '../types';

export interface DeltaSyncResult {
  updatedConnectors: ConnectorConfig[];
  newLogs: SyncLogEntry[];
  totalFetched: number;
  totalNew: number;
}

/**
 * Simulates an incremental delta sync from live connectors or mock endpoints,
 * querying only records created/updated after the stored watermark.
 */
export function runDeltaSync(
  connectors: ConnectorConfig[],
  specificTool?: ToolType
): DeltaSyncResult {
  const now = new Date().toISOString();
  const newLogs: SyncLogEntry[] = [];
  let totalFetched = 0;
  let totalNew = 0;

  const updatedConnectors = connectors.map(conn => {
    if (specificTool && conn.tool !== specificTool) return conn;

    // Simulate pulling delta changes since last watermark
    const deltaFetched = Math.floor(Math.random() * 8) + 2;
    const deltaInserted = Math.floor(deltaFetched * 0.4);
    const deltaUpdated = deltaFetched - deltaInserted;
    const durationMs = Math.floor(Math.random() * 800) + 350;

    totalFetched += deltaFetched;
    totalNew += deltaInserted;

    const log: SyncLogEntry = {
      id: `SYNC-${Date.now()}-${conn.tool}`,
      tool: conn.tool,
      syncTimestamp: now,
      recordsFetched: deltaFetched,
      recordsInserted: deltaInserted,
      recordsUpdated: deltaUpdated,
      durationMs,
      status: 'Success',
      watermark: now
    };

    newLogs.push(log);

    return {
      ...conn,
      lastSyncedAt: now,
      recordsCount: conn.recordsCount + deltaInserted
    };
  });

  return {
    updatedConnectors,
    newLogs,
    totalFetched,
    totalNew
  };
}

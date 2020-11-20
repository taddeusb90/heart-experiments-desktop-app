export interface SessionInfo {
  id?: number;
  sessionId: number;
  createdAt: Date;
  imageLocation: string;
  spectroMetric: number;
  type: string;
  prediction: number;
}

export interface Session {
  id?: number;
  session: number;
  createdAt: Date;
}

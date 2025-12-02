import { io, Socket } from 'socket.io-client';

/**
 * WebSocket service for managing Socket.IO connection
 * Provides a singleton pattern to ensure only one connection exists
 */
class WebSocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  /**
   * Get the WebSocket server URL from environment or use default
   */
  private getServerUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Remove /api/v1 if present to get base URL
    return apiUrl.replace(/\/api\/v1$/, '');
  }

  /**
   * Get or create the Socket.IO connection
   */
  getSocket(): Socket | null {
    if (typeof window === 'undefined') {
      return null; // Server-side rendering
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting) {
      return this.socket;
    }

    this.connect();
    return this.socket;
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('accessToken');
  }

  /**
   * Connect to the WebSocket server
   */
  private connect(): void {
    if (typeof window === 'undefined' || this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const serverUrl = this.getServerUrl();
    const token = this.getAuthToken();

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      reconnectionDelayMax: 5000,
      auth: token ? { token } : undefined,
      query: token ? { token } : undefined,
    });

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      this.isConnecting = false;
      this.notifyConnectionListeners(true);
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      this.notifyConnectionListeners(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.isConnecting = false;
      this.notifyConnectionListeners(false);
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      this.notifyConnectionListeners(false);
    }
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  /**
   * Notify all connection listeners
   */
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((callback) => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();


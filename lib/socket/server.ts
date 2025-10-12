import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { gameService } from "../services/game.service";
import { poolService } from "../services/pool.service";
import { SOCKET_EVENTS } from "../utils/constants";

export class GameSocketServer {
  private io: SocketIOServer;
  private gameTimers: Map<string, NodeJS.Timeout> = new Map();
  private poolRooms: Map<string, Set<string>> = new Map(); // poolId -> Set of userIds

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
      path: "/socket.io",
    });

    this.setupEventHandlers();
    console.log("🎮 WebSocket server initialized");
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`👤 User connected: ${socket.id}`);

      // Extract user info from handshake (you should pass userId from client)
      const userId = socket.handshake.auth.userId;

      // Join pool room
      socket.on(SOCKET_EVENTS.JOIN_POOL, async (data: { poolId: string }) => {
        const { poolId } = data;

        try {
          // Verify user is participant
          const participant = await poolService.getParticipant(poolId, userId);

          if (!participant) {
            socket.emit(SOCKET_EVENTS.ERROR, {
              message: "Not a participant in this pool",
            });
            return;
          }

          // Join room
          socket.join(poolId);

          // Track user in room
          if (!this.poolRooms.has(poolId)) {
            this.poolRooms.set(poolId, new Set());
          }
          this.poolRooms.get(poolId)!.add(userId);

          console.log(`👤 User ${userId} joined pool ${poolId}`);

          // Get current game state
          const gameState = await gameService.getGameState(poolId);
          socket.emit(SOCKET_EVENTS.POOL_UPDATED, gameState);

          // Notify others
          socket.to(poolId).emit(SOCKET_EVENTS.PLAYER_JOINED, {
            userId,
            poolId,
          });

          // If game is active, start timer updates
          if (gameState?.status === "active") {
            this.startGameTimerUpdates(poolId);
          }
        } catch (error) {
          console.error("Join pool error:", error);
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to join pool" });
        }
      });

      // Leave pool room
      socket.on(SOCKET_EVENTS.LEAVE_POOL, async (data: { poolId: string }) => {
        const { poolId } = data;

        socket.leave(poolId);

        // Remove from tracking
        this.poolRooms.get(poolId)?.delete(userId);

        console.log(`👤 User ${userId} left pool ${poolId}`);

        // Notify others
        socket.to(poolId).emit(SOCKET_EVENTS.PLAYER_LEFT, {
          userId,
          poolId,
        });
      });

      // Request game status
      socket.on(
        SOCKET_EVENTS.REQUEST_STATUS,
        async (data: { poolId: string }) => {
          const { poolId } = data;

          try {
            const gameState = await gameService.getGameState(poolId);
            socket.emit(SOCKET_EVENTS.POOL_UPDATED, gameState);
          } catch (error) {
            console.error("Request status error:", error);
            socket.emit(SOCKET_EVENTS.ERROR, {
              message: "Failed to get game status",
            });
          }
        }
      );

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`👤 User disconnected: ${socket.id}`);

        // Clean up from all rooms
        this.poolRooms.forEach((users, poolId) => {
          if (users.has(userId)) {
            users.delete(userId);
            socket
              .to(poolId)
              .emit(SOCKET_EVENTS.PLAYER_LEFT, { userId, poolId });
          }
        });
      });
    });
  }

  /**
   * Broadcast pool update to all participants
   */
  async broadcastPoolUpdate(poolId: string) {
    try {
      const gameState = await gameService.getGameState(poolId);
      this.io.to(poolId).emit(SOCKET_EVENTS.POOL_UPDATED, gameState);
    } catch (error) {
      console.error("Broadcast pool update error:", error);
    }
  }

  /**
   * Broadcast game start
   */
  broadcastGameStart(poolId: string) {
    this.io.to(poolId).emit(SOCKET_EVENTS.GAME_STARTED, { poolId });
    this.startGameTimerUpdates(poolId);
  }

  /**
   * Broadcast game end
   */
  async broadcastGameEnd(poolId: string) {
    this.stopGameTimerUpdates(poolId);

    // Get final results
    const results = await gameService.getGameResults(poolId);

    this.io.to(poolId).emit(SOCKET_EVENTS.GAME_ENDED, {
      poolId,
      results,
    });
  }

  /**
   * Broadcast problem solved
   */
  broadcastProblemSolved(poolId: string, userId: string, problemId: string) {
    this.io.to(poolId).emit(SOCKET_EVENTS.PROBLEM_SOLVED, {
      poolId,
      userId,
      problemId,
    });

    // Update leaderboard
    this.broadcastLeaderboardUpdate(poolId);
  }

  /**
   * Broadcast leaderboard update
   */
  async broadcastLeaderboardUpdate(poolId: string) {
    try {
      const gameState = await gameService.getGameState(poolId);
      if (gameState) {
        this.io.to(poolId).emit(SOCKET_EVENTS.LEADERBOARD_UPDATED, {
          poolId,
          leaderboard: gameState.leaderboard,
        });
      }
    } catch (error) {
      console.error("Broadcast leaderboard update error:", error);
    }
  }

  /**
   * Broadcast power-up usage
   */
  broadcastPowerUpUsed(
    poolId: string,
    userId: string,
    powerUpType: string,
    problemId?: string
  ) {
    this.io.to(poolId).emit(SOCKET_EVENTS.POWER_UP_USED, {
      poolId,
      userId,
      powerUpType,
      problemId,
    });
  }

  /**
   * Start periodic timer updates for a game
   */
  private startGameTimerUpdates(poolId: string) {
    // Clear existing timer if any
    this.stopGameTimerUpdates(poolId);

    // Update every 10 seconds
    const timer = setInterval(async () => {
      try {
        const gameState = await gameService.getGameState(poolId);

        if (!gameState || gameState.status !== "active") {
          this.stopGameTimerUpdates(poolId);
          return;
        }

        // Broadcast time remaining
        this.io.to(poolId).emit(SOCKET_EVENTS.POOL_UPDATED, {
          timeRemaining: gameState.timeRemaining,
        });

        // Send warnings at specific intervals
        if (gameState.timeRemaining === 300) {
          // 5 minutes
          this.io.to(poolId).emit(SOCKET_EVENTS.TIME_WARNING, {
            poolId,
            timeRemaining: 300,
            message: "5 minutes remaining!",
          });
        } else if (gameState.timeRemaining === 60) {
          // 1 minute
          this.io.to(poolId).emit(SOCKET_EVENTS.TIME_WARNING, {
            poolId,
            timeRemaining: 60,
            message: "1 minute remaining!",
          });
        } else if (gameState.timeRemaining === 30) {
          // 30 seconds
          this.io.to(poolId).emit(SOCKET_EVENTS.TIME_WARNING, {
            poolId,
            timeRemaining: 30,
            message: "30 seconds remaining!",
          });
        }

        // Auto-end game when time expires
        if (gameState.timeRemaining <= 0) {
          await poolService.completePool(poolId);
          await this.broadcastGameEnd(poolId);
          this.stopGameTimerUpdates(poolId);
        }
      } catch (error) {
        console.error("Timer update error:", error);
      }
    }, 10000); // Every 10 seconds

    this.gameTimers.set(poolId, timer);
  }

  /**
   * Stop timer updates for a game
   */
  private stopGameTimerUpdates(poolId: string) {
    const timer = this.gameTimers.get(poolId);
    if (timer) {
      clearInterval(timer);
      this.gameTimers.delete(poolId);
    }
  }

  /**
   * Get connected users count in a pool
   */
  getPoolUserCount(poolId: string): number {
    return this.poolRooms.get(poolId)?.size || 0;
  }

  /**
   * Broadcast to all connected clients
   */
  broadcastGlobal(event: string, data: any) {
    this.io.emit(event, data);
  }

  /**
   * Clean up on server shutdown
   */
  destroy() {
    // Clear all timers
    this.gameTimers.forEach((timer) => clearInterval(timer));
    this.gameTimers.clear();

    // Close socket server
    this.io.close();
    console.log("🛑 WebSocket server closed");
  }
}

// Singleton instance (initialized when HTTP server is created)
let socketServer: GameSocketServer | null = null;

export function initializeSocketServer(
  httpServer: HTTPServer
): GameSocketServer {
  if (!socketServer) {
    socketServer = new GameSocketServer(httpServer);
  }
  return socketServer;
}

export function getSocketServer(): GameSocketServer {
  if (!socketServer) {
    throw new Error("Socket server not initialized");
  }
  return socketServer;
}

// Export for external use
export { socketServer };

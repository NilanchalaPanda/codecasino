import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/server";
import { poolService } from "@/lib/services/pool.service";
import { userService } from "@/lib/services/user.service";
import { GameDifficulty, GameType } from "@/lib/types";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/utils/constants";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Check if user is banned
    const isBanned = await userService.isBanned(user.id);
    if (isBanned) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.ACCOUNT_BANNED },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      difficulty,
      gameType,
      entryFee,
      maxPlayers,
      isPrivate,
      scheduledStart,
    } = body;

    // Validate inputs
    if (!difficulty || !Object.values(GameDifficulty).includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: "Invalid difficulty level" },
        { status: 400 }
      );
    }

    if (!gameType || !Object.values(GameType).includes(gameType)) {
      return NextResponse.json(
        { success: false, error: "Invalid game type" },
        { status: 400 }
      );
    }

    if (!entryFee || entryFee < 10) {
      return NextResponse.json(
        { success: false, error: "Entry fee must be at least 10 VP" },
        { status: 400 }
      );
    }

    // Check VP balance
    const vpBalance = await userService.getVPBalance(user.id);
    if (vpBalance < entryFee) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.INSUFFICIENT_VP },
        { status: 400 }
      );
    }

    // Create pool
    const result = await poolService.createPool(
      user.id,
      difficulty,
      gameType,
      entryFee,
      maxPlayers || 10,
      isPrivate || false,
      scheduledStart ? new Date(scheduledStart) : undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Auto-join the creator
    await poolService.joinPool(user.id, result.poolId!);

    return NextResponse.json({
      success: true,
      message: SUCCESS_MESSAGES.POOL_CREATED,
      data: {
        poolId: result.poolId,
      },
    });
  } catch (error: any) {
    console.error("Create pool error:", error);
    return NextResponse.json(
      { success: false, error: error.message || ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

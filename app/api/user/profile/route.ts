import { requireAuth } from "@/lib/supabase/server";
import { userService } from "@/lib/services/user.service";
import { errorResponse, successResponse } from "@/lib/utils/response";
import { log, LogLevel } from "@/lib/utils/logger";

export async function GET() {
  try {
    const user = await requireAuth();
    const profile = await userService.getProfile(user.id);

    if (!profile) {
      return errorResponse("Profile not found", 404);
    }

    return successResponse(profile, "Profile fetched successfully");
  } catch (error: any) {
    log(LogLevel.ERROR, "Get profile error", error);
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { displayName, bio, country, avatarUrl } = body;

    const updated = await userService.updateProfile(user.id, {
      display_name: displayName,
      bio,
      country,
      avatar_url: avatarUrl,
    });

    log(LogLevel.INFO, "Profile updated", { userId: user.id });
    return successResponse(updated, "Profile updated successfully");
  } catch (error: any) {
    log(LogLevel.ERROR, "Update profile error", error);
    return errorResponse(error.message, 500);
  }
}

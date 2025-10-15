"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Edit2, Save, Link as LinkIcon } from "lucide-react";

interface Profile {
  displayName: string;
  bio: string;
  country: string;
  leetcodeUsername: string;
  leetcodeVerified: boolean;
}

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [linkingLeetcode, setLinkingLeetcode] = useState(false);
  const [leetcodeInput, setLeetcodeInput] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      setProfile(data.data);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName,
          bio: profile.bio,
          country: profile.country,
        }),
      });
      setEditing(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLinkLeetcode = async () => {
    setLinkingLeetcode(true);
    try {
      await fetch("/api/leetcode/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: leetcodeInput }),
      });
      alert("LeetCode account linked!");
    } catch (error) {
      console.error("Link failed:", error);
    } finally {
      setLinkingLeetcode(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-lg bg-white border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Profile Settings
            </h1>
            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition flex items-center gap-2"
            >
              {editing ? (
                <>
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save"}
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={profile?.displayName || ""}
                onChange={(e) =>
                  setProfile({ ...profile!, displayName: e.target.value })
                }
                disabled={!editing}
                className="w-full"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bio
              </label>
              <textarea
                value={profile?.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile!, bio: e.target.value })
                }
                disabled={!editing}
                rows={3}
                className="w-full"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={profile?.country || ""}
                onChange={(e) =>
                  setProfile({ ...profile!, country: e.target.value })
                }
                disabled={!editing}
                className="w-full"
              />
            </div>

            {/* LeetCode Integration */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                LeetCode Integration
              </h3>

              {profile?.leetcodeVerified ? (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="text-green-800 font-medium">
                    ✓ Linked to @{profile.leetcodeUsername}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-600 mb-4">
                    Link your LeetCode account to participate in contests
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter LeetCode username"
                      value={leetcodeInput}
                      onChange={(e) => setLeetcodeInput(e.target.value)}
                      className="flex-1"
                    />
                    <button
                      onClick={handleLinkLeetcode}
                      disabled={linkingLeetcode}
                      className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {linkingLeetcode ? "Linking..." : "Link"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

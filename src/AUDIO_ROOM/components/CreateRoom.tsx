"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

// ======================================================
// UI CLASSES
// ======================================================

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white/60 px-3 py-2 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400/20";

const sectionClass =
  "rounded-xl border border-slate-200/60 bg-gradient-to-b from-white/70 to-slate-50/40 backdrop-blur-md px-7 py-5 shadow-sm transition-all duration-200";

const formatLocalDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// ======================================================
// TYPES
// ======================================================

type RoomRole = "host" | "moderator" | "speaker" | "listener";
type RoleKey = "Host" | "Modifiers" | "Speakers" | "Joinees";

interface RoleAssignment {
  assignmentType: "crm-role" | "specific-user";
  crmRole?: string;
  userId?: number;
  assignedRoomRole: RoomRole;
}

interface JoinPermission {
  permissionType: "crm-role" | "guest";
  crmRole?: string;
}

// ======================================================
// COMPONENT
// ======================================================

const CreateRoom = () => {
  const router = useRouter();

  // ======================================================
  // FORM STATE
  // ======================================================

  const [formData, setFormData] = useState({
    roomName: "",
    roomDescription: "",
    roomType: "live",
    startTime: "",
    participantLimit: 50,
    visibility: "private",
  });

  // ======================================================
  // ROOM ROLE PERMISSIONS
  // ======================================================

  const [rolePermissions, setRolePermissions] = useState<Record<RoleKey, string[]>>({
    Host: [],
    Modifiers: [],
    Speakers: [],
    Joinees: [],
  });

  // ======================================================
  // SPECIFIC USER IDS (stores user objects)
  // ======================================================

  const [otherUserIds, setOtherUserIds] = useState<Record<RoleKey, any[]>>({
    Host: [],
    Modifiers: [],
    Speakers: [],
    Joinees: [],
  });

  const [userSearch, setUserSearch] = useState({
    Host: "",
    Modifiers: "",
    Speakers: "",
    Joinees: "",
  });

  // ======================================================
  // API STATE
  // ======================================================

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const isScheduledRoom = formData.roomType === "scheduled";
  const minScheduleTime = formatLocalDateTime(new Date());

  // ======================================================
  // ROLE OPTIONS
  // ======================================================

  const roleOptions = {
    Host: ["Modifier", "HR", "other"],
    Modifiers: ["Modifier", "HR", "other"],
    Speakers: ["Modifier", "HR", "other"],
    Joinees: ["Modifier", "HR", "Employee", "Client", "Guests"],
  };

  // ======================================================
  // HANDLE FORM CHANGES
  // ======================================================

  const handleFormChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "roomType" && value !== "scheduled") {
        next.startTime = "";
      }

      return next;
    });

    setError("");
  };

  // ======================================================
  // HANDLE ROLE CHECKBOX
  // ======================================================

  const handleCheckboxChange = (role: RoleKey, option: string) => {
    setRolePermissions((prev) => {
      const currentOptions = prev[role] || [];
      const alreadySelected = currentOptions.includes(option);

      return {
        ...prev,
        [role]: alreadySelected
          ? currentOptions.filter((item) => item !== option)
          : [...currentOptions, option],
      };
    });
  };

  // ======================================================
  // ADD SPECIFIC USER ID
  // ======================================================

  const handleAddOtherId = (role: RoleKey, user: any) => {
    if (!user || !user.id) {
      console.warn("❌ Invalid user object:", user);
      return;
    }

    setOtherUserIds((prev) => ({
      ...prev,
      [role]: [...(prev[role] || []), user],
    }));

    setUserSearch((prev) => ({
      ...prev,
      [role]: "",
    }));
  };

  // ======================================================
  // REMOVE USER ID
  // ======================================================

  const handleRemoveOtherId = (role: RoleKey, index: number) => {
    setOtherUserIds((prev) => ({
      ...prev,
      [role]: prev[role].filter((_, i) => i !== index),
    }));
  };

  // ======================================================
  // GET USERS LIST
  // ======================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await apiFetch("/audio-room/users");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setAllUsers(data.data || []);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ======================================================
  // BUILD PAYLOAD
  // ======================================================

  const buildRoleAssignments = (): RoleAssignment[] => {
    const assignments: RoleAssignment[] = [];
    const roleMap = {
      Host: "host",
      Modifiers: "moderator",
      Speakers: "speaker",
    } as const;

    (Object.keys(roleMap) as Array<keyof typeof roleMap>).forEach((roleKey) => {
      const assignedRole = roleMap[roleKey];

      (rolePermissions[roleKey] || [])
        .filter((role) => role !== "other")
        .forEach((crmRole) => {
          assignments.push({
            assignmentType: "crm-role",
            crmRole,
            assignedRoomRole: assignedRole,
          });
        });

      (otherUserIds[roleKey] || []).forEach((userObj: any) => {
        if (userObj?.id) {
          assignments.push({
            assignmentType: "specific-user",
            crmRole: undefined,
            userId: Number(userObj.id),
            assignedRoomRole: assignedRole,
          });
        }
      });
    });

    return assignments;
  };

  const buildJoinPermissions = (): JoinPermission[] => {
    const permissions: JoinPermission[] = [];

    (rolePermissions.Joinees || []).forEach((role) => {
      if (role === "Guests") {
        permissions.push({ permissionType: "guest" });
      } else {
        permissions.push({
          permissionType: "crm-role",
          crmRole: role,
        });
      }
    });

    return permissions;
  };

  const buildPayload = () => {
    return {
      roomConfig: {
        roomName: formData.roomName,
        roomDescription: formData.roomDescription,
        roomType: formData.roomType,
        roomStatus: isScheduledRoom ? "scheduled" : "live",
        startTime: isScheduledRoom ? formData.startTime || null : null,
        participantLimit: Number(formData.participantLimit),
        visibility: formData.visibility,
        allowGuestUsers: rolePermissions.Joinees?.includes("Guests") || false,
        redirectAfterRoomEnd: "/room-ended",
      },
      roleAssignments: buildRoleAssignments(),
      joinPermissions: buildJoinPermissions(),
      notifications: [],
      invites: [],
    };
  };

  const saveRoomToDatabase = async () => {
    try {
      setIsLoading(true);
      setError("");

      const payload = buildPayload();

      if (!payload.roomConfig.roomName.trim()) {
        setError("Room name is required");
        return;
      }

      if (isScheduledRoom) {
        if (!payload.roomConfig.startTime) {
          setError("Scheduled rooms need a start date and time");
          return;
        }
        if (new Date(payload.roomConfig.startTime).getTime() <= Date.now()) {
          setError("Scheduled start time must be in the future");
          return;
        }
      }

      const response = await apiFetch("/audio-room/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create room");
        return;
      }

      setSuccess(true);

      if (data?.data?.id) {
        router.push(`/audio-room/room/${data.data.id}`);
      }

      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-1 bg-slate-50/30">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Main Grid Splitter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE COLUMN: Basic Info & Strategy */}
          <div className="lg:col-span-5 flex flex-col gap-6 px-1">
            
            {/* Basic Info */}
            <section className={sectionClass}>
              <h2 className="text-[16px] font-semibold tracking-tight text-slate-800">Basic Info</h2>
              <p className="text-xs  mb-2 text-slate-400 mt-0.5 mb-4">
                Define the primary identification attributes for this room layout.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Room Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter architectural room header"
                    value={formData.roomName}
                    onChange={(e) => handleFormChange("roomName", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Room Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide structural context or context logs..."
                    value={formData.roomDescription}
                    onChange={(e) => handleFormChange("roomDescription", e.target.value)}
                    className={`${inputClass} resize-none min-h-[90px]`}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Deployment Type
                  </label>
                  <div className="flex gap-5 mt-1 bg-slate-100/60 border border-slate-200/40 p-1 rounded-lg w-fit">
                    <label className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer transition-all ${formData.roomType === "live" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
                      <input
                        type="radio"
                        name="roomType"
                        value="live"
                        checked={formData.roomType === "live"}
                        onChange={(e) => handleFormChange("roomType", e.target.value)}
                        className="sr-only"
                      />
                      Live Broadcast
                    </label>

                    <label className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer transition-all ${formData.roomType === "scheduled" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
                      <input
                        type="radio"
                        name="roomType"
                        value="scheduled"
                        checked={formData.roomType === "scheduled"}
                        onChange={(e) => handleFormChange("roomType", e.target.value)}
                        className="sr-only"
                      />
                      Scheduled Timeline
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Target Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    min={minScheduleTime}
                    disabled={!isScheduledRoom}
                    onChange={(e) => handleFormChange("startTime", e.target.value)}
                    className={`${inputClass} ${
                      !isScheduledRoom ? "cursor-not-allowed bg-slate-100/80 border-slate-200/50 text-slate-400" : ""
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* Room Strategy */}
            <section className={sectionClass}>
              <h2 className="text-[16px]font-semibold tracking-tight text-slate-800">Room Strategy</h2>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">
                Set organizational visibility thresholds and operational user ceilings.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">
                    Room Visibility
                  </label>
                  <div className="flex gap-4">
                    {["public", "private"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option}
                          checked={formData.visibility === option}
                          onChange={(e) => handleFormChange("visibility", e.target.value)}
                          className="w-3.5 h-3.5 border-slate-300 text-slate-900 focus:ring-slate-900/10 cursor-pointer accent-slate-900"
                        />
                        <span className="group-hover:text-slate-900 transition-colors capitalize">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Participant Limit
                  </label>
                  <input
                    type="number"
                    placeholder="Enter ceiling capacity"
                    value={formData.participantLimit}
                    onChange={(e) =>
                      handleFormChange("participantLimit", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT SIDE COLUMN: Permissions */}
          <div className="lg:col-span-7 h-full">
            <section className={`${sectionClass} h-full min-h-[540px]`}>
              <h2 className="text-[16px] font-semibold tracking-tight text-slate-800">Identity & Core Permissions</h2>
              <p className="text-xs  mb-2 text-slate-400 mt-0.5 mb-5">
                Grant role permissions to organizational teams or explicit individual identifiers.
              </p>

              <div className="flex flex-col gap-5">
                {Object.entries(roleOptions).map(([role, options]) => {
                  const roleKey = role as RoleKey;
                  return (
                    <div key={roleKey} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                      <label className="text-xs font-bold tracking-tight text-slate-700 mb-2.5 block">
                        {roleKey}
                      </label>

                      <div className="flex flex-col lg:flex-row gap-4 items-start">
                        {/* Checkboxes */}
                        <div className="flex flex-wrap gap-2 flex-1 w-full">
                          {options.map((option) => (
                            <label
                              key={option}
                              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                                rolePermissions[roleKey]?.includes(option)
                                  ? "bg-slate-900 text-white border-transparent shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-800"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={rolePermissions[roleKey]?.includes(option) || false}
                                onChange={() => handleCheckboxChange(roleKey, option)}
                                className="sr-only"
                              />
                              {option}
                            </label>
                          ))}
                        </div>

                        {/* Other User IDs Dropdown Engine */}
                        {rolePermissions[roleKey]?.includes("other") && (
                          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex-1 w-full transition-all">
                            <label className="text-[11px] font-bold text-slate-500 tracking-wide uppercase block mb-1.5">
                              Add Target Identifiers
                            </label>

                            <div className="flex gap-1 mb-2 relative">
                              <div className="relative w-full">
                                <input
                                  type="text"
                                  placeholder={loadingUsers ? "Indexing workspace architecture..." : "Filter user tags..."}
                                  value={userSearch[roleKey]}
                                  disabled={loadingUsers}
                                  onChange={(e) =>
                                    setUserSearch((prev) => ({
                                      ...prev,
                                      [roleKey]: e.target.value,
                                    }))
                                  }
                                  className={`${inputClass} text-xs py-1.5 bg-white`}
                                />

                                {userSearch[roleKey] && (
                                  <div className="absolute z-50 mt-1.5 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200/70 bg-white p-1 shadow-md ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {allUsers
                                      .filter((user) =>
                                        `${user.name} ${user.userid}`
                                          .toLowerCase()
                                          .includes(userSearch[roleKey].toLowerCase())
                                      )
                                      .slice(0, 6)
                                      .map((user) => (
                                        <div
                                          key={user.id}
                                          onClick={() => handleAddOtherId(roleKey, user)}
                                          className="cursor-pointer rounded-lg px-2.5 py-2 text-xs hover:bg-slate-50 transition-colors flex flex-col gap-0.5"
                                        >
                                          <div className="font-semibold text-slate-700">
                                            {user.name}
                                          </div>
                                          <div className="text-slate-400 text-[10px] font-medium flex items-center gap-1.5">
                                            <span>@{user.userid}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="text-slate-400/80">{user.role}</span>
                                          </div>
                                        </div>
                                      ))}
                                    {allUsers.filter((user) =>
                                      `${user.name} ${user.userid}`
                                        .toLowerCase()
                                        .includes(userSearch[roleKey].toLowerCase())
                                    ).length === 0 && (
                                      <div className="p-3 text-center text-xs text-slate-400 italic">
                                        No matching system records.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Display Added User Badge Array */}
                            {otherUserIds[roleKey]?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {otherUserIds[roleKey].map((user: any, userIdx: number) => (
                                  <div
                                    key={`${user.id}-${userIdx}`}
                                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 shadow-sm"
                                  >
                                    <span>{user.name || user.userid}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOtherId(roleKey, userIdx)}
                                      className="text-slate-400 hover:text-slate-600 transition-colors text-sm leading-none"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

        </div>

        {/* Action Bottom Tray */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-200/60 mt-2">
          {error && (
            <div className="w-full rounded-lg border border-red-200 bg-red-50/60 px-4 py-2.5 text-xs font-medium text-red-600 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="w-full rounded-lg border border-green-200 bg-green-50/60 px-4 py-2.5 text-xs font-medium text-green-600 flex items-center gap-2">
              <span>✨</span> Structural configuration active. Initializing dynamic pathing...
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => saveRoomToDatabase()}
              disabled={isLoading || !isScheduledRoom}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all shadow-sm hover:bg-slate-50 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading && isScheduledRoom ? "Scheduling..." : "Schedule Timeline"}
            </button>

            <button
              type="button"
              onClick={() => saveRoomToDatabase()}
              disabled={isLoading || isScheduledRoom}
              className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition-all shadow-sm hover:bg-slate-800 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading && !isScheduledRoom ? "Launching Now..." : "Launch Live Deployment"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateRoom;
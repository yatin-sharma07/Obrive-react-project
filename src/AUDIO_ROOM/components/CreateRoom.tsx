"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

// ======================================================
// FIXED: HIGH SPEED SOLID FLAT DESIGN UI UTILITIES (No Blur/Overhead)
// ======================================================
const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[9px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/10";

const sectionClass =
  "rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm transition-all";

const formatLocalDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// ======================================================
// TYPES
// ======================================================
type RoomRole = "host" | "moderator" | "speaker" | "listener";
type RoleKey = "Host" | "Moderator" | "Speakers" | "Joinees";

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
    Moderator: [],
    Speakers: [],
    Joinees: [],
  });

  // ======================================================
  // SPECIFIC USER IDS
  // ======================================================
  const [otherUserIds, setOtherUserIds] = useState<Record<RoleKey, any[]>>({
    Host: [],
    Moderator: [],
    Speakers: [],
    Joinees: [],
  });

  const [userSearch, setUserSearch] = useState({
    Host: "",
    Moderator: "",
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
  
  // FIXED: Standard string memoization cache layer target
  const minScheduleTime = useMemo(() => formatLocalDateTime(new Date()), []);

  // ======================================================
  // MEMOIZED ROLE OPTIONS MATRIX
  // ======================================================
  const roleOptions = useMemo(() => ({
    Host: ["Admin", "Moderator", "HR", "other"],
    Moderator: ["Admin", "Moderator", "HR", "other"],
    Speakers: ["Admin", "Moderator", "HR", "other"],
    Joinees: ["Admin", "Moderator", "HR", "Employee", "Client", "Guests"],
  }), []);

  // ======================================================
  // HANDLE FORM CHANGES
  // ======================================================
  const handleFormChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "roomType" && value !== "scheduled") {
        next.startTime = "";
      }
      return next;
    });
    if (error) setError("");
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
    if (!user || !user.id) return;

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
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await apiFetch("/audio-room/users");
        const data = await response.json();
        if (response.ok && isMounted) {
          setAllUsers(data.data || []);
        }
      } catch (error) {
        console.error("Error indexing users:", error);
      } finally {
        if (isMounted) setLoadingUsers(false);
      }
    };

    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  // ======================================================
  // BUILD PAYLOAD
  // ======================================================
  const buildRoleAssignments = (): RoleAssignment[] => {
    const assignments: RoleAssignment[] = [];
    const roleMap = { Host: "host", Moderator: "moderator", Speakers: "speaker" } as const;

    (Object.keys(roleMap) as Array<keyof typeof roleMap>).forEach((roleKey) => {
      const assignedRoomRole = roleMap[roleKey];

      (rolePermissions[roleKey] || [])
        .filter((role) => role !== "other")
        .forEach((crmRole) => {
          assignments.push({ assignmentType: "crm-role", crmRole, assignedRoomRole });
        });

      (otherUserIds[roleKey] || []).forEach((userObj: any) => {
        if (userObj?.id) {
          assignments.push({
            assignmentType: "specific-user",
            userId: Number(userObj.id),
            assignedRoomRole,
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
        permissions.push({ permissionType: "crm-role", crmRole: role });
      }
    });
    return permissions;
  };

  const buildPayload = () => ({
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
  });

  const saveRoomToDatabase = async () => {
    try {
      setIsLoading(true);
      setError("");
      const payload = buildPayload();

      if (!payload.roomConfig.roomName.trim()) {
        setError("Room name field cannot be empty");
        return;
      }

      if (isScheduledRoom) {
        if (!payload.roomConfig.startTime) {
          setError("Scheduled timeline profiles require a start timestamp");
          return;
        }
        if (new Date(payload.roomConfig.startTime).getTime() <= Date.now()) {
          setError("Timeline start parameter configuration must reside in the future");
          return;
        }
      }

      const response = await apiFetch("/audio-room/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Configuration transmission error");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Runtime exceptions found");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-2 bg-[#f8f9fa] custom-scrollbar">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        
        {/* Main Grid Splitter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* LEFT SIDE COLUMN: Basic Info & Strategy */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Basic Info Section */}
            <section className={sectionClass}>
              <h2 className="text-sm font-bold tracking-tight text-slate-800">Basic Info</h2>
              <p className="text-[9px] text-slate-400 mt-0.5 mb-4">
                Define the primary identification attributes for this room layout.
              </p>

              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
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
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Room Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide structural context or context logs..."
                    value={formData.roomDescription}
                    onChange={(e) => handleFormChange("roomDescription", e.target.value)}
                    className={`${inputClass} resize-none min-h-[80px]`}
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Deployment Type
                  </label>
                  <div className="flex gap-2 p-1 bg-slate-50 border border-slate-200 rounded-md w-full sm:w-fit">
                    <label className={`flex-1 sm:flex-initial text-center flex items-center justify-center gap-2 text-[9px] font-semibold px-3 py-1.5 rounded cursor-pointer transition-colors ${formData.roomType === "live" ? "bg-white border border-slate-200/80 shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>
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

                    <label className={`flex-1 sm:flex-initial text-center flex items-center justify-center gap-2 text-[9px] font-semibold px-3 py-1.5 rounded cursor-pointer transition-colors ${formData.roomType === "scheduled" ? "bg-white border border-slate-200/80 shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>
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
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Target Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    min={minScheduleTime}
                    disabled={!isScheduledRoom}
                    onChange={(e) => handleFormChange("startTime", e.target.value)}
                    className={`${inputClass} ${!isScheduledRoom ? "cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400 shadow-none" : ""}`}
                  />
                </div>
              </div>
            </section>

            {/* Room Strategy Section */}
            <section className={sectionClass}>
              <h2 className="text-sm font-bold tracking-tight text-slate-800">Room Strategy</h2>
              <p className="text-[9px] text-slate-400 mt-0.5 mb-4">
                Set organizational visibility thresholds and operational user ceilings.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                    Room Visibility
                  </label>
                  <div className="flex gap-4">
                    {["public", "private"].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-[9px] text-slate-600 font-semibold cursor-pointer group select-none">
                        <input
                          type="radio"
                          name="visibility"
                          value={option}
                          checked={formData.visibility === option}
                          onChange={(e) => handleFormChange("visibility", e.target.value)}
                          className="w-3.5 h-3.5 border-slate-300 text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
                        />
                        <span className="group-hover:text-slate-900 transition-colors capitalize">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Participant Limit
                  </label>
                  <input
                    type="number"
                    placeholder="Enter ceiling capacity"
                    value={formData.participantLimit}
                    onChange={(e) => handleFormChange("participantLimit", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE COLUMN: Permissions Section */}
          <div className="lg:col-span-7">
            <section className={`${sectionClass} min-h-[500px]`}>
              <h2 className="text-sm font-bold tracking-tight text-slate-800">Identity & Core Permissions</h2>
              <p className="text-[9px] text-slate-400 mt-0.5 mb-4">
                Grant role permissions to organizational teams or explicit individual identifiers.
              </p>

              <div className="flex flex-col gap-4">
                {Object.entries(roleOptions).map(([role, options]) => {
                  const roleKey = role as RoleKey;
                  return (
                    <div key={roleKey} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <label className="text-[9px] font-bold text-slate-700 tracking-wide uppercase block mb-2">
                        {roleKey}
                      </label>

                      <div className="flex flex-col xl:flex-row gap-3 items-start">
                        {/* Custom Pure CSS Badges Matrix */}
                        <div className="flex flex-wrap gap-1.5 flex-1 w-full">
                          {options.map((option) => {
                            const isChecked = rolePermissions[roleKey]?.includes(option);
                            return (
                              <label
                                key={option}
                                className={`flex items-center gap-1.5 text-[9px] font-semibold px-2.5 py-1.5 rounded-md border cursor-pointer transition-all ${
                                  isChecked
                                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked || false}
                                  onChange={() => handleCheckboxChange(roleKey, option)}
                                  className="sr-only"
                                />
                                {option}
                              </label>
                            );
                          })}
                        </div>

                        {/* Dropdown Options Interface Overlay Box */}
                        {rolePermissions[roleKey]?.includes("other") && (
                          <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-2.5 flex-1 w-full transition-all">
                            <div className="relative w-full">
                              <input
                                type="text"
                                placeholder={loadingUsers ? "Indexing architecture..." : "Filter individual identifiers..."}
                                value={userSearch[roleKey]}
                                disabled={loadingUsers}
                                onChange={(e) =>
                                  setUserSearch((prev) => ({ ...prev, [roleKey]: e.target.value }))
                                }
                                className={`${inputClass} text-[9px] py-1.5 bg-white`}
                              />

                              {userSearch[roleKey] && (
                                <div className="absolute应用 z-50 left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-md">
                                  {allUsers
                                    .filter((user) =>
                                      `${user.name} ${user.userid}`
                                        .toLowerCase()
                                        .includes(userSearch[roleKey].toLowerCase())
                                    )
                                    .slice(0, 5)
                                    .map((user) => (
                                      <div
                                        key={user.id}
                                        onClick={() => handleAddOtherId(roleKey, user)}
                                        className="cursor-pointer rounded-md px-2.5 py-1.5 text-[9px] hover:bg-slate-50 flex flex-col gap-0.5"
                                      >
                                        <div className="font-semibold text-slate-700">{user.name}</div>
                                        <div className="text-slate-400 text-[10px] font-medium flex items-center gap-1.5">
                                          <span>@{user.userid}</span>
                                          <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                                          <span>{user.role}</span>
                                        </div>
                                      </div>
                                    ))}
                                  {allUsers.filter((user) =>
                                    `${user.name} ${user.userid}`
                                      .toLowerCase()
                                      .includes(userSearch[roleKey].toLowerCase())
                                  ).length === 0 && (
                                    <div className="p-2 text-center text-[9px] text-slate-400 italic">
                                      No matches found.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Tokenized User Badge Collections Container */}
                            {otherUserIds[roleKey]?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {otherUserIds[roleKey].map((user: any, userIdx: number) => (
                                  <div
                                    key={`${user.id}-${userIdx}`}
                                    className="bg-white border border-slate-200 rounded-md px-2 py-0.5 flex items-center gap-1.5 text-[9px] font-medium text-slate-600 shadow-none"
                                  >
                                    <span className="truncate max-w-[90px]">{user.name || user.userid}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOtherId(roleKey, userIdx)}
                                      className="text-slate-400 hover:text-slate-700 font-bold transition-colors cursor-pointer text-[9px]"
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



                    {/* Action Bottom Tray Frame */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-200 mt-1">
          {error && (
            <div className="w-full rounded-md border border-red-200 bg-red-50/70 px-3 py-2 text-[9px] font-semibold text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="w-full rounded-md border border-green-200 bg-green-50/70 px-3 py-2 text-[9px] font-semibold text-green-600">
              Structural configuration active. Initializing dynamic pathing...
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2.5 pb-4">
            <button
              type="button"
              onClick={() => saveRoomToDatabase()}
              disabled={isLoading || !isScheduledRoom}
              className="w-full sm:w-auto rounded-md border border-slate-200 bg-white px-4 py-2 text-[9px] font-semibold text-slate-700 transition-colors shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading && isScheduledRoom ? "Scheduling..." : "Schedule Timeline"}
            </button>

            <button
              type="button"
              onClick={() => saveRoomToDatabase()}
              disabled={isLoading || isScheduledRoom}
              className="w-full sm:w-auto rounded-md bg-slate-900 px-4 py-2 text-[9px] font-semibold text-white transition-colors shadow-sm hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading && !isScheduledRoom ? "Launching..." : "Launch Live Deployment"}
            </button>
          </div>
        </div>


          </div>

        </div>



      </div>
    </div>
  );
};

export default CreateRoom;
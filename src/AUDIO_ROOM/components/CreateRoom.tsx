"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

// ======================================================
// UI CLASSES
// ======================================================

const inputClass =
  "w-full rounded-[5px] border border-slate-200 bg-white/50 px-1.5 py-1.5 text-[9px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white";

const sectionClass =
  "rounded-[5px] border border-slate-200/70 bg-white/40 backdrop-blur-[10px] p-3 shadow-[10px]";

// ======================================================
// TYPES
// ======================================================

type RoomRole =
  | "host"
  | "moderator"
  | "speaker"
  | "listener";

type RoleKey =
  | "Host"
  | "Moderators"
  | "Speakers"
  | "Joinees";

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

interface Invite {
  inviteRole: "speaker" | "listener";
  guestEmail?: string;
  requiresPasskey: boolean;
  passkey?: string;
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

  const [rolePermissions, setRolePermissions] =
    useState<Record<RoleKey, string[]>>({
      Host: [],
      Moderators: [],
      Speakers: [],
      Joinees: [],
    });

  // ======================================================
  // SPECIFIC USER IDS (stores user objects)
  // ======================================================

  const [otherUserIds, setOtherUserIds] =
    useState<Record<RoleKey, any[]>>({
      Host: [],
      Moderators: [],
      Speakers: [],
      Joinees: [],
    });

  const [currentOtherId, setCurrentOtherId] =
    useState<Record<RoleKey, string>>({
      Host: "",
      Moderators: "",
      Speakers: "",
      Joinees: "",
    });

  // ======================================================
  // ACCESS CONTROL
  // ======================================================

  const [allowGuests, setAllowGuests] =
    useState(false);

  const [joinLink, setJoinLink] =
    useState("");

  const [passcode, setPasscode] =
    useState("");

  // ======================================================
  // NOTIFICATION SETTINGS
  // ======================================================

  const [notifications, setNotifications] =
    useState({
      notifyLive: false,
      notify1DayBefore: false,
      notify1HourBefore: false,
    });

  // ======================================================
  // API STATE
  // ======================================================

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [userSearch, setUserSearch] = useState({
    Host: "",
    Moderators: "",
    Speakers: "",
    Joinees: "",
  });


  // ======================================================
  // ROLE OPTIONS
  // ======================================================

  const roleOptions = {
    Host: [
      "Moderator",
      "HR",
      "other",
    ],

    Moderators: [
      "Moderator",
      "HR",
      "other",
    ],

    Speakers: [
      "Moderator",
      "HR",
      "other",
    ],

    Joinees: [
      "Moderator",
      "HR",
      "Employee",
      "Client",
      "Guests",
    ],
  };

  // ======================================================
  // HANDLE FORM CHANGES
  // ======================================================

  const handleFormChange = (
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  // ======================================================
  // HANDLE ROLE CHECKBOX
  // ======================================================

  const handleCheckboxChange = (
    role: RoleKey,
    option: string
  ) => {
    setRolePermissions((prev) => {
      const currentOptions =
        prev[role] || [];

      const alreadySelected =
        currentOptions.includes(option);

      return {
        ...prev,
        [role]: alreadySelected
          ? currentOptions.filter(
              (item) =>
                item !== option
            )
          : [
              ...currentOptions,
              option,
            ],
      };
    });
  };

  // ======================================================
  // ADD SPECIFIC USER ID
  // ======================================================

const handleAddOtherId = (
  role: RoleKey,
  user: any
) => {
  if (!user || !user.id) {
    console.warn("Γ¥î Invalid user object:", user);
    return;
  }

  console.log("Γ£à Adding user to role:", { role, user });

  setOtherUserIds((prev) => ({
    ...prev,
    [role]: [
      ...(prev[role] || []),
      user,
    ],
  }));

  setUserSearch((prev) => ({
    ...prev,
    [role]: "",
  }));
};

  // ======================================================
  // REMOVE USER ID
  // ======================================================

  const handleRemoveOtherId = (
    role: RoleKey,
    index: number
  ) => {
    setOtherUserIds((prev) => ({
      ...prev,
      [role]: prev[role].filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ======================================================
  // GENERATE TEMP JOIN LINK
  // ======================================================

  const generateJoinLink = () => {
    const roomId =
      Math.random()
        .toString(36)
        .substring(2, 11);

    const baseUrl =
      window.location.origin;

    const generatedLink =
      `${baseUrl}/audio-room/${roomId}`;

    const generatedPasscode =
      Math.floor(
        100000 +
          Math.random() * 900000
      ).toString();

    setJoinLink(generatedLink);
    setPasscode(generatedPasscode);
  };


  // ======================================================
  // Get users list
  // ======================================================
  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await apiFetch("/audio-room/users");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setAllUsers(data.data || []);

      console.log("Γ£à Users loaded:", data.data);
    } catch (error) {
      console.error(
        "Γ¥î Error fetching users:",
        error
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  // ======================================================
  // COPY TO CLIPBOARD
  // ======================================================

  const copyToClipboard = (
    text: string
  ) => {
    navigator.clipboard.writeText(
      text
    );
  };

  // ======================================================
  // BUILD ROLE ASSIGNMENTS
  // ======================================================

  const buildRoleAssignments =
    (): RoleAssignment[] => {
      const assignments:
        RoleAssignment[] = [];

      const roleMap = {
        Host: "host",
        Moderators:
          "moderator",
        Speakers: "speaker",
      } as const;

      (
        Object.keys(
          roleMap
        ) as Array<
          keyof typeof roleMap
        >
      ).forEach((roleKey) => {
        const assignedRole =
          roleMap[roleKey];

        // CRM Roles
        (
          rolePermissions[
            roleKey
          ] || []
        )
          .filter(
            (role) =>
              role !== "other"
          )
          .forEach(
            (crmRole) => {
              assignments.push({
                assignmentType:
                  "crm-role",
                crmRole,
                assignedRoomRole:
                  assignedRole,
              });
            }
          );

        // Specific User IDs
        (otherUserIds[
          roleKey
        ] || []
        ).forEach((userObj: any) => {
          if (userObj?.id) {
            assignments.push({
              assignmentType:
                "specific-user",

              crmRole: undefined,


              userId: Number(userObj.id),

              assignedRoomRole:
                assignedRole,
            });
          }
        });
      });

      return assignments;
    };

  // ======================================================
  // BUILD JOIN PERMISSIONS
  // ======================================================

  const buildJoinPermissions =
    (): JoinPermission[] => {
      const permissions:
        JoinPermission[] = [];

      (
        rolePermissions
          .Joinees || []
      ).forEach((role) => {
        if (role === "Guests") {
          permissions.push({
            permissionType:
              "guest",
          });
        } else {
          permissions.push({
            permissionType:
              "crm-role",
            crmRole: role,
          });
        }
      });

      return permissions;
    };

  // ======================================================
  // BUILD NOTIFICATIONS
  // ======================================================

  const buildNotifications =
    () => {
      const list = [];

      if (
        notifications.notifyLive
      ) {
        list.push({
          notificationType:
            "room-live",
        });
      }

      if (
        notifications.notify1DayBefore
      ) {
        list.push({
          notificationType:
            "1-day-before",
        });
      }

      if (
        notifications.notify1HourBefore
      ) {
        list.push({
          notificationType:
            "1-hour-before",
        });
      }

      return list;
    };

  // ======================================================
  // BUILD PAYLOAD
  // ======================================================

  const buildPayload =
    () => {
      return {
        roomConfig: {
          roomName:
            formData.roomName,

          roomDescription:
            formData.roomDescription,

          roomType:
            formData.roomType,

          roomStatus:
            formData.roomType ===
            "live"
              ? "live"
              : "scheduled",

          startTime:
            formData.startTime ||
            null,

          participantLimit:
            Number(
              formData.participantLimit
            ),

          visibility:
            formData.visibility,

          allowGuestUsers:
            allowGuests,

          redirectAfterRoomEnd:
            "/room-ended",
        },

        roleAssignments:
          buildRoleAssignments(),

        joinPermissions:
          buildJoinPermissions(),

        notifications:
          buildNotifications(),

        invites: [],
      };
    };

  // ======================================================
  // SAVE ROOM TO DATABASE
  // ======================================================

  const saveRoomToDatabase =
    async () => {
      try {
        setIsLoading(true);
        setError("");

        const payload =
          buildPayload();

        console.log(
          "≡ƒôñ Payload:",
          payload
        );

                console.log(
          "≡ƒÄ¡ Role Assignments:",
          payload.roleAssignments
        );

        console.table(
          payload.roleAssignments
        );

        // VALIDATION
        if (
          !payload.roomConfig.roomName.trim()
        ) {
          setError(
            "Room name is required"
          );
          return;
        }

        const response =
          await apiFetch(
            "/audio-room/create",
            {
              method: "POST",
              body: JSON.stringify(
                payload
              ),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          setError(
            data.message ||
              "Failed to create room"
          );

          console.error(
            "Γ¥î API Error:",
            data
          );

          return;
        }

        console.log(
          "Γ£à Room created:",
          data
        );

        setSuccess(true);

        if (data?.data?.id) {
          router.push(`/audio-room/room/${data.data.id}`);
        }

        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } catch (error) {
        console.error(
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unknown error"
        );
      } finally {
        setIsLoading(false);
      }
    };
  // const roleOptions = {
  //   Host: ["Admin", "Moderator", "HR", "other"],
  //   Moderators: ["Admin", "Moderator", "HR", "other"],
  //   Speakers: ["Admin", "Moderator", "HR", "other"],
  //   Joinees: ["Admin", "Moderator", "HR", "Employee", "Client", "other"],
  // };



              // const handleCheckboxChange = (role, option) => {
              //   setRolePermissions((prev) => {
              //     const currentOptions = prev[role] || [];
              //     if (currentOptions.includes(option)) {
              //       return {
              //         ...prev,
              //         [role]: currentOptions.filter((opt) => opt !== option),
              //       };
              //     } else {
              //       return {
              //         ...prev,
              //         [role]: [...currentOptions, option],
              //       };
              //     }
              //   });
              // };

  // const handleAddOtherId = (role, userId) => {
  //   if (userId.trim()) {
  //     setOtherUserIds((prev) => ({
  //       ...prev,
  //       [role]: [...(prev[role] || []), userId],
  //     }));
  //     setCurrentOtherId((prev) => ({
  //       ...prev,
  //       [role]: "",
  //     }));
  //   }
  // };

  // const handleRemoveOtherId = (role, index) => {
  //   setOtherUserIds((prev) => ({
  //     ...prev,
  //     [role]: prev[role].filter((_, i) => i !== index),
  //   }));
  // };

  // const generateJoinLink = () => {
  //   const roomId = Math.random().toString(36).substring(2, 11);
  //   const baseUrl = window.location.origin;
  //   const newLink = `${baseUrl}/audio-room/${roomId}`;
  //   const newPasscode = Math.floor(100000 + Math.random() * 900000).toString();
    
  //   setJoinLink(newLink);
  //   setPasscode(newPasscode);
  // };

  // const copyToClipboard = (text) => {
  //   navigator.clipboard.writeText(text);
  // };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-6">
        {/* Left Form Section */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* Header */}
          <div>
            {/* <h1 className="text-2xl font-semibold text-slate-800">
              Create Audio Room
            </h1> */}

            {/* <p className="text-[9px] text-slate-500 mt-2">
              Configure permissions, scheduling,
              participants and access for your room.
            </p> */}
          </div>

{/* // DIV 1 // */}
<div className="flex w-full " />
          {/* Sections Row 1 */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Basic Info */}
            <section className={`${sectionClass} flex-1`}>
              <h2 className="text-[11px] font-semibold text-slate-800">
                Basic Info
              </h2>

              <p className="text-[9px] text-slate-500 mt-1 mb-1">
                Define the basic details of your
                room.
              </p>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                    Room Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter room name"
                    value={formData.roomName}
                    onChange={(e) => handleFormChange("roomName", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                    Room Description
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Describe room purpose..."
                    value={formData.roomDescription}
                    onChange={(e) => handleFormChange("roomDescription", e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                    Room Type
                  </label>

                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 text-[9px] text-slate-700">
                      <input 
                        type="radio" 
                        name="roomType" 
                        value="live"
                        checked={formData.roomType === "live"}
                        onChange={(e) => handleFormChange("roomType", e.target.value)}
                      />
                      Live
                    </label>

                    <label className="flex items-center gap-2 text-[9px] text-slate-700">
                      <input 
                        type="radio" 
                        name="roomType"
                        value="scheduled"
                        checked={formData.roomType === "scheduled"}
                        onChange={(e) => handleFormChange("roomType", e.target.value)}
                      />
                      Scheduled
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                    Start Time
                  </label>

                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => handleFormChange("startTime", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Participants & Invites */}
            <section className={`${sectionClass} flex-1`}>
              <h2 className="text-[11px] font-semibold text-slate-800">
                Invite Participants/ Guests
              </h2>

              <p className="text-[9px] text-slate-500 mt-1 mb-1">
                Add external participants.
              </p>

              <div className="grid grid-cols-1 gap-2">
                {/* <div>
                  <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                    Employee/User ID
                  </label>

                  <input
                    type="text"
                    placeholder="Enter employee ID"
                    className={inputClass}
                  />
                </div> */}

                {/* Generate Join Link & Passcode */}
                <div>
                  <button
                    onClick={generateJoinLink}
                    className="w-full rounded-[5px] border border-slate-200 bg-slate-700 px-3 py-2 text-[9px] font-medium text-white transition hover:bg-slate-800"
                  >
                    Generate Join Link & Passcode
                  </button>
                </div>

                {/* Join Link */}
                {joinLink && (
                  <div>
                    <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                      Join Link
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={joinLink}
                        readOnly
                        className={`${inputClass} text-[8px] bg-slate-50`}
                      />
                      <button
                        onClick={() => copyToClipboard(joinLink)}
                        className="rounded-[5px] border border-slate-200 bg-blue-500 px-2 py-1 text-[8px] font-medium text-white transition hover:bg-blue-600"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {/* Passcode */}
                {passcode && (
                  <div>
                    <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                      Passcode
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={passcode}
                        readOnly
                        className={`${inputClass} text-[8px] bg-slate-50`}
                      />
                      <button
                        onClick={() => copyToClipboard(passcode)}
                        className="rounded-[5px] border border-slate-200 bg-blue-500 px-2 py-1 text-[8px] font-medium text-white transition hover:bg-blue-600"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-1 text-[9px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={allowGuests}
                      onChange={(e) => setAllowGuests(e.target.checked)}
                    />
                    Allow Guest Users
                  </label>
                </div>
              </div>
            </section>
          </div>

<div/>


<div className="w-full " />
        
          {/* Sections Row 2 */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Permissions */}
            <section className={`${sectionClass} flex-1`}>
              <h2 className="text-[11px] font-semibold text-slate-800">
                Permissions
              </h2>

              <p className="text-[9px] text-slate-500 mt-1 mb-1">
                Configure room roles and access.
              </p>

              <div className="grid grid-cols-1 gap-4">
                {Object.entries(roleOptions).map(([role, options]) => {
                  const roleKey = role as RoleKey;
                  return (
                  <div key={roleKey} className="border-b border-slate-200/50 pb-4 last:border-0">
                    <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                      {roleKey}
                    </label>

                    {/* Checkboxes and Other IDs Container */}
                    <div className="flex flex-col lg:flex-row gap-3">
                      {/* Checkboxes */}
                      <div className="flex flex-wrap gap-2 flex-1">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-[9px] text-slate-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                rolePermissions[roleKey]?.includes(
                                  option
                                ) || false
                              }
                              onChange={() =>
                                handleCheckboxChange(roleKey, option)
                              }
                              className="w-3 h-3 rounded border-slate-300 cursor-pointer"
                            />
                            {option}
                          </label>
                        ))}
                      </div>

                      {/* Other User IDs Section */}
                      {rolePermissions[roleKey]?.includes("other") && (
                        <div className="bg-white/30 rounded-[5px] p-2 flex-1">
                          <label className="text-[8px] font-medium text-slate-700 block mb-1">
                            Add User IDs
                          </label>

                          <div className="flex gap-1 mb-2">
                              <div className="relative w-full">
                                <input
                                  type="text"
                                  placeholder="Search user..."
                                  value={userSearch[roleKey]}
                                  onChange={(e) =>
                                    setUserSearch((prev) => ({
                                      ...prev,
                                      [roleKey]: e.target.value,
                                    }))
                                  }
                                  className={`${inputClass} text-[8px] py-1`}
                                />

                                {/* Dropdown */}
                                {userSearch[roleKey] && (
                                  <div className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-[5px] border border-slate-200 bg-white shadow-lg">
                                    {allUsers
                                      .filter((user) =>
                                        `${user.name} ${user.userid}`
                                          .toLowerCase()
                                          .includes(
                                            userSearch[roleKey].toLowerCase()
                                          )
                                      )
                                      .slice(0, 8)
                                      .map((user) => (
                                        <div
                                          key={user.id}
                                          onClick={() =>
                                            handleAddOtherId(
                                              roleKey,
                                              user
                                            )
                                          }
                                          className="cursor-pointer border-b border-slate-100 px-2 py-2 text-[8px] hover:bg-slate-100"
                                        >
                                          <div className="font-medium">
                                            {user.name}
                                          </div>

                                          <div className="text-slate-500">
                                            {user.userid} ΓÇó {user.role}
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                          </div>

                          {/* Display Added User IDs */}
                          {otherUserIds[roleKey]?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {otherUserIds[roleKey].map((user: any) => (
                                <div
                                  key={user.id}
                                  className="bg-blue-100 border border-blue-300 rounded-full px-2 py-0.5 flex items-center gap-1 text-[8px] text-blue-700"
                                >
                                  {user.name || user.userid}
                                  <button
                                    onClick={() => {
                                      const idx = otherUserIds[roleKey].findIndex(
                                        (u: any) => u.id === user.id
                                      );
                                      handleRemoveOtherId(roleKey, idx);
                                    }}
                                    className="text-blue-700 hover:text-blue-900 font-bold"
                                  >
                                    ├ù
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

            {/* Visibility & Notifications */}
            <section className={`${sectionClass} flex-1`}>
              <h2 className="text-[11px] font-semibold text-slate-800">
                Visibility & Notifications
              </h2>

              <div className="grid grid-cols-1 gap-2 mt-5">
                <div>
                  <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                    Room Visibility
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {["public", "private"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-[9px]"
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option}
                          checked={formData.visibility === option}
                          onChange={(e) => handleFormChange("visibility", e.target.value)}
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                    Notifications
                  </label>

                                          <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-[9px]">
                                              <input
                                                type="checkbox"
                                                checked={notifications.notifyLive}
                                                onChange={(e) =>
                                                  setNotifications((prev) => ({
                                                    ...prev,
                                                    notifyLive:
                                                      e.target.checked,
                                                  }))
                                                }
                                              />
                                              Notify when room goes live
                                            </label>

                                            <label className="flex items-center gap-2 text-[9px]">
                                              <input
                                                type="checkbox"
                                                checked={
                                                  notifications.notify1DayBefore
                                                }
                                                onChange={(e) =>
                                                  setNotifications((prev) => ({
                                                    ...prev,
                                                    notify1DayBefore:
                                                      e.target.checked,
                                                  }))
                                                }
                                              />
                                              Notify 1 day before
                                            </label>

                                            <label className="flex items-center gap-2 text-[9px]">
                                              <input
                                                type="checkbox"
                                                checked={
                                                  notifications.notify1HourBefore
                                                }
                                                onChange={(e) =>
                                                  setNotifications((prev) => ({
                                                    ...prev,
                                                    notify1HourBefore:
                                                      e.target.checked,
                                                  }))
                                                }
                                              />
                                              Notify 1 hour before
                                            </label>
                                          </div>
                </div>
              </div>

                          <section className={` flex-1 mt-5`}>
              <h2 className="text-[11px] font-semibold text-slate-800">
                Room Limits
              </h2>

              <div className="mt-5">
                <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                  Participant Limit
                </label>

                <input
                  type="number"
                  placeholder="Enter participant limit"
                  value={formData.participantLimit}
                  onChange={(e) =>
                      handleFormChange(
                        "participantLimit",
                        Number(e.target.value)
                      )
                    }
                  className={inputClass}
                />
              </div>
            </section>
            
            </section>
          </div>
<div className="w-full " />
          {/* Sections Row 3 */}            {/* Room Limit */}
          {/* <div className="flex flex-col lg:flex-row gap-6">

            <section className={`${sectionClass} flex-1`}>
              <h2 className="text-[11px] font-semibold text-slate-800">
                Room Limits
              </h2>

              <div className="mt-5">
                <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                  Participant Limit
                </label>

                <input
                  type="number"
                  placeholder="Enter participant limit"
                  className={inputClass}
                />
              </div>
            </section>
          </div> */}
          <div className="flex flex-wrap gap-4 pb-1">
            {/* Error Message Display */}
            {error && (
              <div className="w-full rounded-[5px] border border-red-300 bg-red-50 p-2 text-[9px] text-red-700">
                Γ¥î {error}
              </div>
            )}

            {/* Success Message Display */}
            {success && (
              <div className="w-full rounded-[5px] border border-green-300 bg-green-50 p-2 text-[9px] text-green-700">
                Γ£à Room created successfully!
              </div>
            )}

            <button 
              className="rounded-[5px] border border-slate-200 bg-white/50 px-5 py-3 text-[9px] font-medium text-slate-700 transition hover:bg-white disabled:opacity-50"
              disabled={isLoading}
            >
              Save Draft
            </button>

            <button 
              onClick={() => saveRoomToDatabase()}
              disabled={isLoading}
              className="rounded-[5px] border border-slate-200 bg-slate-900 px-5 py-3 text-[9px] font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Schedule Room"}
            </button>

            <button 
              onClick={() => saveRoomToDatabase()}
              disabled={isLoading}
              className="rounded-[5px] border border-slate-200 bg-slate-800 px-5 py-3 text-[9px] font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Starting..." : "Start Room Now"}
            </button>
          </div>
        </div>

<div/>








        {/* Right Preview / Instruction Panel */}
        {/* <div className="w-full xl:w-[380px] shrink-0">
          <div className="sticky top-0 rounded-[2px] border border-slate-200/70 bg-white/40 backdrop-blur-[10px] p-3 shadow-[10px]">
            <h2 className="text-[11px] font-semibold text-slate-800">
              Room Guide
            </h2>

            <p className="text-[9px] text-slate-500 mt-2">
              Configure who can host, moderate,
              speak and join your room.
            </p>

            <div className="mt-5 space-y-4 text-[9px] text-slate-600">
              <div>
                <p className="font-medium text-slate-800">
                  Host
                </p>
                <p>
                  Controls the room and manages
                  moderators.
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-800">
                  Moderator
                </p>
                <p>
                  Approves speakers and manages
                  participants.
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-800">
                  Speaker
                </p>
                <p>
                  Joins stage muted by default.
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-800">
                  Listener
                </p>
                <p>
                  Can raise hand and join stage.
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CreateRoom;

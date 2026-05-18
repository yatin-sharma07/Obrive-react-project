"use client";

import React, { useState } from "react";
import { API_BASE_URL } from "@/lib/api"; // API endpoint config

const inputClass = "w-full rounded-[5px] border border-slate-200 bg-white/50 px-1.5 py-1.5 text-[9px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white";
const selectClass = "w-full rounded-[5px] border border-slate-200 bg-white/50 px-1.5 py-1.5 text-[9px] text-slate-700 outline-none transition-all focus:border-slate-300 focus:bg-white";
const sectionClass = "rounded-[5px] border border-slate-200/70 bg-white/40 backdrop-blur-[10px] p-3 shadow-[10px] ";

interface FormData {
  roomName: string;
  roomDescription: string;
  roomType: string;
  startTime: string;
  participantLimit: number | string;
  visibility: string;
}

interface RoleStates {
  Host: string[];
  Moderators: string[];
  Speakers: string[];
  Joinees: string[];
}

interface RoleInputStates {
  Host: string;
  Moderators: string;
  Speakers: string;
  Joinees: string;
}

const CreateRoom = () => {
  // ============ FORM STATE ============
  // Store user input from form fields
  const [formData, setFormData] = useState<FormData>({
    roomName: "",
    roomDescription: "",
    roomType: "live", // "live" or "scheduled"
    startTime: "",
    participantLimit: 50,
    visibility: "private", // "public", "private", "invite-only"
  });

  // ============ PERMISSION STATE ============
  // Track which roles are selected per role
  const [rolePermissions, setRolePermissions] = useState<RoleStates>({
    Host: [],
    Moderators: [],
    Speakers: [],
    Joinees: [],
  });

  // Store custom user IDs for "other" option
  const [otherUserIds, setOtherUserIds] = useState<RoleStates>({
    Host: [],
    Moderators: [],
    Speakers: [],
    Joinees: [],
  });

  const [currentOtherId, setCurrentOtherId] = useState<RoleInputStates>({
    Host: "",
    Moderators: "",
    Speakers: "",
    Joinees: "",
  });

  // ============ ACCESS CONTROL STATE ============
  const [joinLink, setJoinLink] = useState(""); // Store generated join link and default to empty string
  const [passcode, setPasscode] = useState("");
  const [allowGuests, setAllowGuests] = useState(false);

  // ============ API STATE ============
  // Track loading, errors, and success messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /**
   * FLOW EXPLANATION: How Data Moves from Frontend to Backend
   * 
   * USER INPUTS FORM → REACT STATE UPDATES → SAVE BUTTON CLICKED
   *     ↓
   * saveRoomToDatabase() CALLED
   *     ↓
   * BUILD PAYLOAD: Combine form data + permissions
   *     ↓
   * VALIDATE: Check required fields (roomName, etc)
   *     ↓
   * POST TO: http://localhost:5000/api/audio-room/create
   *     ↓
   * BACKEND VALIDATES: Zod schema checks types, lengths, enums
   *     ↓
   * SUCCESS? → Database saves room, returns ID
   * ERROR? → Backend returns 400/500 with error message
   *     ↓
   * FRONTEND DISPLAYS: Success message or error message to user
   */

  const handleFormChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user modifies form
  };

  //above function is a generic handler for all form fields, it updates the formData state based on the field name and value. It also clears any existing error messages when the user starts modifying the form again.
  // Example usage: onChange={(e) => handleFormChange("roomName", e.target.value)}
  // ...prev holds the existing formData, and we overwrite the specific field that changed with the new value. This way we can manage all form inputs with a single handler function.

  // ============ API FUNCTIONS ============
  
  /**
   * SAVE ROOM TO DATABASE
   * 
   * STEP 1: Prepare state (loading=true, clear old error)
   * STEP 2: Build payload from form inputs + permissions, here used funcion 
   * STEP 3: Validate required fields on frontend using simple checks (e.g. roomName not empty)
   * STEP 4: Send POST with payload to backend
   * STEP 5: Backend validates (Zod schema) + saves to DB
   * STEP 6: Show success/error message to user
   */
  const saveRoomToDatabase = async () => {
    try {
      // STEP 1: Set UI state (show loading spinner, clear old errors)
      setIsLoading(true);
      setError("");

      // Build the payload - don't send undefined values
      const payload = {
        roomName: formData.roomName,
        roomDescription: formData.roomDescription || "", // Empty string instead of undefined
        roomType: formData.roomType,
        startTime: formData.startTime || "", // Empty string for optional field
        participantLimit: parseInt(String(formData.participantLimit)) || 50,
        visibility: formData.visibility,
        allowGuestUsers: allowGuests,
        whoCanHost: [...(rolePermissions.Host || []), ...(otherUserIds.Host || [])],
        whoCanModerate: [...(rolePermissions.Moderators || []), ...(otherUserIds.Moderators || [])],
        whoCanSpeak: [...(rolePermissions.Speakers || []), ...(otherUserIds.Speakers || [])],
        whoCanJoin: [...(rolePermissions.Joinees || []), ...(otherUserIds.Joinees || [])],
      };

// Log payload for debugging
console.log("📤 Sending payload:", payload);
console.table(payload);

      // STEP 3: Frontend validation (before sending to backend)
      if (!payload.roomName.trim()) {
        setError("Room name is required");
        setIsLoading(false);
        return; // Don't send invalid data
      }

      // STEP 4: Send POST request to backend API endpoint
      // Backend URL: http://localhost:5000/api/audio-room/create
      // API_BASE_URL already includes /api, so just add /audio-room/create
      const response = await fetch(`${API_BASE_URL}/audio-room/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // STEP 5: Parse backend response (always JSON)
      const data = await response.json();

      // Check if response status is NOT OK (400, 500, etc)
      if (!response.ok) {
        // Backend validation failed or server error
        console.error("❌ Response:", { status: response.status, data });
        
        // Extract error messages from backend response
        if (data.errors && Array.isArray(data.errors)) {
          // Format: "field: message" for each error
          const errorMessages = data.errors
            .map((err: { field: string; message: string }) => `${err.field}: ${err.message}`)
            .join(" | ");
          setError(`⚠️ ${errorMessages}`);
        } else {
          const errorMsg = data.message || "Failed to create room";
          setError(`❌ ${errorMsg}`);
        }
        setIsLoading(false);
        return;
      }

      // STEP 6: Success! Room created in database with an ID
      setSuccess(true);
      console.log("✅ Room created:", data.data); // Log the saved room object
      
      // STEP 7: Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ roomName: "", roomDescription: "", roomType: "live", startTime: "", participantLimit: 50, visibility: "private" });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      // STEP 8: Catch network errors (no internet, server down, etc)
      setError(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
      console.error("❌ API Error:", err);
    } finally {
      // Always run this: hide loading spinner
      setIsLoading(false);
    }
  };

  const roleOptions = {
    Host: ["Admin", "Moderator", "HR", "other"],
    Moderators: ["Admin", "Moderator", "HR", "other"],
    Speakers: ["Admin", "Moderator", "HR", "other"],
    Joinees: ["Admin", "Moderator", "HR", "Employee", "Client", "other"],
  };

  const handleCheckboxChange = (role: keyof RoleStates, option: string) => {
    setRolePermissions((prev) => {
      const currentOptions = prev[role] || [];
      if (currentOptions.includes(option)) {
        return {
          ...prev,
          [role]: currentOptions.filter((opt) => opt !== option),
        };
      } else {
        return {
          ...prev,
          [role]: [...currentOptions, option],
        };
      }
    });
  };

  const handleAddOtherId = (role: keyof RoleStates, userId: string) => {
    if (userId.trim()) {
      setOtherUserIds((prev) => ({
        ...prev,
        [role]: [...(prev[role] || []), userId],
      }));
      setCurrentOtherId((prev) => ({
        ...prev,
        [role]: "",
      }));
    }
  };

  const handleRemoveOtherId = (role: keyof RoleStates, index: number) => {
    setOtherUserIds((prev) => ({
      ...prev,
      [role]: prev[role].filter((_, i) => i !== index),
    }));
  };

  const generateJoinLink = () => {
    const roomId = Math.random().toString(36).substring(2, 11);
    const baseUrl = window.location.origin;
    const newLink = `${baseUrl}/audio-room/${roomId}`;
    const newPasscode = Math.floor(100000 + Math.random() * 900000).toString();
    
    setJoinLink(newLink);
    setPasscode(newPasscode);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6">
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
                {Object.entries(roleOptions).map(([role, options]) => (
                  <div key={role} className="border-b border-slate-200/50 pb-4 last:border-0">
                    <label className="text-[9px] font-medium text-slate-700 mb-2 block">
                      {role}
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
                                rolePermissions[role]?.includes(
                                  option
                                ) || false
                              }
                              onChange={() =>
                                handleCheckboxChange(role, option)
                              }
                              className="w-3 h-3 rounded border-slate-300 cursor-pointer"
                            />
                            {option}
                          </label>
                        ))}
                      </div>

                      {/* Other User IDs Section */}
                      {rolePermissions[role]?.includes("other") && (
                        <div className="bg-white/30 rounded-[5px] p-2 flex-1">
                          <label className="text-[8px] font-medium text-slate-700 block mb-1">
                            Add User IDs
                          </label>

                          <div className="flex gap-1 mb-2">
                            <input
                              type="text"
                              placeholder="Enter user ID"
                              value={currentOtherId[role as keyof RoleInputStates]}
                              onChange={(e) =>
                                setCurrentOtherId((prev) => ({
                                  ...prev,
                                  [role]: e.target.value,
                                }))
                              }
                              className={`${inputClass} text-[8px] py-1`}
                            />

                            <button
                              onClick={() =>
                                handleAddOtherId(
                                  role as keyof RoleStates,
                                  currentOtherId[role as keyof RoleInputStates]
                                )
                              }
                              className="rounded-[5px] bg-blue-500 px-2 py-1 text-[8px] font-medium text-white hover:bg-blue-600 transition"
                            >
                              Add
                            </button>
                          </div>

                          {/* Display Added User IDs */}
                          {otherUserIds[role]?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {otherUserIds[role].map((userId, idx) => (
                                <div
                                  key={idx}
                                  className="bg-blue-100 border border-blue-300 rounded-full px-2 py-0.5 flex items-center gap-1 text-[8px] text-blue-700"
                                >
                                  {userId}
                                  <button
                                    onClick={() =>
                                      handleRemoveOtherId(role, idx)
                                    }
                                    className="text-blue-700 hover:text-blue-900 font-bold"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
                    {["public", "private", "invite-only"].map((option) => (
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
                      <input type="checkbox" />
                      Notify when room goes live
                    </label>

                    <label className="flex items-center gap-2 text-[9px]">
                      <input type="checkbox" />
                      Notify 1 day before
                    </label>

                    <label className="flex items-center gap-2 text-[9px]">
                      <input type="checkbox" />
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
                  onChange={(e) => handleFormChange("participantLimit", e.target.value)}
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
                ❌ {error}
              </div>
            )}

            {/* Success Message Display */}
            {success && (
              <div className="w-full rounded-[5px] border border-green-300 bg-green-50 p-2 text-[9px] text-green-700">
                ✅ Room created successfully!
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
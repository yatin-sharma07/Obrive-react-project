"use client";

import { Circle, ShieldX, Trash2, User, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import { apiFetch } from "@/lib/api";

interface Employee {
  id: number;
  name: string;
  email: string;
  job_title?: string;
  department?: string;
  status?: string;
  is_active?: boolean;
}

interface EmployeesListProps {
  setActiveSection: (section: string) => void;
}

export default function EmployeesList(_props: EmployeesListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: "success" | "error" | "info" | "warning";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
  });

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/supervisor/employees", {
        method: "GET",
      });
      const result = await response.json();
      if (result.success) {
        setEmployees(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "busy":
        return "bg-red-500";
      case "inactive":
        return "bg-amber-500";
      default:
        return "bg-gray-300";
    }
  };

  const handleBlockEmployee = (employee: Employee) => {
    setAlertConfig({
      isOpen: true,
      title: "Block User",
      description: `Block ${employee.name}'s access? They will no longer be able to use the dashboard.`,
      type: "warning",
      onConfirm: async () => {
        try {
          const response = await apiFetch(
            `/supervisor/employees/${employee.id}/block`,
            {
              method: "PATCH",
            },
          );
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to block user");
          }

          setEmployees((prev) =>
            prev.map((item) =>
              item.id === employee.id
                ? { ...item, status: "inactive", is_active: false }
                : item,
            ),
          );

          setAlertConfig({
            isOpen: true,
            title: "User Blocked",
            description: `${employee.name} can no longer access the dashboard.`,
            type: "success",
          });
        } catch (error) {
          setAlertConfig({
            isOpen: true,
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to block user",
            type: "error",
          });
        }
      },
    });
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setAlertConfig({
      isOpen: true,
      title: "Delete User",
      description: `Delete ${employee.name}? This removes the user record and blocks future access permanently.`,
      type: "warning",
      onConfirm: async () => {
        try {
          const response = await apiFetch(
            `/supervisor/employees/${employee.id}`,
            {
              method: "DELETE",
            },
          );
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to delete user");
          }

          setEmployees((prev) =>
            prev.filter((item) => item.id !== employee.id),
          );
          setAlertConfig({
            isOpen: true,
            title: "User Deleted",
            description: `${employee.name} was removed successfully.`,
            type: "success",
          });
        } catch (error) {
          setAlertConfig({
            isOpen: true,
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to delete user",
            type: "error",
          });
        }
      },
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#eef7ff] to-[#e2f5f1] p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-5 w-5 text-[#1a472a]" />
          <h2 className="text-lg font-bold text-[#1a472a]">Team Members</h2>
        </div>
        <p className="text-sm text-gray-600">
          {employees.length} employee{employees.length !== 1 ? "s" : ""} in your
          team
        </p>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div
              key={`employee-skeleton-${item}`}
              className="h-20 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No employees found</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-[#1a472a]/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {employee.name}
                    </h3>
                    <Circle
                      className={`h-2 w-2 flex-shrink-0 ${getStatusColor(employee.status)}`}
                      fill="currentColor"
                    />
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {employee.email}
                  </p>
                  {employee.job_title && (
                    <p className="text-xs text-gray-600 mt-1">
                      {employee.job_title}
                    </p>
                  )}
                  {employee.department && (
                    <p className="text-xs text-gray-500">
                      {employee.department}
                    </p>
                  )}
                  {employee.status?.toLowerCase() === "inactive" ||
                  employee.is_active === false ? (
                    <p className="mt-2 text-[11px] font-medium text-amber-600">
                      Access blocked
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleBlockEmployee(employee)}
                    disabled={
                      employee.status?.toLowerCase() === "inactive" ||
                      employee.is_active === false
                    }
                    className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Block access"
                  >
                    <ShieldX className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEmployee(employee)}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        description={alertConfig.description}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() =>
          setAlertConfig((prev) => ({
            ...prev,
            isOpen: false,
            onConfirm: undefined,
          }))
        }
      />
    </div>
  );
}

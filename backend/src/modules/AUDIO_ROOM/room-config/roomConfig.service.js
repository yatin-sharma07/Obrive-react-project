const { prisma } = require("../../../../prisma");

const createRoomConfigService =
  async (payload, userId) => {
    const {
      roomConfig,
      roleAssignments,
      joinPermissions,
      notifications,
      invites,
    } = payload;

    return await prisma.$transaction(
      async (tx) => {
        // ==================================
        // CREATE ROOM CONFIG
        // ==================================

        const createdRoom =
          await tx.room_configs.create(
            {
              data: {
                roomName:
                  roomConfig.roomName,

                roomDescription:
                  roomConfig.roomDescription,

                roomType:
                  roomConfig.roomType,

                roomStatus:
                  roomConfig.roomStatus,

                startTime:
                  roomConfig.startTime
                    ? new Date(
                        roomConfig.startTime
                      )
                    : null,

                endTime:
                  roomConfig.endTime
                    ? new Date(
                        roomConfig.endTime
                      )
                    : null,

                participantLimit:
                  roomConfig.participantLimit,

                visibility:
                  roomConfig.visibility,

                allowGuestUsers:
                  roomConfig.allowGuestUsers,

                redirectAfterRoomEnd:
                  roomConfig.redirectAfterRoomEnd,

                createdBy: userId,
              },
            }
          );

        // ==================================
        // ROLE ASSIGNMENTS
        // ==================================

        // Auto-add creator as host
        const allRoleAssignments = [
          {
            roomConfigId: createdRoom.id,
            assignmentType: "specific-user",
            crmRole: null,
            assignedRoomRole: "host",
            userId: userId,
          },
          ...(roleAssignments?.map(
            (
              role
            ) => ({
              roomConfigId:
                createdRoom.id,

              assignmentType:
                role.assignmentType,

              crmRole:
role.assignmentType ===
"crm-role"
  ? role.crmRole
  : null,

              assignedRoomRole:
                role.assignedRoomRole,

              userId:
                role.userId
                  ? Number(
                      role.userId
                    )
                        : null,
            })
          ) || [])
        ];

        if (allRoleAssignments.length) {
          await tx.room_role_assignments.createMany(
            {
              data: allRoleAssignments,
            }
          );
        }

        // ==================================
        // JOIN PERMISSIONS
        // ==================================

        if (
          joinPermissions?.length
        ) {
          await tx.room_join_permissions.createMany(
            {
              data:
                joinPermissions.map(
                  (
                    permission
                  ) => ({
                    roomConfigId:
                      createdRoom.id,

                    permissionType:
                      permission.permissionType,

                    crmRole:
                      permission.crmRole ||
                      null,
                  })
                ),
            }
          );
        }

        // ==================================
        // NOTIFICATIONS
        // ==================================

        if (
          notifications?.length
        ) {
          await tx.room_notifications.createMany(
            {
              data:
                notifications.map(
                  (
                    notification
                  ) => ({
                    roomConfigId:
                      createdRoom.id,

                    notificationType:
                      notification.notificationType,

                    scheduledTime:
                      new Date(),
                  })
                ),
            }
          );
        }

console.log(
  "✅ Room Created:",
  createdRoom
);

console.table(
  roleAssignments || []
);

console.table(
  joinPermissions || []
);

console.table(
  notifications || []
);

console.table(
  invites || []
);


        // ==================================
        // INVITES (LATER)
        // ==================================

        return createdRoom;
      }
    );
  };




        // ==================================
        // Get list of users
        // ==================================


        const getAllUsers = async () => {
          try {
            const users = await prisma.users.findMany({
              select: {
                id: true,
                userid: true,
                name: true,
                role: true,
              },
              orderBy: {
                name: "asc",
              },
            });

            return users;
          } catch (error) {
            throw new Error(error.message);
          }
        };


  module.exports = {
  createRoomConfigService,
  getAllUsers,
};
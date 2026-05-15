import React, { useState } from "react";
import _ from "lodash";
import {
  Box,
  Typography,
  IconButton,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  PersonAddAltRounded,
  DeleteForeverRounded,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import { useFetchData } from "hooks";
import { Button, DropDownMenu } from "commonComponents";
import AddUserModal from "./AddUserModal";
import { removeUserHomeAccess, updateUserHomeAccess } from "../module/module";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  USER_ROLE_OWNER,
  USER_ROLE_CO_OWNER,
  USER_ROLE_GUEST,
} from "constants/stringConstatnts";
import tokens from "../../../../../../../../theme/tokens";

const ROLE_OPTIONS = [
  { id: USER_ROLE_OWNER, label: "Owner", value: USER_ROLE_OWNER },
  { id: USER_ROLE_CO_OWNER, label: "Co-Owner", value: USER_ROLE_CO_OWNER },
  { id: USER_ROLE_GUEST, label: "Guest", value: USER_ROLE_GUEST },
];

const getOptionLabel = (role) =>
  _.get(
    _.find(ROLE_OPTIONS, (item) => item.id == role),
    "label",
    "Not defined"
  );

const AccessControll = () => {
  const theme = useTheme();
  const { userHome } = useOutletContext();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const { homeUsers, homeUsersIsLoading, homeUsersQueryProps } = useFetchData({
    params: { homeDetails: { id: userHome?.id } },
    path: "home/get-home-user-role",
    queryName: "homeUsers",
  });

  const onOptionClick = async ({ userId, option }) => {
    const role = option.value;
    const expireAt =
      role === USER_ROLE_GUEST ? dayjs().add(1, "day").valueOf() : undefined;
    await updateUserHomeAccess({
      userHomeRoleDetails: { id: userId, homeId: userHome.id, expireAt, role },
    });
    await homeUsersQueryProps.refetch();
  };

  const onAddUserClick = () => setShowAddUserModal(true);
  const onCloseAddUserModal = () => setShowAddUserModal(false);

  const onDeleteClick = async (userId) => {
    await removeUserHomeAccess({
      userHomeRoleDetails: { id: userId, homeId: userHome.id },
    });
    await homeUsersQueryProps.refetch();
  };

  const onExpireTimeChange = async ({ userId, expireAt, role }) => {
    await updateUserHomeAccess({
      userHomeRoleDetails: {
        id: userId,
        homeId: userHome.id,
        expireAt: expireAt.valueOf(),
        role,
      },
    });
    await homeUsersQueryProps.refetch();
  };

  return (
    <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", letterSpacing: "0.05em" }}
        >
          USERS
        </Typography>
        <Button
          onClick={onAddUserClick}
          variant="contained"
          size="small"
          startIcon={<PersonAddAltRounded />}
        >
          Invite
        </Button>
      </Box>

      {homeUsersIsLoading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={76}
              sx={{ borderRadius: tokens.card.borderRadius }}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {_.map(homeUsers, (homeUser) => {
            const {
              user_id,
              user_role,
              user_role_expire_at,
              first_name,
              last_name,
            } = homeUser;
            const isOwner = user_role === USER_ROLE_OWNER;
            return (
              <Box
                key={user_id}
                sx={{
                  bgcolor: theme.palette.surfaceContainer,
                  borderRadius: tokens.card.borderRadius,
                  p: 2,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr auto auto auto" },
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                    {`${first_name} ${last_name}`}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    {getOptionLabel(user_role)}
                  </Typography>
                </Box>

                {user_role_expire_at != "0" && user_role === USER_ROLE_GUEST ? (
                  <DateTimePicker
                    minDate={dayjs()}
                    onChange={(val) =>
                      onExpireTimeChange({
                        userId: user_id,
                        expireAt: val,
                        role: user_role,
                      })
                    }
                    label="Expires"
                    format="D MMM YY at h:mm a"
                    value={dayjs(Number(user_role_expire_at))}
                    slotProps={{ textField: { size: "small" } }}
                  />
                ) : (
                  <Box />
                )}

                <DropDownMenu
                  options={_.filter(
                    ROLE_OPTIONS,
                    (item) => item.value !== USER_ROLE_OWNER
                  )}
                  onOptionClick={(val) =>
                    onOptionClick({ userId: user_id, option: val })
                  }
                >
                  <Button
                    endIcon={<KeyboardArrowDown />}
                    disabled={isOwner}
                    variant="outlined"
                    size="small"
                  >
                    {getOptionLabel(user_role)}
                  </Button>
                </DropDownMenu>

                <IconButton
                  disabled={isOwner}
                  onClick={() => onDeleteClick(user_id)}
                  size="small"
                  aria-label="Remove"
                >
                  <DeleteForeverRounded fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}

      {showAddUserModal && (
        <AddUserModal
          onClose={onCloseAddUserModal}
          homeId={userHome?.id}
          homeUsersQueryProps={homeUsersQueryProps}
        />
      )}
    </Box>
  );
};

export default AccessControll;

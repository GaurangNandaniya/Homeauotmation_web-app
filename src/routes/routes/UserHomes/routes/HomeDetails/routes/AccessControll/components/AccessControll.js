import React, { useContext, useEffect, useState } from "react";
import classes from "./AccessControll.scss";
import { BreadCrumbs, Button, DropDownMenu, Loader } from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import {
  ADD_BREADCRUMS_ITEM,
  REMOVE_BREADCRUMS_ITEM,
} from "contextAPI/reducerActions";
import {
  AdminPanelSettingsRounded,
  DeleteForeverRounded,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { useFetchData, useComponentWillMount } from "hooks";
import { IconButton, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import dayjs from "dayjs";
import AddUserModal from "./AddUserModal";
import { removeUserHomeAccess, updateUserHomeAccess } from "../module/module";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  USER_ROLE_OWNER,
  USER_ROLE_CO_OWNER,
  USER_ROLE_GUEST,
} from "constants/stringConstatnts";
const BREADCRUMB_ID = "ACCESS_CONTROLL";

const ROLE_OPTIONS = [
  {
    id: USER_ROLE_OWNER,
    label: "Owner",
    value: USER_ROLE_OWNER,
  },
  {
    id: USER_ROLE_CO_OWNER,
    label: "Co-Owner",
    value: USER_ROLE_CO_OWNER,
  },
  {
    id: USER_ROLE_GUEST,
    label: "Guest",
    value: USER_ROLE_GUEST,
  },
];

const getOptionLable = (role) => {
  return _.get(
    _.find(ROLE_OPTIONS, (item) => item.id == role),
    "label",
    "Not defined"
  );
};

const AccessControll = () => {
  const { state, dispatch } = useContext(AppContext);
  const { userHome } = useOutletContext();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useComponentWillMount(() => {
    dispatch({
      type: ADD_BREADCRUMS_ITEM,
      value: {
        id: BREADCRUMB_ID,
        icon: <AdminPanelSettingsRounded />,
        label: "Access controll",
        route: `/userHomes/${userHome?.id}/access-controll`,
      },
    });
  });
  useEffect(() => {
    return () => {
      dispatch({
        type: REMOVE_BREADCRUMS_ITEM,
        value: {
          id: BREADCRUMB_ID,
        },
      });
    };
  }, []);

  const { homeUsers, homeUsersIsLoading, homeUsersQueryProps } = useFetchData({
    params: {
      homeDetails: {
        id: userHome?.id,
      },
    },
    path: "home/get-home-user-role",
    queryName: "homeUsers",
  });

  const onOptionClick = async ({ userId, option }) => {
    let role = option.value,
      expireAt;
    if (role == USER_ROLE_GUEST) {
      expireAt = dayjs().add(1, "day").valueOf();
    } else {
      expireAt = undefined;
    }
    await updateUserHomeAccess({
      userHomeRoleDetails: {
        id: userId,
        homeId: userHome.id,
        expireAt,
        role,
      },
    });
    await homeUsersQueryProps.refetch();
  };

  const onAddUserClick = () => {
    setShowAddUserModal(true);
  };

  const onCloseAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const onDeleteClick = async (userId) => {
    await removeUserHomeAccess({
      userHomeRoleDetails: {
        id: userId,
        homeId: userHome.id,
      },
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
    <div className={classes.container}>
      <BreadCrumbs options={state.breadCrumbs?.items} />
      {homeUsersIsLoading ? (
        <Loader />
      ) : (
        <>
          <div className={classes.labelContainer}>
            <Typography variant="h4" sx={{ marginBottom: "12px" }}>
              Access controll
            </Typography>
            <Button onClick={onAddUserClick} variant="contained" size="small">
              Add user
            </Button>
          </div>
          <div className={classes.userListContainer}>
            {_.map(homeUsers, (homeUser, index) => {
              const {
                user_id,
                user_role,
                user_role_expire_at,
                first_name,
                last_name,
              } = homeUser;

              return (
                <div key={user_id} className={classes.userItem}>
                  <Typography sx={{ fontSize: "1.2rem" }}>{`${
                    index + 1
                  }. ${first_name} ${last_name}`}</Typography>
                  {user_role_expire_at != "0" &&
                  user_role == USER_ROLE_GUEST ? (
                    <DateTimePicker
                      minDate={dayjs()}
                      onChange={(val) =>
                        onExpireTimeChange({
                          userId: user_id,
                          expireAt: val,
                          role: user_role,
                        })
                      }
                      label={"Role expire at"}
                      format="D MMM YY at h:mm a"
                      value={dayjs(Number(user_role_expire_at))}
                      defaultValue={dayjs().add(1, "day")}
                    />
                  ) : (
                    <div />
                  )}
                  <DropDownMenu
                    options={_.filter(
                      ROLE_OPTIONS,
                      (item) => item.value != USER_ROLE_OWNER
                    )}
                    onOptionClick={(val) =>
                      onOptionClick({ userId: user_id, option: val })
                    }
                  >
                    <Button
                      endIcon={<KeyboardArrowDown />}
                      disabled={user_role == USER_ROLE_OWNER}
                      variant="outlined"
                    >
                      {getOptionLable(user_role)}
                    </Button>
                  </DropDownMenu>
                  <IconButton
                    disabled={user_role == USER_ROLE_OWNER}
                    onClick={() => onDeleteClick(user_id)}
                  >
                    <DeleteForeverRounded />
                  </IconButton>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showAddUserModal && (
        <AddUserModal
          onClose={onCloseAddUserModal}
          homeId={userHome?.id}
          homeUsersQueryProps={homeUsersQueryProps}
        />
      )}
    </div>
  );
};

export default AccessControll;

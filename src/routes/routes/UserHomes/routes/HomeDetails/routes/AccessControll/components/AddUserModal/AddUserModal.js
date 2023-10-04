import React, { useState } from "react";
import classes from "./AddUserModal.scss";
import { Button, DropDownMenu, Loader, Modal } from "commonComponents";
import { TextField, Typography } from "@mui/material";
import { isValidEmail } from "utils/stringUtils";
import {
  addUserHomeAccess,
  checkUserHomeAvailibility,
} from "../../module/module";
import _ from "lodash";
import { KeyboardArrowDown } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import {
  USER_ROLE_CO_OWNER,
  USER_ROLE_GUEST,
} from "constants/stringConstatnts";

const ROLE_OPTIONS = [
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
    "Select"
  );
};

const AddUserModal = (props) => {
  const { onClose, homeId, homeUsersQueryProps } = props;
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userRoleExpireAt, setUserRoleExpireAt] = useState(
    dayjs().add(1, "day")
  );
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onCheckUserAvalibility = async () => {
    if (!isValidEmail(email)) {
      setIsEmailValid(false);
      return;
    }
    setIsEmailValid(true);
    setIsLoading(true);
    const userInfo = await checkUserHomeAvailibility({ email, homeId });
    setIsLoading(false);
    if (!userInfo) {
      setShowErrorMessage(true);
      return;
    }

    setUserInfo(userInfo);
  };

  const onAddUserClick = async () => {
    await addUserHomeAccess({
      userHomeRoleDetails: {
        id: userInfo.user_id,
        role: userRole,
        expireAt:
          userRole == USER_ROLE_GUEST ? userRoleExpireAt.valueOf() : undefined,
        homeId,
      },
    });
    await homeUsersQueryProps.refetch();
    onClose();
  };

  const onOptionClick = ({ value }) => {
    setUserRole(value);
    if (value == USER_ROLE_CO_OWNER) {
      setUserRoleExpireAt(null);
    }
  };

  const onExpireTimeChange = (value) => {
    setUserRoleExpireAt(value);
  };

  return (
    <Modal onClose={onClose}>
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {"Add user to home"}
          </Typography>
        </div>
        {isLoading ? (
          <Loader />
        ) : showErrorMessage ? (
          <Typography
            variant="h5"
            sx={{ fontSize: "1.8rem", color: "#ff9800", padding: "12px" }}
          >
            {"Either user doen't exist or user already added in home"}
          </Typography>
        ) : !_.isEmpty(userInfo) ? (
          <div className={classes.userRoleInfoContainer}>
            <Typography variant="h5" sx={{ fontSize: "1.8rem" }}>
              Add{" "}
              <strong>{`${userInfo.first_name} ${userInfo.last_name}`}</strong>{" "}
              to this home
            </Typography>
            <DropDownMenu options={ROLE_OPTIONS} onOptionClick={onOptionClick}>
              <Button endIcon={<KeyboardArrowDown />} variant="outlined">
                {getOptionLable(userRole)}
              </Button>
            </DropDownMenu>
            {userRole == USER_ROLE_GUEST ? (
              <DateTimePicker
                className={classes.datePicker}
                minDate={dayjs()}
                onChange={onExpireTimeChange}
                label={"Role expire at"}
                value={userRoleExpireAt}
                defaultValue={dayjs().add(1, "day")}
              />
            ) : null}
          </div>
        ) : (
          <div className={classes.inputContainer}>
            <TextField
              required
              type="email"
              size="small"
              helperText={!isEmailValid ? "Enter valid email" : ""}
              label="Email"
              value={email}
              onChange={onEmailChange}
              error={!isEmailValid}
            />
          </div>
        )}
        <footer className={classes.footer}>
          <Button onClick={onClose} variant="outlined" size="small">
            Cancel
          </Button>
          {!showErrorMessage ? (
            <Button
              onClick={
                !_.isEmpty(userInfo) ? onAddUserClick : onCheckUserAvalibility
              }
              variant="contained"
              color="info"
              size="small"
              disabled={
                !_.isEmpty(userInfo) ? _.isEmpty(userRole) : _.isEmpty(email)
              }
            >
              {!_.isEmpty(userInfo) ? "Add" : "Check avalibility"}
            </Button>
          ) : null}
        </footer>
      </div>
    </Modal>
  );
};

export default AddUserModal;

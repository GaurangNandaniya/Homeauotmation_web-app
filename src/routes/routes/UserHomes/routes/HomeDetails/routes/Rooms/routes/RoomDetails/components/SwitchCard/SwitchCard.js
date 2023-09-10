import React, { useState } from "react";
import classes from "./SwitchCard.scss";
import {
  Lightbulb,
  LightbulbOutlined,
  MoreVert,
  StarBorderRounded,
  StarRateRounded,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { lightBlue, orange } from "@mui/material/colors";
import { DropDownMenu } from "commonComponents";
import {
  addUserSwitchFavorite,
  getUpdatedState,
  removeUserSwitchFavorite,
  updateSwitchState,
} from "../../module/modules";

const CARD_OPTIONS = [
  {
    id: "rename",
    label: "Rename",
    value: "rename",
  },
  {
    id: "delete",
    label: "Delete",
    value: "delete",
  },
];

const SwitchCard = (props) => {
  const {
    onOptionClick,
    switchData,
    roomSwitchesQueryProps,
    userFavoriteSwitchesQueryProps,
    isFavorite,
    showCardOptions = true,
  } = props;
  const { state, name, id } = switchData;
  const [showSwitchStateUpdateLoader, setShowSwitchStateUpdateLoader] =
    useState(false);
  const [showSwitchStarLoader, setShowSwitchStarLoader] = useState(false);

  const onCardClick = async () => {
    setShowSwitchStateUpdateLoader(true);
    await updateSwitchState({ id, state: getUpdatedState(state) });
    await roomSwitchesQueryProps.refetch();
    setShowSwitchStateUpdateLoader(false);
  };

  const onStarClick = async (e) => {
    e.stopPropagation();
    setShowSwitchStarLoader(true);
    if (isFavorite) {
      await removeUserSwitchFavorite({ id });
    } else {
      await addUserSwitchFavorite({ id });
    }
    await userFavoriteSwitchesQueryProps.refetch();
    setShowSwitchStarLoader(false);
  };

  const onCardOptionClick = (params) => {
    onOptionClick({ ...params, switchData });
  };

  return (
    <Card className={classes.cardContainer} onClick={onCardClick}>
      <CardHeader
        action={
          showCardOptions ? (
            <DropDownMenu
              options={CARD_OPTIONS}
              onOptionClick={onCardOptionClick}
            >
              <IconButton>
                <MoreVert />
              </IconButton>
            </DropDownMenu>
          ) : null
        }
        title={name}
      />
      <CardContent>
        <div className={classes.stateContainer}>
          {showSwitchStateUpdateLoader ? (
            <CircularProgress color="secondary" />
          ) : state == "ON" ? (
            <Lightbulb sx={{ color: lightBlue.A400 }} />
          ) : (
            <LightbulbOutlined sx={{ color: lightBlue.A400 }} />
          )}
          {showSwitchStarLoader ? (
            <CircularProgress color="secondary" />
          ) : (
            <IconButton onClick={onStarClick}>
              {isFavorite ? (
                <StarRateRounded fontSize="large" sx={{ color: orange[500] }} />
              ) : (
                <StarBorderRounded
                  fontSize="large"
                  sx={{ color: orange[500] }}
                />
              )}
            </IconButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SwitchCard;

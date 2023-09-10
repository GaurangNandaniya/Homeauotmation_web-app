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
  Typography,
} from "@mui/material";
import { lightBlue, orange } from "@mui/material/colors";
import { DropDownMenu } from "commonComponents";
import {
  addUserSwitchFavorite,
  getUpdatedState,
  removeUserSwitchFavorite,
  updateSwitchState,
} from "RoomDetails/module/modules";

const SwitchCard = (props) => {
  const { switchData, userFavoriteSwitchesQueryProps } = props;
  const { state, switch_name, home_name, room_name, id } = switchData;
  const [showSwitchStateUpdateLoader, setShowSwitchStateUpdateLoader] =
    useState(false);
  const [showSwitchStarLoader, setShowSwitchStarLoader] = useState(false);

  const onCardClick = async () => {
    setShowSwitchStateUpdateLoader(true);
    await updateSwitchState({ id, state: getUpdatedState(state) });
    await userFavoriteSwitchesQueryProps.refetch();
    setShowSwitchStateUpdateLoader(false);
  };

  const onStarClick = async (e) => {
    e.stopPropagation();
    setShowSwitchStarLoader(true);

    await removeUserSwitchFavorite({ id });

    await userFavoriteSwitchesQueryProps.refetch();
    setShowSwitchStarLoader(false);
  };

  return (
    <Card className={classes.cardContainer} onClick={onCardClick}>
      <CardContent>
        <div className={classes.infoContainer}>
          <Typography variant="h5">{switch_name}</Typography>
          <Typography>Room name: {room_name}</Typography>
          <Typography>Home name: {home_name}</Typography>
        </div>
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
              <StarRateRounded fontSize="large" sx={{ color: orange[500] }} />
            </IconButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SwitchCard;

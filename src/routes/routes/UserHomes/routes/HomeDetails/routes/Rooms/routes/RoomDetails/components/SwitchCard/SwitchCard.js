import React, { useState } from "react";
import classes from "./SwitchCard.scss";
import { Lightbulb, LightbulbOutlined, MoreVert } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DropDownMenu } from "commonComponents";
import { getUpdatedState, updateSwitchState } from "../../module/modules";

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
  const { onOptionClick, switchData, queryProps } = props;
  const { state, name } = switchData;
  const [showSwitchStateUpdateLoader, setShowSwitchStateUpdateLoader] =
    useState(false);
  const onCardClick = async ({ id, state }) => {
    setShowSwitchStateUpdateLoader(true);
    await updateSwitchState({ id, state: getUpdatedState(state) });
    await queryProps.refetch();
    setShowSwitchStateUpdateLoader(false);
  };

  const onCardOptionClick = (params) => {
    onOptionClick({ ...params, switchData });
  };

  return (
    <Card
      className={classes.cardContainer}
      onClick={() => onCardClick(switchData)}
    >
      <CardHeader
        action={
          <DropDownMenu
            options={CARD_OPTIONS}
            onOptionClick={onCardOptionClick}
          >
            <IconButton>
              <MoreVert />
            </IconButton>
          </DropDownMenu>
        }
        title={name}
      />
      <CardContent>
        <span className={classes.stateContainer}>
          {showSwitchStateUpdateLoader ? (
            <CircularProgress color="secondary" />
          ) : state == "ON" ? (
            <Lightbulb />
          ) : (
            <LightbulbOutlined />
          )}
        </span>
      </CardContent>
    </Card>
  );
};

export default SwitchCard;

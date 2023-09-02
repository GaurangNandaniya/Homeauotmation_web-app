import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import _ from "lodash";
import PropTypes from "prop-types";

const DropDownMenu = (props) => {
  const { options, children, onOptionClick } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {React.cloneElement(children, { onClick: handleClick })}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {_.map(options, (option) => {
          const { id, label, onClick } = option;
          return (
            <MenuItem
              key={id}
              onClick={() => {
                if (onClick) {
                  onClick(option);
                } else {
                  onOptionClick(option);
                }
                handleClose();
              }}
            >
              {label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

DropDownMenu.prototype = {
  options: PropTypes.arrayOf(PropTypes.object),
  onOptionClick: PropTypes.func,
};
DropDownMenu.defaultProps = {
  options: [],
  onOptionClick: _.noop,
};

export default DropDownMenu;

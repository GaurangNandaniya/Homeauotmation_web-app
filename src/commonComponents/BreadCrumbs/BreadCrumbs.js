import React from "react";
import classes from "./BreadCrumbs.scss";
import PropTypes from "prop-types";
import { Breadcrumbs as BreadcrumbsComp, Link } from "@mui/material";
import { ArrowCircleLeftRounded } from "@mui/icons-material";
import { grey, blue } from "@mui/material/colors";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const style = {
  marginBottom: "8px",
  fontSize: "1.2rem",
};

const BreadCrumbs = (props) => {
  const { options, showBackButton } = props;
  const navigate = useNavigate();

  const onGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={classes.container}>
      {showBackButton && (
        <span className={classes.backButton} onClick={onGoBack}>
          <ArrowCircleLeftRounded sx={{ color: blue[500] }} fontSize="large" />
        </span>
      )}
      <BreadcrumbsComp color={grey[700]} sx={style}>
        {_.map(options, (option) => {
          const { id, route, icon, label } = option;
          return (
            <Link
              key={id}
              href={route}
              className={classes.item}
              underline="hover"
              color="inherit"
            >
              {icon && icon}
              {label}
            </Link>
          );
        })}
      </BreadcrumbsComp>
    </div>
  );
};

BreadCrumbs.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      icon: PropTypes.element,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  showBackButton: PropTypes.bool,
};

BreadCrumbs.defaultProps = {
  options: [],
  showBackButton: true,
};
export default BreadCrumbs;

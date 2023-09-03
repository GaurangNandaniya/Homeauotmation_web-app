import React from "react";
import classes from "./BreadCrumbs.scss";
import PropTypes from "prop-types";
import { Breadcrumbs as BreadcrumbsComp, Link } from "@mui/material";
import { grey } from "@mui/material/colors";
import _ from "lodash";

const style = {
  marginBottom: "8px",
};

const BreadCrumbs = (props) => {
  const { options } = props;
  return (
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
};

BreadCrumbs.defaultProps = {
  options: [],
};
export default BreadCrumbs;

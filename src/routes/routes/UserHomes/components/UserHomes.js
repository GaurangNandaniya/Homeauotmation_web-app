import React, { useContext } from "react";
import classes from "./UserHomes.scss";
import { useFetchData } from "hooks";
import { EmptyState, Loader } from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import _ from "lodash";
import { Card, CardContent, Typography } from "@mui/material";

const UserHomes = () => {
  const { state } = useContext(AppContext);
  const {
    data: userHomes,
    isError,
    isLoading,
  } = useFetchData({
    params: { userDetails: { userId: _.get(state, "userInfo.userId", "") } },
    path: "home/userHomes",
  });

  const onCreateNewHome = () => {
    console.log("create home");
  };

  return (
    <div className={classes.container}>
      {isLoading ? (
        <Loader />
      ) : _.isEmpty(userHomes) ? (
        <EmptyState
          buttonText="Create home"
          onButtonClick={onCreateNewHome}
          showButton={true}
          title="You haven't created home yet!!"
        />
      ) : (
        <>
          <Typography variant="h4" sx={{ marginBottom: "12px" }}>
            Homes
          </Typography>
          <div className={classes.homeListContainer}>
            {_.map(userHomes, (home) => {
              const { id, name, room_count } = home;
              return (
                <Card className={classes.cardContainer} key={id}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Room count: {room_count}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default UserHomes;

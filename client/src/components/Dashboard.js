import React from "react";
import { useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";

function Dashboard() {
  let storeObj = useSelector((store) => {
    console.log(store);
    return store.loggedInUser;
  });

  return (
    <div>
      <TopNavigation />
      <h2>Dashboard</h2>
      <h3>
        {storeObj.firstName} {storeObj.lastName}
      </h3>
      <img src={`/${storeObj.profilePic}`}></img>
    </div>
  );
}

export default Dashboard;

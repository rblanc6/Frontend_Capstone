import { useState, useEffect } from "react";
import ToggleDetails from "./UserDetailsToggle";
import UserDetailsGrid from "./UserDetailsGrid";
import UserDetailsList from "./UserDetailsList";

export default function AdminUserDetails() {


  const [isGridView, setIsGridView] = useState(true);
  const [isListView, setIsListView] = useState(false);

  const setListView = () => {
    setIsListView(true);
    setIsGridView(false);
  };

  const setGridView = () => {
    setIsListView(false);
    setIsGridView(true);
  };

  return (
    <div className="container">
      <ToggleDetails
        setGridView={setGridView}
        setListView={setListView}
      ></ToggleDetails>
      {isGridView ? (
        <UserDetailsGrid isGridView={isGridView}></UserDetailsGrid>
      ) : (
        <UserDetailsList isListView={isListView}></UserDetailsList>
      )}

    </div>
  );
}

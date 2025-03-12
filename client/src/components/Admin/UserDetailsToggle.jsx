import * as React from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleDetails({ setListView, setGridView }) {
  const [view, setView] = React.useState("module");

  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
      if (nextView === "module") {
        setGridView();
      } else {
        setListView();
      }
    }
  };


  return (
    <div className="toggle-group" >
      <ToggleButtonGroup value={view} exclusive onChange={handleChange}>
        <ToggleButton value="module" aria-label="module" onClick={setGridView}>
          <ViewModuleIcon />
        </ToggleButton>
        <ToggleButton value="list" aria-label="list" onClick={setListView}>
          <ViewListIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
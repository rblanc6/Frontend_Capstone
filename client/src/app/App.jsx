import { useState } from "react";
import "./App.css";
import Register from "../components/Register/Register";
import { Route, Routes } from "react-router-dom";

function App() {
  const [token, setToken] = useState(null);

  return (
    <>
      <Routes>
        <Route
          path="/register"
          element={<Register token={token} setToken={setToken} />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;

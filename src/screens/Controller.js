import { createContext, useState } from "react";
import Home from "../screens/home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";

export const UserContext = createContext();

export const SnackbarContext = createContext();

const Controller = () => {
  const baseUrl = "/api/v1/";
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(sessionStorage.getItem('loggedInUser')));
  const [[showSnackBar, snackBarMsg], showGenericSnackBar] = useState([false, ""]);
  const OpenGenericSnackBar = (displaySnackBar, message = "Something went wrong. Please try again later.") => {
    showGenericSnackBar([displaySnackBar, message]);
  }
  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <SnackbarContext.Provider value={{ showSnackBar, snackBarMsg, OpenGenericSnackBar }}>
        <Router>
          <div className="main-container">
            <Route
              exact
              path="/"
              render={(props) => <Home {...props} baseUrl={baseUrl} />}
            />
          </div>
        </Router>
      </SnackbarContext.Provider>
    </UserContext.Provider>
  );
};

export default Controller;

import { useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { UserDetailsContext } from "../auth/UserDetailsContext";
import UserDetails from "./UserDetails";

export default () => {
  const [theme, setTheme] = useState("light");
  const userdetails = useContext(UserDetailsContext);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={(e) => {
          setTheme(e.target.checked ? "dark" : "light");
        }}
      />
      Use dark mode
      <div
        style={{
          backgroundColor: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
          padding: "20px",
        }}
      >
        <h1>
          Welcome to the Landing Page {userdetails?.userDetails?.user?.name}
        </h1>
        <p>This is the landing page of the application.</p>
        <UserDetails />
      </div>
    </ThemeContext.Provider>
  );
};

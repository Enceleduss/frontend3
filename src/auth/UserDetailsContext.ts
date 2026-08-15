import {createContext, useContext, useState} from "react";

type UserDetailsContextType = {
  userDetails: any,
  setUserDetails: React.Dispatch<React.SetStateAction<any>>
};

export const UserDetailsContext = createContext<UserDetailsContextType>(null as any);


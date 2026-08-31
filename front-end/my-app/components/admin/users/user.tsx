"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import UserCPN from "./UserCPN";

export default function User() {
  return (
    <Provider store={store}>
      <UserCPN />
    </Provider>
  );
}
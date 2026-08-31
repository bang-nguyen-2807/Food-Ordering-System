"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import LogoutCPN from "./LogoutCPN";

export default function Logout() {
  return (
    <Provider store={store}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 transition-all">
        <LogoutCPN />
      </div>
    </Provider>
  );
}


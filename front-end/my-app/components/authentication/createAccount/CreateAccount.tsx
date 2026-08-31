"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import CreateAccountCPN from "./CreateAccountCPN";

export default function CreateAccount() {
  return (
    <Provider store={store}>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-gray-100 p-8 sm:p-10">
        <CreateAccountCPN
          onSwitchToLogin={() => {
            window.location.href = "/authentication/login";
          }}
        />
      </div>
    </Provider>
  );
}

"use client";

import React from "react";
import { Provider } from "react-redux";
import Modal from "@/components/modal/modal";
import LogoutCPN from "./LogoutCPN";
import { store } from "@/store/store";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onSuccess,
}: LogoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <Provider store={store}>
        <LogoutCPN onClose={onClose} onSuccess={onSuccess} />
      </Provider>
    </Modal>
  );
}


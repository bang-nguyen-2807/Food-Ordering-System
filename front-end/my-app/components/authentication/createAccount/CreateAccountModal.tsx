"use client";

import React from "react";
import Modal from "@/components/modal/modal";
import CreateAccountCPN from "./CreateAccountCPN";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAccountModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAccountModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <CreateAccountCPN
        onSuccess={() => {
          if (onSuccess) onSuccess();
          onClose();
        }}
        onSwitchToLogin={onClose}
      />
    </Modal>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 my-auto max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-lg",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { Modal };
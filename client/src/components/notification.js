import { toastManager } from "@/components/ui/toast";

const TOAST_TIMEOUT = 3500;

const TYPE_ALIASES = {
  warn: "warning",
  danger: "error",
};

export const showToast = (message, type = "info") => {
  const resolvedType = TYPE_ALIASES[type] || type;

  toastManager.add({
    title: message,
    type: resolvedType,
    timeout: TOAST_TIMEOUT,
  });
};

export const toast = {
  success: (message) => showToast(message, "success"),
  error: (message) => showToast(message, "error"),
  info: (message) => showToast(message, "info"),
  warn: (message) => showToast(message, "warning"),
  warning: (message) => showToast(message, "warning"),
};

const Notification = () => {
  return null;
};

export default Notification;

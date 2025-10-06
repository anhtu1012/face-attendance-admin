"use client";
import React, { createContext, useContext } from "react";
import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";

// Context to hold Antd message API
const MessageContext = createContext<MessageInstance | null>(null);

export const AntdMessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={messageApi}>
      {/* Render contextHolder once at top-level so message can use context */}
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

// Hook to retrieve the message API
export const useAntdMessage = () => {
  const api = useContext(MessageContext);
  if (!api) {
    throw new Error(
      "useAntdMessage must be used within an AntdMessageProvider"
    );
  }
  return api;
};

export default AntdMessageProvider;

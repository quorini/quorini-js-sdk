import { useContext } from "react";
import { QGqlContextType, QGqlContext } from "../context";

export const useQGql = (): QGqlContextType => {
  const context = useContext(QGqlContext);
  if (!context) {
    throw new Error('useQGql must be used within a QGqlProvider');
  }
  return context;
};
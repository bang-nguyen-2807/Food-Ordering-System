"use client";

import { Provider } from "react-redux";
import AnalyticsCPN from "./AnalyticsCPN";
import { store } from "@/store/store";

export default function Analytics() { // bọc Redux Provider cho trang Thống kê doanh thu
  return (
    <Provider store={store}>
      <AnalyticsCPN />
    </Provider>
  );
}

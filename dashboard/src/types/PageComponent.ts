import { NextComponentType, NextPage, NextPageContext } from "next";
import React from "react";

export type PageComponent<T> = NextPage<T> & {
  requiresAuth?: boolean;
  getLayout?: (
    page: React.ReactNode
  ) => React.ReactNode;
};

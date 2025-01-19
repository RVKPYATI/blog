import React from "react";
import { Header } from "./Header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </>
  );
};

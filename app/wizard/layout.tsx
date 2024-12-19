import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" container m-auto !important max-sm:w-[95%] relative flex h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default layout;

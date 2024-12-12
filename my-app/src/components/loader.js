import React, { useState, useEffect } from "react";
import { Backdrop, CircularProgress, Button } from "@mui/material";

export const ApiCallWithLoader = (props) => {
  return (
    <div>

      {/* Backdrop and loader */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={props.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

import express from "express";

//#region Admin Routes
import adminRouter from "./admin/adminRouter";
import userRouter from "./admin/userRotuer";
import commonRouter from "./admin/commonRouter";
import userInfoRouter from "./admin/userInfoRouter";
//#endregion Admin Routes

//#region Front Routes
import userFrontRouter from "./front/userRouter";
import authFrontRouter from "./front/authRouter";
import charityFrontRouter from "./front/charityRouter";
//#endregion Front Routes

export default (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //#region Admin Routes
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/users", userRouter); //auth
  app.use("/api/v1/common", commonRouter);
  app.use("/api/v1/userInfo", userInfoRouter);
  //#endregion Admin Routes

  //#region Front Routes
  app.use("/api/v1/front/auth", authFrontRouter);
  app.use("/api/v1/front/users", userFrontRouter);
  app.use("/api/v1/front/charities", charityFrontRouter);
  //#endregion Front Routes

  app.all("*", (req, res) => (res, 404, "Route does not exist"));
};

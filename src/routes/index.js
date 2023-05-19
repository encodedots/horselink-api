import express from "express";

//#region Admin Routes
import adminRouter from "./admin/adminRouter";
import userRouter from "./admin/userRotuer";
import commonRouter from "./admin/commonRouter";
import userInfoRouter from "./admin/userInfoRouter";
import faqRouter from "./admin/faqRouter";
import sponsorRouter from "./admin/sponsorRouter";
import saleHorseRouter from "./admin/saleHorseRouter";
import userSocialMediaRouter from "./admin/userSocialMediaRouter";
import horseListRouter from "./admin/horseListRouter";
import horseProductRouter from "./admin/horseProductRouter";
//#endregion Admin Routes

//#region Front Routes
import userFrontRouter from "./front/userRouter";
import authFrontRouter from "./front/authRouter";
import charityFrontRouter from "./front/charityRouter";
import contactManagementFrontRouter from "./front/contactManagementRouter";
import faqFrontRouter from "./front/faqRouter";
import dataProtectionFrontRouter from "./front/dataProtectionRouter";
import categoryRouter from "./front/categoryRouter";
import saleHorseFrontRouter from "./front/saleHorseRouter";
//#endregion Front Routes

export default (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //#region Admin Routes
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/users", userRouter); //auth
  app.use("/api/v1/common", commonRouter);
  app.use("/api/v1/userInfo", userInfoRouter);
  app.use("/api/v1/faq", faqRouter);
  app.use("/api/v1/sponsor", sponsorRouter);
  app.use("/api/v1/saleHorse", saleHorseRouter);
  app.use("/api/v1/horseList", horseListRouter);
  app.use("/api/v1/userSocialMedia", userSocialMediaRouter);
  app.use("/api/v1/horseProduct", horseProductRouter);
  //#endregion Admin Routes

  //#region Front Routes
  app.use("/api/v1/front/auth", authFrontRouter);
  app.use("/api/v1/front/users", userFrontRouter);
  app.use("/api/v1/front/charities", charityFrontRouter);
  app.use("/api/v1/front/contacts", contactManagementFrontRouter);
  app.use("/api/v1/front/faq", faqFrontRouter);
  app.use("/api/v1/front/dataProtection", dataProtectionFrontRouter);
  app.use("/api/v1/front/categories", categoryRouter);
  app.use("/api/v1/front/saleHorse", saleHorseFrontRouter);
  //#endregion Front Routes

  app.all("*", (req, res) => (res, 404, "Route does not exist"));
};

import express from "express";

//#region Admin Routes
import adminRouter from "./admin/adminRouter";
import userRouter from "./admin/userRotuer";
import commonRouter from "./admin/commonRouter";
//#endregion Admin Routes


export default (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //#region Admin Routes
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/users', userRouter); //auth
  app.use('/api/v1/common', commonRouter); 
  //#endregion Admin Routes


  app.all('*', (req, res) => (res, 404, 'Route does not exist'));
}

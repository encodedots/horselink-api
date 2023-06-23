import messages from "../../utils/message";
import model from "../../models";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
const { saleHorse, horseCategory, user, countries, category } = model;
import Constants from "../../utils/constants";
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
export class SaleHorseService {
  /**
   * Summary: This method get all horse categories
   * @returns
   */
  async getHorseCategory() {
    try {
      var categoryOne = [],
        categoryTwo = [];
      categoryOne = await horseCategory.findAll({
        where: {
          deletedAt: null,
          type:"main"
        },
        order:[["name", "ASC"]]
      });

      categoryTwo = await horseCategory.findAll({
        where: {
          deletedAt: null,
          type:"sub"
        },
        order:[["name", "ASC"]]
      });

      // Return response
      return {
        categoryOne: categoryTwo,
        categoryTwo: categoryOne
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get all horse list category wise
   * @returns
   */
  async getHorseList(input, latitude, longitude) {
    try {
      var output = "";
      var whereObj = {};
      if (input.filter && input.filter.deviceType == Constants.TYPE_DESKTOP) {
        
      if (
        input.filter &&
        input.filter.horseCategoryId &&
        input.filter.horseCategoryId != 0 && input.filter.horseCategoryId != -1 
      ) {
        whereObj.horseCategoryId = input.filter.horseCategoryId
      }
      if (
        input.filter &&
        input.filter.horseSubCategoryId &&
        input.filter.horseSubCategoryId != 0 && input.filter.horseSubCategoryId != -1
      ) {
        whereObj.horseSubCategoryId = input.filter.horseSubCategoryId
      }

    }
    if (input.filter && input.filter.deviceType == Constants.TYPE_MOBILE) {
      if (
        input.filter &&
        input.filter.horseSubCategoryId &&
        input.filter.horseSubCategoryId != 0 && input.filter.horseSubCategoryId != -1
      ) {
        whereObj[Op.or] = [{ horseCategoryId: input.filter.horseSubCategoryId }, { horseSubCategoryId: input.filter.horseSubCategoryId }]
      }
    }
    
      whereObj.deletedAt = null;

      // Get all sale horse with pagination and filter
      output = await saleHorse.findAll({
        where: whereObj,
        include: [
          {
            model: user,
            as: "userDetails",
            where: {
              deletedAt: null,
              isDeleted: "n",
              isActive: "y",
              status: "y"
            },
            include: [
              {
                model: countries,
                as: "countryDetails"
              },
              {
                model: category,
                as: "categoryDetails"
              }
            ]
          },
          {
            model: horseCategory,
            as: "horseCategoryDetails"
          },
          {
            model: horseCategory,
            as: "horseSubCategoryDetails"
          }
        ],
        attributes: {
          include: [
            [
              model.sequelize.literal(
                `111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(latitude)) * COS(RADIANS(` +
                  latitude +
                  `)) * COS(RADIANS(longitude - ` +
                  longitude +
                  `)) + SIN(RADIANS(latitude)) * SIN(RADIANS(` +
                  latitude +
                  `)))))`
              ),
              "distance_in_km"
            ]
          ]
        },
        order:
          input.filter && input.filter.sort == "Closest"
            ? [["distance_in_km", "ASC"]]
            : [["id", "DESC"]],
        offset: parseInt(input.limit * (input.page - 1)),
        limit: parseInt(input.limit)
      });

      // Get count of all users based on filter
      var count = await saleHorse.count({
        where: whereObj,
        include: [
          {
            model: user,
            as: "userDetails",
            where: {
              deletedAt: null,
              isDeleted: "n",
              isActive: "y",
              status: "y"
            },
            include: [
              {
                model: countries,
                as: "countryDetails"
              },
              {
                model: category,
                as: "categoryDetails"
              }
            ]
          },
          {
            model: horseCategory,
            as: "horseCategoryDetails"
          },{
            model: horseCategory,
            as: "horseSubCategoryDetails"
          }
        ]
      });

      var pagesCount = Math.ceil(count / input.limit);
      var pages = isNaN(pagesCount) ? 0 : parseInt(pagesCount);

      if (output && output.length > 0) {
        await Promise.all(
          output.map(async (element, i) => {
            var data = await saleHorse.findAll({
              where: { userId: element.userId }
            });
            if (data && data.length > 0) {
              element.dataValues.count = data.length;
            }
          })
        );
      }
      // Return response
      return {
        records: output,
        totalCount: count,
        pageSize: input.limit,
        currentPage: input.page,
        pages: pages
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get all horse list or user list category wise
   * @returns
   */
  async getUserHorseList(input, latitude, longitude) {
    try {
      var output = "";

      if (input == "saleHorse") {
        // Get all sale horse with pagination and filter
        output = await saleHorse.findAll({
          where: {
            deletedAt: null,
            horseCategoryId: {
              [Op.ne]: null
            }
          },
          include: [
            {
              model: user,
              as: "userDetails",
              where: {
                deletedAt: null,
                isDeleted: "n",
                isActive: "y",
                status: "y"
              },
              include: [
                {
                  model: countries,
                  as: "countryDetails"
                },
                {
                  model: category,
                  as: "categoryDetails"
                }
              ]
            },
            {
              model: horseCategory,
              as: "horseCategoryDetails"
            }
          ],
          attributes: {
            include: [
              [
                model.sequelize.literal(
                  `111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(latitude)) * COS(RADIANS(` +
                    latitude +
                    `)) * COS(RADIANS(longitude - ` +
                    longitude +
                    `)) + SIN(RADIANS(latitude)) * SIN(RADIANS(` +
                    latitude +
                    `)))))`
                ),
                "distance_in_km"
              ]
            ]
          },
          order: [["distance_in_km", "ASC"]]
        });
      } else {
        // Get all user with pagination and filter
        output = await user.findAll({
          where: {
            isDeleted: "n",
            deletedAt: null,
            isActive: "y",
            status: "y",
            categoryId: {
              [Op.ne]: null
            }
          },
          include: [
            {
              model: category,
              as: "categoryDetails"
            },
            {
              model: countries,
              as: "countryDetails"
            }
          ],
          attributes: {
            include: [
              [
                model.sequelize.literal(
                  `111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(latitude)) * COS(RADIANS(` +
                    latitude +
                    `)) * COS(RADIANS(longitude - ` +
                    longitude +
                    `)) + SIN(RADIANS(latitude)) * SIN(RADIANS(` +
                    latitude +
                    `)))))`
                ),
                "distance_in_km"
              ]
            ]
          },
          order: [["distance_in_km", "ASC"]]
        });
      }
      // Return response
      return {
        records: output
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}

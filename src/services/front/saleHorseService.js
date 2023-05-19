import messages from "../../utils/message";
import model from "../../models";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
const { saleHorse, horseCategory, user, countries } = model;
import Constants from "../../utils/constants";
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
          deletedAt: null
        },
        limit: 7
      });

      categoryTwo = await horseCategory.findAll({
        where: {
          deletedAt: null
        },
        limit: 10,
        offset: 7
      });

      // Return response
      return {
        categoryOne: categoryOne,
        categoryTwo: categoryTwo
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get all horse list category wise
   * @returns
   */
  async getHorseList(input) {
    try {
      var output = "";
      var whereObj = {};

      if (
        input.filter &&
        input.filter.type &&
        input.filter.type != "All horses"
      ) {
        whereObj.name = input.filter.type;
      }

      // Get all sale horse with pagination and filter
      output = await saleHorse.findAll({
        where: {
          deletedAt: null
        },
        include: [
          {
            model: user,
            as: "userDetails",
            include: [
              {
                model: countries,
                as: "countryDetails"
              }
            ]
          },
          {
            model: horseCategory,
            as: "horseCategoryDetails",
            where: whereObj
          }
        ],
        attributes: {
          include: [
            [
              model.sequelize.literal(
                `111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(latitude)) * COS(RADIANS(` +
                  Constants.LATITUDE +
                  `)) * COS(RADIANS(longitude - ` +
                  Constants.LONGITUDE +
                  `)) + SIN(RADIANS(latitude)) * SIN(RADIANS(` +
                  Constants.LATITUDE +
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
        where: {
          deletedAt: null
        },
        include: [
          {
            model: user,
            as: "userDetails",
            include: [
              {
                model: countries,
                as: "countryDetails"
              }
            ]
          },
          {
            model: horseCategory,
            as: "horseCategoryDetails",
            where: whereObj
          }
        ]
      });

      var pagesCount = Math.ceil(count / input.limit);
      var pages = isNaN(pagesCount) ? 0 : parseInt(pagesCount);

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
}

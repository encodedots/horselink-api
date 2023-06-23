import model from "../../models";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
import {
  isEmptyObject,
  isValidInteger,
  isValidString
} from "../../utils/validation";
import Constants from "../../utils/constants";
import s3Routes from "../../utils/s3Routes";
import { uploadFile, deleteFileFromS3 } from "../../utils/files";
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { user, saleHorse } = model;

export class SaleHorseService {
  /**
   * Summary: This method creates a new sale horse entry
   * @param {*} input - This paramter contains parameter related to sale horse table
   */
  async addHorseForSale(id, input, inputFiles) {
    try {
      var output = "";
      var videoCount = 0;

      // Get user by id
      var userData = await user.findOne({ where: { id: id } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      // Get video for existing records
      var getOldSaleHorseData = await saleHorse.findAll({
        where: {
          userId: id,
          fileName: { [Op.ne]: null }
        },
        attributes: ["fileName"]
      });

      // Delete existing records
      await saleHorse.destroy({ where: { userId: id } });

      if (input.details && input.details.length > 0) {
        let horseData = input.details;

        await Promise.all(
          horseData.map(async (element, i) => {
            var data = JSON.parse(element.horseSaleData);

            // New object for horse sale details
            if (
              (data.description != "" &&
                data.category != "" && data.subCategory != "")
            ) {
              let newSaleHorse = {
                userId: isValidInteger(id) ? id : 0,
                title: isValidString(input.title) ? input.title.trim() : "",
                titleLink: isValidString(input.titleLink)
                  ? input.titleLink.trim()
                  : "",
                description: isValidString(data.description)
                  ? data.description.trim()
                  : "",
                horseCategoryId: isValidInteger(data.category)
                  ? data.category
                  : null,
                horseSubCategoryId: isValidInteger(data.subCategory)
                  ? data.subCategory
                  : null,
                link: isValidString(data.link) ? data.link.trim() : "",
                type:
                  isValidString(data.type) && isValidString(data.description)
                    ? data.type.trim()
                    : "",
                order: i + 1
              };

              if (data.type == "link") {
                newSaleHorse.youtubeLink = data.youtubeLink;
              } else if (data.type == "embed") {
                newSaleHorse.youtubeEmbed = data.youtubeEmbed;
              } else if (data.type == "device") {
                // Upload from device (video details)
                if (
                  data.originalFile &&
                  data.originalFile != null &&
                  !isEmptyObject(data.originalFile) &&
                  data.originalFile != ""
                ) {
                  if (data.originalFile.length > 0) {
                    var split_data = data.originalFile.split(Constants.AWSPATH);
                    newSaleHorse.fileName = split_data[1];
                    newSaleHorse.fileUrl = data.originalFile;
                  }
                } else {
                  if (
                    data.originalFile != null &&
                    data.originalFile != undefined &&
                    isEmptyObject(data.originalFile)
                  ) {
                    if (
                      inputFiles.details &&
                      inputFiles.details[videoCount] &&
                      inputFiles.details[videoCount].originalFile &&
                      inputFiles.details[videoCount].originalFile !=
                        undefined &&
                      inputFiles.details[videoCount].originalFile != null
                    ) {
                      var fileInputData = {
                        file: inputFiles.details[videoCount].originalFile,
                        filePath: s3Routes.SALE_HORSE_VIDEO + id + "/"
                      };
                      videoCount = videoCount + 1;
                      var videoFile = await uploadVideo(fileInputData);
                      newSaleHorse.fileName = videoFile.fileName;
                      newSaleHorse.fileUrl = videoFile.fileUrl;
                    }
                  }
                }
              }
              output = await saleHorse.create(newSaleHorse);
            }
          })
        );
      } else {
        let newSaleHorse = {
          userId: isValidInteger(id) ? id : 0,
          title: isValidString(input.title) ? input.title.trim() : "",
          titleLink: isValidString(input.titleLink)
            ? input.titleLink.trim()
            : "",
          order: 1
        };
        output = await saleHorse.create(newSaleHorse);
      }

      // get video for new records
      var getNewSaleHorseData = await saleHorse.findAll({
        where: { userId: id, fileName: { [Op.ne]: null } },
        attributes: ["fileName"]
      });

      var extraVideoArray = getOldSaleHorseData.filter(
        (e) =>
          !getNewSaleHorseData.find(
            (a) => e.dataValues.fileName == a.dataValues.fileName
          )
      );

      // Delete video file from S3
      if (extraVideoArray && extraVideoArray.length > 0) {
        extraVideoArray.forEach(async (element) => {
          var deleteImageParams = {
            key: element.dataValues.fileName
          };
          await deleteFileFromS3(deleteImageParams);
        });
      }

      var gethorseSaleData = await saleHorse.findAll({
        where: { userId: id }
      });
      
      // Return response
      return gethorseSaleData;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets specific sale horse details based on userid and return it
   * @param {*} input
   * @returns
   */
  async getSaleHorseDetails(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a specific user details based on id
      output = await saleHorse.findAll({
        where: { userId: input },
        order: [["order", "ASC"]]
      });

      if (output == null) return adminServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }
}

var uploadVideo = (fileInput) => {
  return new Promise(async (resolve, reject) => {
    var data = await uploadFile(fileInput);
    var newSaleHorse = {};
    newSaleHorse.fileName = data.key;
    newSaleHorse.fileUrl = data.Location;
    resolve(newSaleHorse);
  });
};

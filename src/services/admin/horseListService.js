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
const { user, horseList } = model;

export class HorseListService {
  /**
   * Summary: This method add or update horse list entry
   * @param {*} input - This paramter contains parameter related to horse list table
   */
  async addHorseList(id, input, inputFiles) {
    try {
      var output = "";
      var videoCount = 0;

      // Get user by id
      var userData = await user.findOne({ where: { id: id } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      // Get video for existing records
      var getOldHorseData = await horseList.findAll({
        where: {
          userId: id,
          fileName: { [Op.ne]: null }
        },
        attributes: ["fileName"]
      });

      // Delete existing records
      await horseList.destroy({ where: { userId: id } });

      if (input.details && input.details.length > 0) {
        let horseData = input.details;

        await Promise.all(
          horseData.map(async (element, i) => {
            var data = JSON.parse(element.horseListData);

            // New object for horse list details
            if (
              (data.description != "" &&
                data.category != "" &&
                data.link != "") ||
              input.titleLink
            ) {
              let newHorseList = {
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
                link: isValidString(data.link) ? data.link.trim() : "",
                type:
                  isValidString(data.type) && isValidString(data.description)
                    ? data.type.trim()
                    : "",
                order: i + 1
              };

              if (data.type == "link") {
                newHorseList.youtubeLink = data.youtubeLink;
              } else if (data.type == "embed") {
                newHorseList.youtubeEmbed = data.youtubeEmbed;
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
                    newHorseList.fileName = split_data[1];
                    newHorseList.fileUrl = data.originalFile;
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
                        filePath: s3Routes.HORSE_LIST_VIDEO + id + "/"
                      };
                      videoCount = videoCount + 1;
                      var videoFile = await uploadVideo(fileInputData);
                      newHorseList.fileName = videoFile.fileName;
                      newHorseList.fileUrl = videoFile.fileUrl;
                    }
                  }
                }
              }
              output = await horseList.create(newHorseList);
            }
          })
        );
      } else {
        let newHorseList = {
          userId: isValidInteger(id) ? id : 0,
          title: isValidString(input.title) ? input.title.trim() : "",
          titleLink: isValidString(input.titleLink)
            ? input.titleLink.trim()
            : "",
          order: 1
        };
        output = await horseList.create(newHorseList);
      }

      // get video for new records
      var getNewHorseData = await horseList.findAll({
        where: { userId: id, fileName: { [Op.ne]: null } },
        attributes: ["fileName"]
      });

      var extraVideoArray = getOldHorseData.filter(
        (e) =>
          !getNewHorseData.find(
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

      // Get the horse list data
      var getHorseData = await horseList.findAll({
        where: { userId: id }
      });

      // Return response
      return getHorseData;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets specific horse list details based on user id and return it
   * @param {*} input
   * @returns
   */
  async getHorseListDetails(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a specific user details based on id
      output = await horseList.findAll({
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
    var newHorse = {};
    newHorse.fileName = data.key;
    newHorse.fileUrl = data.Location;
    resolve(newHorse);
  });
};

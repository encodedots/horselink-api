import messages from "../../utils/message";
import model from "../../models";
import {
  isEmptyObject,
  isValidInteger,
  isValidString
} from "../../utils/validation";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
import s3Routes from "../../utils/s3Routes";
import { uploadFile, deleteFileFromS3 } from "../../utils/files";

import Constants from "../../utils/constants";
const { user, sponsors } = model;

export class SponsorService {
  /**
   * Summary: This method get sponsor details based on id and return it
   * @param {*} input
   * @returns
   */
  async getSponsor(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a sponsor details based on id
      output = await sponsors.findAll({
        where: { userId: input },
        order: [["order", "ASC"]]
      });

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method add/update sponsor details
   * @param {*} input - This paramter contains parameter related to sponsor table
   * @param {*} id - This paramter contains userId
   */
  async addSponser(input, id, inputFiles) {
    try {
      var count = 0;
      var cropCount = 0;

      var output = "";
      // Get user by id
      var userData = await user.findOne({ where: { id: id } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      var getOriginalData = await sponsors.findAll({
        where: { userId: id },
        attributes: ["fileName"]
      });
      var getCroppedData = await sponsors.findAll({
        where: { userId: id },
        attributes: ["croppedFileName"]
      });

      await sponsors.destroy({ where: { userId: id } });

      if (input.sponsors && input.sponsors.length > 0) {
        let sponsorData = input.sponsors;
        await Promise.all(
          sponsorData.map(async (element, i) => {
            var data = JSON.parse(element.sponsordata);
            // New object for sponsor details
            if (data.name != "" && data.code != "" && data.link != "") {
              let newSponsor = {
                userId: isValidInteger(id) ? id : 0,
                title: isValidString(input.title) ? input.title.trim() : "",
                titleLink: isValidString(input.titleLink)
                  ? input.titleLink.trim()
                  : "",
                name: isValidString(data.name) ? data.name.trim() : "",
                code: isValidString(data.code) ? data.code.trim() : "",
                link: isValidString(data.link) ? data.link.trim() : "",
                order: i + 1
              };
              if (
                data.originalFile &&
                !isEmptyObject(data.originalFile) &&
                isValidString(data.originalFile) &&
                data.originalFile != null &&
                data.originalFile != ""
              ) {
                var split_data = await data.originalFile.split(
                  Constants.AWSPATH
                );
                newSponsor.fileName = split_data[1];
                newSponsor.fileUrl = data.originalFile;
              } else {
                if (
                  inputFiles.sponsors &&
                  inputFiles.sponsors[count] &&
                  inputFiles.sponsors[count].originalFile
                ) {
                  var originalFileInput = {
                    file: inputFiles.sponsors[count].originalFile,
                    filePath: s3Routes.SPONSOR_ORIGINAL_IMAGE + id + "/"
                  };
                  count = count + 1;

                  var originalFile = await uploadFile(originalFileInput);
                  newSponsor.fileName = originalFile.key;
                  newSponsor.fileUrl = originalFile.Location;
                }
              }

              // Cropped file details
              if (
                data.file &&
                data.file != null &&
                !isEmptyObject(data.file) &&
                data.file != ""
              ) {
                if (data.file.length > 0) {
                  var split_data = data.file.split(Constants.AWSPATH);
                  newSponsor.croppedFileName = split_data[1];
                  newSponsor.croppedFileUrl = data.file;
                }
              } else {
                if (
                  data.file != null &&
                  data.file != undefined &&
                  isEmptyObject(data.file)
                ) {
                  if (
                    inputFiles.sponsors &&
                    inputFiles.sponsors[cropCount] &&
                    inputFiles.sponsors[cropCount].croppedFile &&
                    inputFiles.sponsors[cropCount].croppedFile != undefined &&
                    inputFiles.sponsors[cropCount].croppedFile != null
                  ) {
                    var croppedFileInput = {
                      file: inputFiles.sponsors[cropCount].croppedFile,
                      filePath: s3Routes.SPONSOR_CROPPED_IMAGE + id + "/"
                    };
                    cropCount = cropCount + 1;
                    var croppedFile = await uploadImage(croppedFileInput);
                    newSponsor.croppedFileName = croppedFile.croppedFileName;
                    newSponsor.croppedFileUrl = croppedFile.croppedFileUrl;
                  }
                }
              }

              output = await sponsors.create(newSponsor);
            }
          })
        );

        // Delete Original file from S3
        var originalURL = await sponsors.findAll({
          where: { userId: id },
          attributes: ["fileName"]
        });

        var originalImageArray = getOriginalData.filter(
          (e) =>
            !originalURL.find(
              (a) => e.dataValues.fileName == a.dataValues.fileName
            )
        );
        if (originalImageArray && originalImageArray.length > 0) {
          originalImageArray.forEach(async (element) => {
            var deleteImageParams = {
              key: element.dataValues.fileName
            };
            await deleteFileFromS3(deleteImageParams);
          });
        }

        // Delete Cropped file from S3
        var croppedURL = await sponsors.findAll({
          where: { userId: id },
          attributes: ["croppedFileName"]
        });

        var croppedImageArray = getCroppedData.filter(
          (e) =>
            !croppedURL.find(
              (a) =>
                e.dataValues.croppedFileName == a.dataValues.croppedFileName
            )
        );
        if (croppedImageArray && croppedImageArray.length > 0) {
          croppedImageArray.forEach(async (element) => {
            var deleteImageParams = {
              key: element.dataValues.croppedFileName
            };
            await deleteFileFromS3(deleteImageParams);
          });
        }
      }

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }
}

var uploadImage = (fileInput) => {
  return new Promise(async (resolve, reject) => {
    var data = await uploadFile(fileInput);
    var newSponsor = {};
    newSponsor.croppedFileName = data.key;
    newSponsor.croppedFileUrl = data.Location;
    resolve(newSponsor);
  });
};

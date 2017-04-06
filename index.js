var google = require("googleapis");

function gsuiteSpreadsheetManager(mainSpecs) {
    "use strict";
    var auth;
    var sheets = google.sheets("v4");

    function update(specs) {
        var spreadsheetId = specs.spreadsheetId;
        var range = specs.range;
        var values = specs.values;
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.update({
                auth: auth,
                spreadsheetId: spreadsheetId,
                range: range,
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: values
                }
            }, function (err) {
                if (err) {
                    reject("The Spreadsheet API returned an error: " + err);
                    return;
                }
                resolve();
                return;
            });
        });
    }

    function batchClear(specs) {
        var spreadsheetId = specs.spreadsheetId;
        var batchUpdateRequest;
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.batchClear({
                auth: auth,
                spreadsheetId: spreadsheetId,
                resource: {
                    "ranges": [
                        specs.ranges
                    ],
                }
            }, function (err, response) {
                if (err) {
                    reject("The Spreadsheet API returned an error: " + err);
                    return;
                }
                resolve(response);
                return;
            });
        });
    }

    function batchUpdate(specs) {
        var spreadsheetId = specs.spreadsheetId;
        var batchUpdateRequest = {
            ranges: specs.ranges
        };

        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.batchUpdate({
                auth: auth,
                spreadsheetId: spreadsheetId,
                resource: batchUpdateRequest
            }, function (err, response) {
                if (err) {
                    reject("The Spreadsheet API returned an error: " + err);
                    return;
                }
                resolve(response);
                return;
            });
        });
    }


    function get(specs) {
        var spreadsheetId = specs.spreadsheetId;
        var range = specs.range;
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId: spreadsheetId,
                range: range
            }, function (err, response) {
                if (err) {
                    reject("The Spreadsheet API returned an error: " + err);
                    return;
                }
                resolve(response);
                return;
            });
        });
    }

    auth = mainSpecs.auth;
    return {
        update: update,
        batchUpdate: batchUpdate,
        get: get,
        batchClear: batchClear
    };
}

module.exports = gsuiteSpreadsheetManager;
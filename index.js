var google = require("googleapis");

function gsuiteSpreadsheetManager(mainSpecs) {
    "use strict";
    var auth;
    var sheets = google.sheets("v4");

    function buildRequest(specs) {
        var request = {
            auth: auth
        };

        if (specs.fields) {
            request.fields = specs.fields;
        }

        if (specs.backoff) {
            request.backoff = request;
        }

        if (specs.q) {
            request.q = specs.q;
        }

        if (specs.pageToken) {
            request.pageToken = specs.pageToken;
        }

        return request;
    }

    function doRequest(specs, request, apiCall) {
        return function () {
            return new Promise(function (resolve, reject) {
                if (specs.throttle) {
                    return specs.throttle().then(function () {
                        apiCall(request, function (err, response) {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(response);
                        });
                    });
                }
                return apiCall(request, function (err, response) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(response);
                });
            });
        };
    }

    function update(specs) {
        var request = buildRequest(specs);
        var apiCall = sheets.spreadsheets.values.update;

        request.spreadsheetId = specs.spreadsheetId;
        request.range = specs.range;
        request.valueInputOption = "USER_ENTERED";
        request.resource = {
            values: specs.values
        };

        if (specs.backoff !== undefined) {
            return specs.backoff({
                promise: doRequest(specs, request, apiCall)
            });
        }
        return doRequest(specs, request, apiCall)();
    }

    function append(specs) {
        var request = buildRequest(specs);
        var apiCall = sheets.spreadsheets.values.append;

        request.spreadsheetId = specs.spreadsheetId;
        request.range = specs.range;
        request.valueInputOption = "USER_ENTERED";
        request.resource = {
            values: specs.values
        };
        if (specs.backoff !== undefined) {
            return specs.backoff({
                promise: doRequest(specs, request, apiCall)
            });
        }
        return doRequest(specs, request, apiCall)();
    }

    function batchClear(specs) {
        var request = buildRequest(specs);
        var apiCall = sheets.spreadsheets.values.batchClear;
        request.spreadsheetId = specs.spreadsheetId;
        request.resource = {
            "ranges": [
                specs.ranges
            ]
        };

        if (specs.backoff !== undefined) {
            return specs.backoff({
                promise: doRequest(specs, request, apiCall)
            });
        }
        return doRequest(specs, request, apiCall)();
    }

    function batchUpdate(specs) {
        var request = buildRequest(specs);
        var apiCall = sheets.spreadsheets.values.batchUpdate;

        request.spreadsheetId = specs.spreadsheetId;
        request.resource = {
            ranges: specs.ranges
        };

        if (specs.backoff !== undefined) {
            return specs.backoff({
                promise: doRequest(specs, request, apiCall)
            });
        }
        return doRequest(specs, request, apiCall)();
    }

    function get(specs) {
        var request = buildRequest(specs);
        var apiCall = sheets.spreadsheets.values.get;

        request.spreadsheetId = specs.spreadsheetId;
        request.range = specs.range;

        if (specs.backoff !== undefined) {
            return specs.backoff({
                promise: doRequest(specs, request, apiCall)
            });
        }
        return doRequest(specs, request, apiCall)();
    }

    auth = mainSpecs.auth;
    return {
        update: update,
        batchUpdate: batchUpdate,
        get: get,
        batchClear: batchClear,
        append: append
    };
}

module.exports = gsuiteSpreadsheetManager;
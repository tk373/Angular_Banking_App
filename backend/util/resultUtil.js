function createResult(data, statusCode) {
    return {
        statusCode: !isNaN(statusCode) ? statusCode : 200,
        data
    };
}

function createErrorResult(data, statusCode) {
    return {
        statusCode: !isNaN(statusCode) ? statusCode : 400,
        data
    };
}

function createNotFoundResult(data, statusCode) {
    return {
        statusCode: !isNaN(statusCode) ? statusCode : 404,
        data
    };
}

export const resultUtil = {createResult, createErrorResult, createNotFoundResult};



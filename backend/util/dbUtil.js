/**
 * Converts the given nedb call into a promise which can be used for async/await based calls.
 * @param dbCall Call to be executed within the db.
 * @returns {Promise<any>} Returns the db call as promise. The resulting object is the queried object.
 */
export function toQuery(dbCall) {
    return new Promise((resolve, reject) => {
        dbCall((err, docs) => {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
}

/**
 * Converts the given nedb call into a promise which can be used for async/await based calls.
 * @param dbCall Call to be executed within the db.
 * @returns {Promise<any>} Returns the db call as promise. The resulting object is the queried object/s and a count.
 */
export function toCountedQuery(dbCall) {
    return new Promise((resolve, reject) => {
        dbCall((err, count, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve({count, doc});
            }
        });
    });
}
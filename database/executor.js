const connection = require(`./connection`);

module.exports = {
    executeQuery: async queries => {
        try{
            let con = await connection.getConnection();
            const execute = query => {
                return new Promise((resolve, reject) => {
                    con.query(query, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
            }
            try{
                const promises = queries.map(query => execute(query))
                const result = await Promise.all(promises)
                con.release();
                return result;
            }catch(err){
                con.release();
                throw err;
            }
        }catch(err){
            throw err;
        }
    }
}
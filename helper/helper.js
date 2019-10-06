
const mysql = require(`../database/executor`);

const getSlugInfo = async(comment_id) => {
    try{
        let query = [`SELECT slug, full_slug FROM comments WHERE id=${comment_id}`];
        const result = await mysql.executeQuery(query);
        if (result && result.length && result[0].length) {
            return result[0][0];
        }
        return false;
    }catch(error){
        throw error
    }
}

module.exports = {
    getSlugInfo
}
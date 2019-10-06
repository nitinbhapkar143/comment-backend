const express = require(`express`);
const router = express.Router();
const mysql = require(`../database/executor`);
const randomstring = require("randomstring");
const moment = require("moment");
const helper = require("../helper/helper")
const middleware = require(`../middleware/middleware`);

router.post(`/comment`, middleware.authentication(), async (req, res) => {
    try {
        const {user_id} = req.user;
        const comment = req.body;
        if (!comment.text) {
            return res.json({
                status: false,
                message: `Comment text can not be empty.`
            })
        }
        let slug = randomstring.generate(4);
        let full_slug = `${moment().format(`YYYYMMDDHHMMSS`)}:${slug}`;
        if(comment.parent_id){
            const slug_info = await helper.getSlugInfo(comment.parent_id);
            if(!slug_info) return res.json({
                status: true,
                message: `No Comment found with given id.`
            })
            slug = `${slug_info.slug}/${slug}`;
            full_slug = `${slug_info.full_slug}/${full_slug}`;
        }
        if (full_slug.length > 512) return res.json({
            status: true,
            message: `Maximum nesting level reached.`
        })
        const query = [`INSERT INTO comments(user_id, post_id, parent_id, slug, full_slug, text, posted) VALUES(${user_id},${comment.post_id},${comment.parent_id ? comment.parent_id : 'NULL'},'${slug}','${full_slug}','${comment.text}','${moment().format(`YYYY-MM-DD HH:mm:ss`)}')`];
        const result = await mysql.executeQuery(query);
        if (result && result.length && result[0].affectedRows) {
            return res.json({
                status: true,
                comment : {
                    id : result[0].insertId,
                    post_id : comment.post_id,
                    user_id : user_id,
                    parent_id : comment.parent_id,
                    username : req.user.username,
                    slug : slug,
                    full_slug : full_slug,
                    text : comment.text,
                    posted : moment().format(`YYYY-MM-DD HH:mm:ss`)
                },
                message: `Comment added successfully.`
            })
        }
        return res.json({
            status: false,
            message: `Failed to add cooment.`
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            message: `Something went wrong. Try Later.`
        })
    }
});

router.put(`/comment`, middleware.authentication(), async (req, res) => {
    try {
        const {user_id} = req.user;
        const comment = req.body;
        if (!comment.id) {
            return res.json({
                status: false,
                message: `Comment id can not be empty.`
            })
        }
        if (!comment.text) {
            return res.json({
                status: false,
                message: `Comment text can not be empty.`
            })
        }

        let query = [`SELECT user_id FROM comments WHERE id=${comment.id}`];
        let result = await mysql.executeQuery(query);
        if (!result || !result.length || !result[0].length) {
            return res.json({
                status: false,
                message: `Comment does not exists.`
            })
        }
        if (result[0][0].user_id != user_id) {
            return res.json({
                status: false,
                message: `Can not modify comments of other users.`
            })
        }
        query = [`UPDATE comments SET text ='${comment.text}' WHERE id=${comment.id}`];
        result = await mysql.executeQuery(query);
        return res.json({
            status: true,
            message: `Comment updated successfully.`
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            message: `Something went wrong. Try Later.`
        })
    }
});

router.get(`/comment`, middleware.authentication(), async (req, res) => {
    try {
        let params = req.query;
        if(!params.post_id){
            return res.json({
                status: false,
                comments: [],
                message: `Missing post_id.`
            })
        }
        params.offset = params.offset ? params.offset : 0;
        params.limit = params.limit ? params.limit : 1844674407370955161;
        const query = [`SELECT c.*, u.username FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE post_id=${params.post_id} ORDER BY full_slug LIMIT ${params.limit} OFFSET ${params.offset}`];
        const result = await mysql.executeQuery(query);
        let comments = [];
        if (result && result.length && result[0].length) comments = result[0];
        return res.json({
            status: true,
            comments: comments
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            comments: [],
            message: `Something went wrong. Try Later.`
        })
    }
});

module.exports = router;
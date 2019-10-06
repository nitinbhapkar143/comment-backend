const express = require(`express`);
const router = express.Router();
const mysql = require(`../database/executor`);
const moment = require("moment");
const middleware = require(`../middleware/middleware`);

router.post(`/post`, middleware.authentication(), async (req, res) => {
    try {
        const {user_id} = req.user;
        const post = req.body;
        if (!post.text) {
            return res.json({
                status: false,
                message: `Post can not be empty.`
            })
        }
        const query = [`INSERT INTO post(user_id, text, posted) VALUES(${user_id},'${post.text}','${moment().format(`YYYY-MM-DD HH:mm:ss`)}')`];
        const result = await mysql.executeQuery(query);
        if (result && result.length && result[0].affectedRows) {
            return res.json({
                status: true,
                post : {
                    id : result[0].insertId,
                    user_id : user_id,
                    text : post.text,
                    posted : moment().format(`YYYY-MM-DD HH:mm:ss`),
                    username : req.user.username
                },
                message: `Post added successfully.`
            })
        }
        return res.json({
            status: false,
            message: `Failed to add post.`
        })
    } catch (err) {
        console.log(err);
        return res.json({
            status: false,
            message: `Something went wrong. Try Later.`
        })
    }
});

router.put(`/post`, middleware.authentication(), async (req, res) => {
    try {
        const {user_id} = req.user;
        const post = req.body;
        if (!post.id) {
            return res.json({
                status: false,
                message: `Post id can not be empty.`
            })
        }
        if (!post.text) {
            return res.json({
                status: false,
                message: `Post text can not be empty.`
            })
        }
        let query = [`SELECT user_id FROM post WHERE id=${post.id}`];
        let result = await mysql.executeQuery(query);
        if (!result || !result.length || !result[0].length) {
            return res.json({
                status: false,
                message: `Post does not exists.`
            })
        }
        if (result[0][0].user_id != user_id) {
            return res.json({
                status: false,
                message: `Can not modify posts of other users.`
            })
        }
        query = [`UPDATE post SET text ='${post.text}' WHERE id=${post.id}`];
        result = await mysql.executeQuery(query);
        return res.json({
            status: true,
            message: `Post updated successfully.`
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            message: `Something went wrong. Try Later.`
        })
    }
});

router.get(`/post`, middleware.authentication(), async (req, res) => {
    try {
        let params = req.query;
        params.offset = params.offset ? params.offset : 0;
        params.limit = params.limit ? params.limit : 1844674407370955161;
        const query = [`SELECT p.*, u.username FROM post p INNER JOIN users u ON p.user_id = u.id WHERE ${ params.post_id ? 'p.id=' + params.post_id : 1 } ORDER BY posted DESC LIMIT ${params.limit} OFFSET ${params.offset} `];
        const result = await mysql.executeQuery(query);
        let posts = []
        if (result && result.length && result[0].length) posts = result[0];
        return res.json({
            status: true,
            posts: posts
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            posts: [],
            message: `Something went wrong. Try Later.`
        })
    }
});

module.exports = router;
const express = require(`express`);
const hash = require('bcryptjs');
const jwt = require("jsonwebtoken");
const moment = require("moment");
const middleware = require(`../middleware/middleware`);
const mysql = require(`../database/executor`);

let router = express.Router();

router.post(`/user`, async (req, res) => {
    try {
        const user = req.body;
        if (!user.username) {
            return res.json({
                status: false,
                message: `Username can not be empty.`
            })
        }
        if (!user.password) {
            return res.json({
                status: false,
                message: `Password can not be empty.`
            })
        }
        let query = [`SELECT id, username, password FROM users WHERE username='${user.username}'`];
        let result = await mysql.executeQuery(query);
        if (!result || !result.length || !result[0].length) {
            const salt = await hash.genSalt(10);
            const hashed = await hash.hash(user.password, salt)
            query = [`INSERT INTO users(username, password, avatar, created) VALUES('${user.username}','${hashed}',${user.avatar ? "'" + user.avatar + "'" : 'NULL'},'${moment().format(`YYYY-MM-DD HH:mm:ss`)}')`];
            try {
                const result = await mysql.executeQuery(query);
                if (!result || !result.length || !result[0].affectedRows) {
                    return res.json({
                        status: false,
                        message: `Failed to create user.`
                    })
                }
                const token = jwt.sign({
                    username: user.username,
                    user_id: result[0].insertId
                }, process.env.JWT_SECRET);
                return res.json({
                    status: true,
                    token: token,
                    user: {
                        username: user.username,
                        user_id: result[0].insertId
                    }
                })
            } catch (err) {
                console.log(err)
                return res.json({
                    status: false,
                    message: `Failed to create user.`
                })
            }
        }
        const match = await hash.compare(user.password, result[0][0].password);
        if (!match) {
            return res.json({
                status: false,
                message: `Incorrect username or password.`
            })
        }
        const token = jwt.sign({
            username: user.username,
            user_id: result[0][0].id
        }, process.env.JWT_SECRET);
        return res.json({
            status: true,
            token: token,
            user: {
                username: user.username,
                user_id: result[0][0].id
            }
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            message: `Something went wrong. Try Later.`
        })
    }
});

router.get(`/user`, middleware.authentication(), async (req, res) => {
    try {
        const {user_id} = req.user;
        let query = [`SELECT id user_id, username FROM users WHERE id='${user_id}'`];
        let result = await mysql.executeQuery(query);
        if (!result || !result.length || !result[0].length) {
            return res.json({
                status: true,
                user: {}
            })
        }
        return res.json({
            status: true,
            user: result[0][0]
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: false,
            message: `Something went wrong. Try Later.`
        })
    }
});

module.exports = router;
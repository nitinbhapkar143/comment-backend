// CREATE TABLE `test`.`comments` ( `id` INT(11) NOT NULL AUTO_INCREMENT , `user_id` INT(11) NOT NULL , `post_id` INT NOT NULL , `parent_id` INT NULL DEFAULT NULL , `slug` VARCHAR(256) NOT NULL , `full_slug` VARCHAR(512) NOT NULL , `text` TEXT NOT NULL , `posted` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;
// CREATE TABLE `test`. ( `id` INT(11) NOT NULL AUTO_INCREMENT , `name` VARCHAR(50) NOT NULL , `avatar` VARCHAR(256) NULL DEFAULT NULL , `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;
// CREATE TABLE `test`.`post` ( `id` INT(11) NOT NULL AUTO_INCREMENT , `user_id` INT(11) NOT NULL , `text` TEXT NOT NULL , `posted` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;

module.exports = {
    connection: {
        connectionLimit: 30,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB,
        debug: false
    }
};

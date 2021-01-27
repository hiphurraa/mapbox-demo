DROP SCHEMA IF EXISTS `mapmarker` ;
CREATE SCHEMA IF NOT EXISTS `mapmarker` DEFAULT CHARACTER SET latin1 ;
USE `mapmarker` ;

DROP TABLE IF EXISTS `mapmarker`.`marker` ;

CREATE TABLE IF NOT EXISTS `mapmarker`.`marker` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `latitude` VARCHAR(30) NULL,
  `longitude` VARCHAR(30) NULL,
  `title` VARCHAR(25) NULL,
  `description` VARCHAR(200) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

INSERT INTO mapmarker.marker (latitude, longitude, title, description)
VALUES ("62.896005", "27.681000", "Hurja Solutions Oy", "Hurjan hyvä ohjelmistoyritys!");

INSERT INTO mapmarker.marker (latitude, longitude, title, description)
VALUES ("62.895379", "27.657227", "Tomi Heikkala", "Hurjan motivoitunut työntekijä!");

INSERT INTO mapmarker.marker (latitude, longitude, title, description)
VALUES ("62.878554", "27.710746", "Esimerkkimerkki", "Tässäpä tämmönen esimerkkimerkki jossa on oikein pitkä kuvaus, jotta nähdään, miten sivusto händlää tämmöiset vähän pidemmät kuvaukset. Tietokannassa on kuvaukselle rajoitus 200 merkkiä.");

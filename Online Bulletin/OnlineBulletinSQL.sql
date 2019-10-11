-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema OnlineBulletin
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema OnlineBulletin
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `OnlineBulletin` DEFAULT CHARACTER SET utf8 ;
USE `OnlineBulletin` ;

-- -----------------------------------------------------
-- Table `OnlineBulletin`.`bbusers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `OnlineBulletin`.`bbusers` (
  `email` VARCHAR(50) NOT NULL,
  `name` VARCHAR(30) NULL,
  `password` VARCHAR(10) NULL,
  `nickname` VARCHAR(30) NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `OnlineBulletin`.`postings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `OnlineBulletin`.`postings` (
  `postId` INT(5) NOT NULL AUTO_INCREMENT,
  `postDate` DATETIME NULL,
  `postedBy` VARCHAR(50) NULL,
  `postSubject` VARCHAR(100) NULL,
  `content` VARCHAR(512) NULL,
  `ancestorPath` VARCHAR(100) NULL,
  PRIMARY KEY (`postId`),
  INDEX `fk_postings_bbusers_idx` (`postedBy` ASC),
  CONSTRAINT `fk_postings_bbusers`
    FOREIGN KEY (`postedBy`)
    REFERENCES `OnlineBulletin`.`bbusers` (`email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

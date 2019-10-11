-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 14, 2018 at 04:11 AM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `onlinebulletin`
--

-- --------------------------------------------------------

--
-- Table structure for table `bbusers`
--

DROP TABLE IF EXISTS `bbusers`;
CREATE TABLE IF NOT EXISTS `bbusers` (
  `email` varchar(50) NOT NULL,
  `name` varchar(30) NOT NULL,
  `password` varchar(10) NOT NULL,
  `nickname` varchar(30) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bbusers`
--

INSERT INTO `bbusers` (`email`, `name`, `password`, `nickname`) VALUES
('bob@bob.com', 'Bob', 'bob', 'Bobby'),
('orange@orange.com', 'Orange', 'orange', 'OrangeFruit'),
('test@test.com', 'test', 'test', 'tester');

-- --------------------------------------------------------

--
-- Table structure for table `postings`
--

DROP TABLE IF EXISTS `postings`;
CREATE TABLE IF NOT EXISTS `postings` (
  `postId` int(5) NOT NULL AUTO_INCREMENT,
  `postDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `postedBy` varchar(50) NOT NULL,
  `postSubject` varchar(100) NOT NULL,
  `content` varchar(512) NOT NULL,
  `ancestorPath` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`postId`),
  KEY `fk_postings_bbusers_idx` (`postedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `postings`
--

INSERT INTO `postings` (`postId`, `postDate`, `postedBy`, `postSubject`, `content`, `ancestorPath`) VALUES
(65, '2018-12-14 01:28:09', 'test@test.com', 'Test', 'content', NULL),
(66, '2018-12-14 01:28:40', 'test@test.com', 'Reply Test', 'Reply Content', '65'),
(67, '2018-12-14 01:30:04', 'test@test.com', '2nd Reply', 'reply test2', '66'),
(68, '2018-12-14 01:31:00', 'test@test.com', '2nd Reply', 'reply test2', '67'),
(69, '2018-12-14 01:56:45', 'orange@orange.com', 'Orangetest', 'Orangejuice', NULL),
(70, '2018-12-14 02:30:24', 'orange@orange.com', 'Parent', 'Pcontents', NULL),
(71, '2018-12-14 02:38:44', 'orange@orange.com', 'Child', 'Child70content', '70');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `postings`
--
ALTER TABLE `postings`
  ADD CONSTRAINT `fk_postings_bbusers` FOREIGN KEY (`postedBy`) REFERENCES `bbusers` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

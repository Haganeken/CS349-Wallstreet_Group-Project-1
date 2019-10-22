SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `DogDate`
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

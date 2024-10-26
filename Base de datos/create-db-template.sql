CREATE DATABASE MANZANAS_DEL_CUIDADO;

USE MANZANAS_DEL_CUIDADO;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE `manzanas` (
  `id_manzana` int(5) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(30) DEFAULT NULL,
  `Localidad` varchar(30) DEFAULT NULL,
  `Direccion_manzana` text DEFAULT NULL,
  PRIMARY KEY (`id_manzana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `servicios` (
  `id_servicio` int(5) NOT NULL AUTO_INCREMENT,
  `Nombre_servicio` varchar(30) DEFAULT NULL,
  `Tipo_servicio` varchar(30) DEFAULT NULL,
  `Descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `manzanas_servicios` (
  `fk_id_manzana` int(5) DEFAULT NULL,
  `fk_id_servicio` int(5) DEFAULT NULL,
  KEY `fk_1` (`fk_id_manzana`),
  KEY `fk_2` (`fk_id_servicio`),
  CONSTRAINT `fk_1` FOREIGN KEY (`fk_id_manzana`) REFERENCES `manzanas` (`id_manzana`),
  CONSTRAINT `fk_2` FOREIGN KEY (`fk_id_servicio`) REFERENCES `servicios` (`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `solicitudes` (
  `id_solicitud` int(5) NOT NULL AUTO_INCREMENT,
  `Municipios` varchar(30) DEFAULT NULL,
  `Fecha_asistencia` date DEFAULT NULL,
  `Nombre_establecimiento` varchar(50) DEFAULT NULL,
  `Responsable_establecimiento` varchar(30) DEFAULT NULL,
  `Direccion_establecimiento` text DEFAULT NULL,
  `fk_id_servicio` int(5) DEFAULT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `fk_5` (`fk_id_servicio`),
  CONSTRAINT `fk_5` FOREIGN KEY (`fk_id_servicio`) REFERENCES `servicios` (`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuario` (
  `id_mujer` int(5) NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(30) DEFAULT NULL,
  `Documento` varchar(10) DEFAULT NULL,
  `Nombres` varchar(30) DEFAULT NULL,
  `Apellidos` varchar(30) DEFAULT NULL,
  `Telefono` varchar(10) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Ciudad` varchar(30) DEFAULT NULL,
  `Direccion_mujer` text DEFAULT NULL,
  `Ocupacion` varchar(30) DEFAULT NULL,
  `fk_id_manzana` int(5) DEFAULT NULL,
  PRIMARY KEY (`id_mujer`),
  KEY `fk_3` (`fk_id_manzana`),
  CONSTRAINT `fk_3` FOREIGN KEY (`fk_id_manzana`) REFERENCES `manzanas` (`id_manzana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


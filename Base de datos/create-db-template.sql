-- SQLBook: Code
CREATE DATABASE MANZANAS_DEL_CUIDADO;

USE MANZANAS_DEL_CUIDADO;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE manzanas (
  Id_M int(5)  PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Nombre varchar(30) DEFAULT NULL,
  Localidad varchar(30) DEFAULT NULL,
  Direccion_manzana VARCHAR(30) DEFAULT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO manzanas (Id_M, Nombre, Localidad, Direccion_manzana) 
VALUES
( 1, 'Bosa' ,'Bosa', 'direccion 1'),
( 2, 'Suba' ,'Suba', 'direccion 2'),
( 3, 'Chapinero' ,'Chapinero', 'direccion 3')


CREATE TABLE servicios (
  id_servicio int(5) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Nombre_servicio varchar(30) DEFAULT NULL,
  Tipo_servicio varchar(30) DEFAULT NULL,
  Descripcion varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO servicios (id_servicio, Nombre_Servicio, Tipo_servicio, Descripcion) 
VALUES 
(3, 'estudiar', 'estudia', 'adquirir conocimiento'),
(4, 'aprender' , 'aprender', 'adquirir conocimiento'),
(5, 'emplearse', 'trabajo', 'conseguir trabajo' ),
(6, 'descansar', 'oseo', 'tiempo de relajo' ),
(7, 'ejercitarse', 'salud', 'ponerse mamado' ),
(8, 'asesoria juridica', 'juridica', 'recibir consejos juridicos'),
(9, 'asesoria pscologica', 'psicologia', 'recibir consejos psicologicos' ),
(10, 'lavar ropa', 'aseo', 'tener sus prendas limpias')


CREATE TABLE manzanas_servicios (
  Id_M2 int(5) DEFAULT NULL,
  fk_id_servicio int(5) DEFAULT NULL,
  FOREIGN KEY (Id_M2) REFERENCES manzanas (Id_M), 
  FOREIGN KEY (fk_id_servicio) REFERENCES servicios (id_servicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO manzanas_servicios (Id_M2, fk_id_servicio) 
VALUES 
(1,3),
(1,4),
(1,5),
(1,6),
(2,10),
(2,9),
(2,8),
(2,7),
(3,3),
(3,5),
(3,6),
(3,8)


CREATE TABLE solicitudes (
  id_solicitud int(5) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Municipios varchar(30) DEFAULT NULL,
  Nombre_establecimiento varchar(50) DEFAULT NULL,
  Responsable_establecimiento varchar(30) DEFAULT NULL,
  Direccion_establecimiento text DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE usuario (
  id_mujer int(5) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Tipo varchar(30) DEFAULT NULL,
  Documento varchar(10) DEFAULT NULL,
  Nombre varchar(30) DEFAULT NULL,
  Apellidos varchar(30) DEFAULT NULL,
  Telefono varchar(10) DEFAULT NULL,
  Email varchar(50) DEFAULT NULL,
  Ciudad varchar(30) DEFAULT NULL,
  Direccion_mujer text DEFAULT NULL,
  Ocupacion varchar(30) DEFAULT NULL,
  Id_M1 int(5) DEFAULT NULL,
  FOREIGN KEY (Id_M1) REFERENCES manzanas (Id_M),
  fk_id_solicitud INT(5) DEFAULT NULL,
  FOREIGN KEY (fk_id_solicitud) REFERENCES solicitudes (id_solicitud)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE usuario_servicios (
  id_mujer1 INT(5) DEFAULT NULL,
  FOREIGN KEY (id_mujer1) REFERENCES usuario (id_mujer),
  id_servicio1 INT(5) DEFAULT NULL,
  FOREIGN KEY (id_servicio1) REFERENCES servicios (id_servicio),
  Fecha_asistencia date DEFAULT NULL
)

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
 

SELECT * FROM manzanas 

SELECT * FROM usuario

SELECT * FROM servicios

SELECT * FROM manzanas_servicios

SELECT * FROM solicitudes

/* nombre de de la manzana segun nombre */
SELECT manzanas.Nombre FROM usuario INNER JOIN manzanas ON usuario.id_mujer = manzanas.Id_M WHERE usuario.Nombre="juan david"


/* //consulta para obtener el nombre de los servicios asociados a la manzana del usuario mediante el documeento o el nombre */
SELECT ser.Nombre_servicio, ser.Descripcion
FROM servicios ser
JOIN manzanas_servicios ms ON ser.id_servicio = ms.fk_id_servicio
JOIN manzanas m ON ms.Id_M2 = m.Id_M 
JOIN usuario us ON us.id_M1 = m.Id_M
WHERE Documento = 1111

/* consulta para obtener nombre de servicio, fecha y id de solicitud */
INSERT INTO usuario_servicios (id_servicio1, Fecha_asistencia) VALUES (?,?)


SELECT * FROM usuario_servicios

 
 





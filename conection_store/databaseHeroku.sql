-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema heroku_821c5571286d89b
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema heroku_821c5571286d89b
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `heroku_821c5571286d89b` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `heroku_821c5571286d89b` ;

-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`doctores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`doctores` (
  `idDoctor` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(70) NOT NULL,
  `status` TINYINT NOT NULL DEFAULT '1',
  PRIMARY KEY (`idDoctor`),
  UNIQUE INDEX `idDoctor_UNIQUE` (`idDoctor` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB
AUTO_INCREMENT = 85
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`pacientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`pacientes` (
  `idPaciente` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `escolaridad` TINYINT NOT NULL,
  `fechaNacimiento` TIMESTAMP NOT NULL,
  `sexo` TINYINT NOT NULL,
  `status` TINYINT NOT NULL DEFAULT '1',
  `idDoctor` INT NOT NULL,
  PRIMARY KEY (`idPaciente`),
  UNIQUE INDEX `idPaciente_UNIQUE` (`idPaciente` ASC) ,
  INDEX `idDoctor_idx` (`idDoctor` ASC) ,
  CONSTRAINT `idDoctor`
    FOREIGN KEY (`idDoctor`)
    REFERENCES `heroku_821c5571286d89b`.`doctores` (`idDoctor`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 53
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`consultas_geriatricas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`consultas_geriatricas` (
  `idConsulta` INT NOT NULL AUTO_INCREMENT,
  `fechaConsulta` TIMESTAMP NOT NULL,
  `consultaTerminada` TINYINT NOT NULL DEFAULT '0',
  `idPaciente` INT NOT NULL,
  `idDoctor` INT NOT NULL,
  PRIMARY KEY (`idConsulta`),
  UNIQUE INDEX `idConsulta_UNIQUE` (`idConsulta` ASC) ,
  INDEX `idPaciente_idx` (`idPaciente` ASC) ,
  INDEX `idDoctor_idx` (`idDoctor` ASC) ,
  INDEX `idDoctorConsulta_idx` (`idPaciente` ASC, `idDoctor` ASC) ,
  INDEX `idPacienteConsulta_idx` (`idPaciente` ASC) ,
  CONSTRAINT `idDoctorConsulta`
    FOREIGN KEY (`idDoctor`)
    REFERENCES `heroku_821c5571286d89b`.`doctores` (`idDoctor`)
    ON DELETE CASCADE,
  CONSTRAINT `idPacienteConsulta`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `heroku_821c5571286d89b`.`pacientes` (`idPaciente`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 493
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`cuidadores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`cuidadores` (
  `idCuidador` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`idCuidador`),
  UNIQUE INDEX `idCuidador_UNIQUE` (`idCuidador` ASC) ,
  UNIQUE INDEX `telefono_UNIQUE` (`telefono` ASC) )
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`examenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`examenes` (
  `idExamen` INT NOT NULL AUTO_INCREMENT,
  `nombreExamen` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idExamen`),
  UNIQUE INDEX `idExamen_UNIQUE` (`idExamen` ASC) ,
  UNIQUE INDEX `nombreExamen_UNIQUE` (`nombreExamen` ASC) )
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`examenes_realizados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`examenes_realizados` (
  `idConsulta` INT NOT NULL,
  `idExamen` INT NOT NULL,
  `notas` TEXT NULL DEFAULT NULL,
  INDEX `idConsultaExamenRealizado_idx` (`idConsulta` ASC) ,
  INDEX `idExamenExamenRealizado_idx` (`idExamen` ASC) ,
  CONSTRAINT `idConsultaExamenRealizado`
    FOREIGN KEY (`idConsulta`)
    REFERENCES `heroku_821c5571286d89b`.`consultas_geriatricas` (`idConsulta`)
    ON DELETE CASCADE,
  CONSTRAINT `idExamenExamenRealizado`
    FOREIGN KEY (`idExamen`)
    REFERENCES `heroku_821c5571286d89b`.`examenes` (`idExamen`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`secciones_examenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`secciones_examenes` (
  `idSeccionExamen` INT NOT NULL AUTO_INCREMENT,
  `nombreSeccion` VARCHAR(45) NOT NULL,
  `idExamen` INT NOT NULL,
  PRIMARY KEY (`idSeccionExamen`),
  UNIQUE INDEX `idSeccionExamen_UNIQUE` (`idSeccionExamen` ASC) ,
  INDEX `idExamen_idx` (`idExamen` ASC) ,
  CONSTRAINT `idExamen`
    FOREIGN KEY (`idExamen`)
    REFERENCES `heroku_821c5571286d89b`.`examenes` (`idExamen`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`preguntas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`preguntas` (
  `idPregunta` INT NOT NULL AUTO_INCREMENT,
  `pregunta` MEDIUMTEXT NOT NULL,
  `puntajeMaximo` TINYINT NOT NULL,
  `idSeccionExamen` INT NOT NULL,
  PRIMARY KEY (`idPregunta`),
  UNIQUE INDEX `idPregunta_UNIQUE` (`idPregunta` ASC) ,
  INDEX `idSeccionExamen_idx` (`idSeccionExamen` ASC) ,
  CONSTRAINT `idSeccionExamen`
    FOREIGN KEY (`idSeccionExamen`)
    REFERENCES `heroku_821c5571286d89b`.`secciones_examenes` (`idSeccionExamen`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`respuestas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`respuestas` (
  `idRespuesta` INT NOT NULL AUTO_INCREMENT,
  `idConsulta` INT NOT NULL,
  `idPregunta` INT NOT NULL,
  `respuesta` TEXT NOT NULL,
  `puntaje` TINYINT NOT NULL,
  PRIMARY KEY (`idRespuesta`),
  UNIQUE INDEX `idRespuesta_UNIQUE` (`idRespuesta` ASC) ,
  INDEX `idConsultaRespuesta_idx` (`idConsulta` ASC) ,
  INDEX `idPreguntaRespuesta_idx` (`idPregunta` ASC) ,
  CONSTRAINT `idConsultaRespuesta`
    FOREIGN KEY (`idConsulta`)
    REFERENCES `heroku_821c5571286d89b`.`consultas_geriatricas` (`idConsulta`)
    ON DELETE CASCADE,
  CONSTRAINT `idPreguntaRespuesta`
    FOREIGN KEY (`idPregunta`)
    REFERENCES `heroku_821c5571286d89b`.`preguntas` (`idPregunta`))
ENGINE = InnoDB
AUTO_INCREMENT = 2176
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`respuestas_imagenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`respuestas_imagenes` (
  `idRespuestaImagen` INT NOT NULL,
  `imagen` LONGTEXT NULL DEFAULT NULL,
  UNIQUE INDEX `idRespuestas_UNIQUE` (`idRespuestaImagen` ASC),
  CONSTRAINT `idRespuestaImagen`
    FOREIGN KEY (`idRespuestaImagen`)
    REFERENCES `heroku_821c5571286d89b`.`respuestas` (`idRespuesta`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `heroku_821c5571286d89b`.`tiene`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_821c5571286d89b`.`tiene` (
  `idCuidador` INT NOT NULL,
  `idPaciente` INT NOT NULL,
  UNIQUE INDEX `idPaciente_UNIQUE` (`idPaciente` ASC) ,
  INDEX `idCuidador_idx` (`idCuidador` ASC) ,
  INDEX `idPaciente_idx` (`idPaciente` ASC) ,
  CONSTRAINT `idCuidador`
    FOREIGN KEY (`idCuidador`)
    REFERENCES `heroku_821c5571286d89b`.`cuidadores` (`idCuidador`),
  CONSTRAINT `idPaciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `heroku_821c5571286d89b`.`pacientes` (`idPaciente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

USE `heroku_821c5571286d89b` ;

-- -----------------------------------------------------
-- procedure spCreateNewAnswer
-- -----------------------------------------------------

DELIMITER $$
USE `heroku_821c5571286d89b`$$
CREATE DEFINER=`b1b4ab1784c1a8`@`us-cdbr-east-05.cleardb.net` PROCEDURE `spCreateNewAnswer`(
	_idConsulta INT,
    _idPregunta INT,
    _respuesta LONGTEXT,
    _puntaje TINYINT,
    _imagen TINYINT
)
BEGIN
	IF _imagen = 1 THEN
		INSERT INTO respuestas (idConsulta, idPregunta, respuesta, puntaje)
        VALUES (_idConsulta, _idPregunta, "imagen", _puntaje);
        
		INSERT INTO respuestas_imagenes (idRespuestaImagen, imagen)
        VALUES ((SELECT MAX(idRespuesta)  AS idRespuesta FROM respuestas), _respuesta);
	ELSE
		INSERT INTO respuestas (idConsulta, idPregunta, respuesta, puntaje)
        VALUES (_idConsulta, _idPregunta, _respuesta, _puntaje);
    END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure spCreateNewConsult
-- -----------------------------------------------------

DELIMITER $$
USE `heroku_821c5571286d89b`$$
CREATE DEFINER=`b1b4ab1784c1a8`@`us-cdbr-east-05.cleardb.net` PROCEDURE `spCreateNewConsult`(
	_fecha_consulta timestamp,
    _id_paciente INT,
	_id_doctor INT
)
BEGIN
		IF(SELECT COUNT(idConsulta) AS repetido 
			FROM consultas_geriatricas
			WHERE fechaConsulta = _fecha_consulta AND idPaciente =_id_paciente AND idDoctor = _id_doctor) >= 1 THEN
			SELECT COUNT(idConsulta) AS repetido FROM consultas_geriatricas;
        ELSE
			INSERT INTO consultas_geriatricas(fechaConsulta, idPaciente, idDoctor)
			VALUES (_fecha_consulta, _id_paciente, _id_doctor);
			
			SELECT MAX(idConsulta)  AS idConsulta FROM consultas_geriatricas;
        END IF;
		
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure spExamnDone
-- -----------------------------------------------------

DELIMITER $$
USE `heroku_821c5571286d89b`$$
CREATE DEFINER=`b1b4ab1784c1a8`@`us-cdbr-east-05.cleardb.net` PROCEDURE `spExamnDone`(
    _id_Consulta INT,
    _id_Examen INT,
    _notas TEXT
)
BEGIN
		IF(SELECT COUNT(idConsulta) AS repetido 
			FROM examenes_realizados
			WHERE idConsulta =_id_Consulta 
            AND idExamen = _id_Examen) 
            >= 1 THEN
			SELECT COUNT(idConsulta) AS repetido 
			FROM examenes_realizados
			WHERE idConsulta =_id_Consulta 
            AND idExamen = _id_Examen;
        ELSE
			INSERT INTO examenes_realizados(idConsulta, idExamen, notas)
			VALUES (_id_Consulta, _id_Examen, _notas);
        END IF;
		
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

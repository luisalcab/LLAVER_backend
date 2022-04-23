-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema proyecto_geriatra
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema proyecto_geriatra
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `proyecto_geriatra` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `proyecto_geriatra` ;

-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`doctores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`doctores` (
  `idDoctor` TINYINT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `status` TINYINT NOT NULL,
  PRIMARY KEY (`idDoctor`),
  UNIQUE INDEX `idDoctor_UNIQUE` (`idDoctor` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`pacientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`pacientes` (
  `idPaciente` TINYINT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `escolaridad` VARCHAR(45) NOT NULL,
  `fechaNacimiento` TIMESTAMP NOT NULL,
  `sexo` TINYINT NOT NULL,
  `status` TINYINT NOT NULL,
  `idDoctor` TINYINT NOT NULL,
  PRIMARY KEY (`idPaciente`),
  UNIQUE INDEX `idPaciente_UNIQUE` (`idPaciente` ASC) VISIBLE,
  INDEX `idDoctor_idx` (`idDoctor` ASC) VISIBLE,
  CONSTRAINT `idDoctor`
    FOREIGN KEY (`idDoctor`)
    REFERENCES `proyecto_geriatra`.`doctores` (`idDoctor`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`consultas_geriatricas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`consultas_geriatricas` (
  `idConsulta` TINYINT NOT NULL AUTO_INCREMENT,
  `fechaConsulta` TIMESTAMP NOT NULL,
  `idPaciente` TINYINT NOT NULL,
  `idDoctor` TINYINT NOT NULL,
  PRIMARY KEY (`idConsulta`),
  UNIQUE INDEX `idConsulta_UNIQUE` (`idConsulta` ASC) VISIBLE,
  INDEX `idPaciente_idx` (`idPaciente` ASC) VISIBLE,
  INDEX `idDoctor_idx` (`idDoctor` ASC) VISIBLE,
  INDEX `idDoctorConsulta_idx` (`idPaciente` ASC, `idDoctor` ASC) VISIBLE,
  INDEX `idPacienteConsulta_idx` (`idPaciente` ASC) VISIBLE,
  CONSTRAINT `idDoctorConsulta`
    FOREIGN KEY (`idDoctor`)
    REFERENCES `proyecto_geriatra`.`doctores` (`idDoctor`),
  CONSTRAINT `idPacienteConsulta`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `proyecto_geriatra`.`pacientes` (`idPaciente`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`cuidadores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`cuidadores` (
  `idCuidador` TINYINT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`idCuidador`),
  UNIQUE INDEX `idCuidador_UNIQUE` (`idCuidador` ASC) VISIBLE,
  UNIQUE INDEX `telefono_UNIQUE` (`telefono` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`examenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`examenes` (
  `idExamen` TINYINT NOT NULL AUTO_INCREMENT,
  `nombreExamen` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idExamen`),
  UNIQUE INDEX `idExamen_UNIQUE` (`idExamen` ASC) VISIBLE,
  UNIQUE INDEX `nombreExamen_UNIQUE` (`nombreExamen` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`examenes_realizados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`examenes_realizados` (
  `idConsulta` TINYINT NOT NULL,
  `idExamen` TINYINT NOT NULL,
  `notas` TEXT NULL DEFAULT NULL,
  INDEX `idConsultaExamenRealizado_idx` (`idConsulta` ASC) VISIBLE,
  INDEX `idExamenExamenRealizado_idx` (`idExamen` ASC) VISIBLE,
  CONSTRAINT `idConsultaExamenRealizado`
    FOREIGN KEY (`idConsulta`)
    REFERENCES `proyecto_geriatra`.`consultas_geriatricas` (`idConsulta`),
  CONSTRAINT `idExamenExamenRealizado`
    FOREIGN KEY (`idExamen`)
    REFERENCES `proyecto_geriatra`.`examenes` (`idExamen`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`secciones_examenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`secciones_examenes` (
  `idSeccionExamen` TINYINT NOT NULL AUTO_INCREMENT,
  `nombreSeccion` VARCHAR(45) NOT NULL,
  `idExamen` TINYINT NOT NULL,
  PRIMARY KEY (`idSeccionExamen`),
  UNIQUE INDEX `idSeccionExamen_UNIQUE` (`idSeccionExamen` ASC) VISIBLE,
  INDEX `idExamen_idx` (`idExamen` ASC) VISIBLE,
  CONSTRAINT `idExamen`
    FOREIGN KEY (`idExamen`)
    REFERENCES `proyecto_geriatra`.`examenes` (`idExamen`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`preguntas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`preguntas` (
  `idPregunta` TINYINT NOT NULL AUTO_INCREMENT,
  `pregunta` MEDIUMTEXT NOT NULL,
  `idSeccionExamen` TINYINT NOT NULL,
  PRIMARY KEY (`idPregunta`),
  UNIQUE INDEX `idPregunta_UNIQUE` (`idPregunta` ASC) VISIBLE,
  INDEX `idSeccionExamen_idx` (`idSeccionExamen` ASC) VISIBLE,
  CONSTRAINT `idSeccionExamen`
    FOREIGN KEY (`idSeccionExamen`)
    REFERENCES `proyecto_geriatra`.`secciones_examenes` (`idSeccionExamen`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`respuestas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`respuestas` (
  `idConsulta` TINYINT NOT NULL,
  `idPregunta` TINYINT NOT NULL,
  `resultado` TEXT NOT NULL,
  `puntaje` TINYINT NOT NULL,
  INDEX `idConsultaRespuesta_idx` (`idConsulta` ASC) VISIBLE,
  INDEX `idPreguntaRespuesta_idx` (`idPregunta` ASC) VISIBLE,
  CONSTRAINT `idConsultaRespuesta`
    FOREIGN KEY (`idConsulta`)
    REFERENCES `proyecto_geriatra`.`consultas_geriatricas` (`idConsulta`),
  CONSTRAINT `idPreguntaRespuesta`
    FOREIGN KEY (`idPregunta`)
    REFERENCES `proyecto_geriatra`.`preguntas` (`idPregunta`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `proyecto_geriatra`.`tiene`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proyecto_geriatra`.`tiene` (
  `idCuidador` TINYINT NOT NULL,
  `idPaciente` TINYINT NOT NULL,
  UNIQUE INDEX `idPaciente_UNIQUE` (`idPaciente` ASC) VISIBLE,
  INDEX `idCuidador_idx` (`idCuidador` ASC) VISIBLE,
  INDEX `idPaciente_idx` (`idPaciente` ASC) VISIBLE,
  CONSTRAINT `idCuidador`
    FOREIGN KEY (`idCuidador`)
    REFERENCES `proyecto_geriatra`.`cuidadores` (`idCuidador`),
  CONSTRAINT `idPaciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `proyecto_geriatra`.`pacientes` (`idPaciente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
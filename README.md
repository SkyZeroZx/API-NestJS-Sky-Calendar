<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <h1 align="center">Sky Calendar API NestJS</h1>
  Es el API REST para la WebAPP/PWA SkyCalendar integrado con Web Authentication para el inicio de sesion passworless
  <p></p>
  <p align="center">
<a href="https://sonarcloud.io/api/project_badges/measure?project=SkyZeroZx_API-NestJS-Sky-Calendar&metric=alert_status" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=SkyZeroZx_API-NestJS-Sky-Calendar&metric=alert_status" alt="Quality Gate" /></a>
<a href="https://sonarcloud.io/summary/new_code?id=SkyZeroZx_API-NestJS-Sky-Calendar" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=SkyZeroZx_API-NestJS-Sky-Calendar&metric=coverage" alt="Coverage" /></a>
<a href="https://sonarcloud.io/summary/new_code?id=SkyZeroZx_API-NestJS-Sky-Calendar" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=SkyZeroZx_API-NestJS-Sky-Calendar&metric=vulnerabilities" alt="Vulnerabilities" /></a>
<a href="https://sonarcloud.io/summary/new_code?id=SkyZeroZx_API-NestJS-Sky-Calendar" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=SkyZeroZx_API-NestJS-Sky-Calendar&metric=bugs" alt="Bugs" /></a>
<a href="https://sonarcloud.io/summary/new_code?id=SkyZeroZx_API-NestJS-Sky-Calendar" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=SkyZeroZx_API-NestJS-Sky-Calendar&metric=security_rating" alt="Security Rating" /></a>
<a href="https://sonarcloud.io/summary/new_code?id=SkyZeroZx_API-NestJS-Sky-Calendar" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=SkyZeroZx_API-NestJS-Sky-Calendar&metric=code_smells" alt="Code Smells"/></a>
<a href="https://sonarcloud.io/summary/new_code?id=SkyZeroZx_API-NestJS-Sky-Calendar" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=SkyZeroZx_API-NestJS-Sky-Calendar&metric=sqale_rating" alt="Maintainability Rating"/></a>
<img src="https://badgen.net/badge/Built%20With/TypeScript/bl" alt="Build With TypeScript" />
<img src="https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg" alt="Build With TypeScript" />
</p>

## :ledger: Index

- [Pre-Requisitos](#pre-requisitos-)
- [Instalación](#instalación-)
- [Desarrollo](#desarrollo-%EF%B8%8F)
  - [Unit-Test](#unit-test)
  - [Build](#build)
- [Analisis de Codigo](#analisis-de-codigo-)
- [Construido](#construido-con-)

## Comenzando 🚀
_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

## Pre-Requisitos 📋

_Software requerido_

```
NodeJS >= 14.X
NPM >= 8.X
NestJS >= 8.X
```

_Software opcional_

```
Visual Studio Code ( O el editor de su preferencia)
```

## Instalación 🔧

_Para ejecutar un entorno de desarrollo_

_Previamente ejecutar el comando en la terminal para descargar "node_modules" para el funcionamiento del proyecto_

```
 npm install
```

_Previamente a ejecutar el servidor en desarrollo configurar el archivo .env con las credenciales del servidor correos y base de datos , ejecutar :_

```
 npm run start:dev
```

_Dirigirse a la ruta http://localhost:3000/ donde tendra el API REST levantada_


## Desarrollo ⚙️

_Las siguientes instrucciones serviran para ejecutar en su entorno local la pruebas unitarias realizadas para el proyecto_

###  Unit-Test 

_Para ejecutar todos los Unit Test y reporte de cobertura de codigo ejecutar el comando_

```
 npm run test:cov
```
_La carpeta con la cobertura del codigo se creara en la raiz del proyecto con la siguiente ruta coverage/Icov-report/index.html el cual se puede visualizar_


![Unit Test Coverage](/docs/unit-test/unit-test-coverage.png)


###  Build

_Para generar el build de producción del proyecto ejecutar el siguiente comando:_

```
 npm run build
```

## Analisis de Codigo 🔩

_**Pre requisitos**_

_En la raiz del proyecto se tiene el archivo *sonar-project.properties* el cual tiene las propiedades necesarias para ejecutarlo sobre un SonarQube_

_Configurar los apartados : *sonar.host.url* , *sonar.login* *sonar.password* con los datos de su instancia correspondiente o usar SonarCloud con su token correspondiente_

```
Sonaqube >= 9.X
```

![SonarQube Properties](/docs/sonar/sonar-properties.png)

_Las pruebas fueron realizas sobre *SonarQube 9.5* y *SonarCloud*  para ejecutar el analisis de codigo ejecutar el comando para la instancia local:_


```
npm run sonar
```

_Reporte de Cobertura en SonarCloud_

![SonarQube Cloud 1](/docs/sonar/sonar-cloud.png)


![SonarQube Cloud 2](/docs/sonar/sonar-cloud-2.png)


![SonarQube Cloud 3](/docs/sonar/sonar-cloud-3.png)


## Construido con 🛠️

_Las herramientas utilizadas son:_

- [NestJS](https://nestjs.com/) - El framework para construir aplicaciones del lado del servidor eficientes, confiables y escalables.
- [NPM](https://www.npmjs.com/) - Manejador de dependencias
- [Jest](https://jestjs.io/) - Framework Testing para pruebas unitarias
- [SonarQube](https://www.sonarqube.org/) - Evaluacion de codigo on premise
- [SonarCloud](https://sonarcloud.io/) - Evaluacion de codigo cloud
- [Visual Studio Code](https://code.visualstudio.com/) - Editor de Codigo
- [Prettier](https://prettier.io/) - Formateador de Codigo
- [WebAuthn](https://webauthn.guide/) - Estándar web del proyecto FIDO2 de la Alianza FIDO
- [TabNine](https://www.tabnine.com/) - Autocompletador de Codigo

## Versionado 📌

Usamos [GIT](https://git-scm.com/) para el versionado.

## Autor ✒️

- **Jaime Burgos Tejada** - _Developer_ - [SkyZeroZx](https://github.com/SkyZeroZx) - email : jaimeburgostejada@gmail.com

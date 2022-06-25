--

INSERT INTO `user` (`id`, `username`, `password`, `role`, `createdAt`, `updateAt`, `nombre`, `apellidoPaterno`, `apellidoMaterno`, `estado`, `firstLogin`) VALUES
(4, 'saivergx@gmail.com', '$2a$10$eperJ.avfHSYk.VBTGQL6el/n2aP83egcxJS5H41Qb6xWEIP7S3rG', 'admin', '2022-06-19 05:46:39.563036', '2022-06-19 17:04:24.000000', 'Editado User', 'Editado User', 'Editado User SX', 'HABILITADO', 0),
(5, 'jburgost@unac.edu.pe', '$2a$10$bzqEki9JJBaw08sYOQyzTuOaa.uGwCDC.hcQoDedawIoOCn1Gf6vK', 'admin', '2022-06-19 06:49:15.634285', '2022-06-19 17:03:54.000000', 'JAIME', 'BURGOS', 'TEJADA', 'HABILITADO', 0),
(6, 'skyzerobot64@gmail.com', '$2a$10$QUi2iUrhtYKMSx/tpJXqyOSIxnxZVZqM/O80elFctFoDiDKocmhHa', 'admin', '2022-06-19 17:05:34.710775', '2022-06-19 17:05:34.710775', 'SkyBot', 'Sky', 'Sky', 'CREADO', 1);

INSERT INTO TYPE (typeDescription , start , end , borderColor , backgroundColor ) VALUES ('MATUTINO' , '08:00', '12:00', '#10b759' , 'rgba(16,183,89, .25)');
INSERT INTO TYPE (typeDescription , start , end , borderColor , backgroundColor ) VALUES ('VESPERTINO' , '13:00', '18:00', '#fd7e14' , 'rgba(253,126,20,.25)');
INSERT INTO TYPE (typeDescription , start , end , borderColor , backgroundColor ) VALUES ('NOCTURNO' , '19:00', '23:00', '#5b47fb' , 'rgba(91,71,251,.2)');



INSERT INTO `task` (`codTask`, `title`, `description`, `codType`, `start`, `end`) VALUES
(1, 'ACTIVIDAD MAÑANA 1 TITLE', 'ACTIVIDAD MAÑANA 1 DESCRIPTION', 1, '2022-06-23', '2022-06-23'),
(2, 'ACTIVIDAD VESPERTINO 1 TITLE', 'VESPERTINO 1 DESCRIPTION', 2, '2022-06-23', '2022-06-23'),
(3, 'ACTIVIDAD NOCTURNO 24 TITLE', 'NOCTURNO 1 DESCRIPTION', 3, '2022-06-24', '2022-06-24'),
(10, 'TESTING BD TITLE', 'TESTING BD', 2, '2022-06-25', '2022-06-25');


INSERT INTO task_to_user (codUser , codTask ) VALUES (6,1)


INSERT INTO task_to_user (codUser , codTask ) VALUES (6,10)
/*
NOTA EN CASO REQUERIRSE AUMENTAR EL PERFORMACE Y EVITAR EL TIMEOUT EN EL CREATE TASK DIVIDIRLO 
PARTE 1 : 
DEVOLVER LOS CODIGO TASK_TO_USER Y ENVIAR OTRA VEZ EL ARRAY DE USUARIO DE LA TAREA
PARTE 2 :  
CON LOS CODIGOS DEVUELTOS DE TASK_TO_USER Y CODIGO DE USUARIOS ( QUE YA TENEMOS LOS VOLVEMOS ENVIAR EN ESTA PETICION )
REALIZAR UNA NUEVA PETICION PARA EL ENVIO DE NOTIFICACIONES
*/

/* QUERY TASK BY USER */
-- Pantalla Usuario
SELECT T.codTask as CodTask, TTU.id as CodTaskToUser,  T.TITLE , T.DESCRIPTION ,T.START , T.END FROM TASK T
JOIN task_to_user TTU
ON TTU.codTask = T.codTask
JOIN user U 
ON U.id = TTU.codUser
WHERE U.ID = 6; -- Codigo del usuario al logearse

/* Query All Task */
-- Mostrar todos los task en pantalla administrador
SELECT CODTASK , TITLE, DESCRIPTION, START, END FROM TASK;

/* Query Users By Task */
SELECT U.ID , U.NOMBRE , U.apellidoPaterno from USER U 
JOIN TASK_TO_USER TTU 
ON U.ID  = TTU.codUser
JOIN TASK T 
ON T.codTask = TTU.codTask
WHERE T.codTask = 1 -- Codigo Task Obtenido del select anterior


/* Para caso de editar cuando se remueva o agreguen usuarios llamar al endpoint donde agregara a su tarea respectiva o lo removera */
/* Para el caso de los tokens aplicar en casacade el update o delete*/




/*** Para suscribir notificaciones por Task To User***/
-- Que necesito me envie ¿?
-- Necesito el token , necesito su ID de Usuario
    const arrayTaskToUser = SELECT ID FROM TASK_TO_USER WHERE CODUSER = 'CODIGO USUARIO LOGEADO'; -- Se puede ahorrar esta peticion haciendo que el usuario lo envie , pero mejor evitarlo
-- Voy a registrar el token
    const tokenGuay -- Fue obtenido de la peticion enviada
    for (let i =0 ; i< arrayTaskToUser.length  ;i++){
    INSERT INTO NOTIFICACION (tokenPush , codTaskToUser ) VALUES ( tokenGuay, arrayTaskToUser[i]);
    }


/***** Caso por cada vez se registre un nuevo task *******/
-- Array de codigos de usuario recibidos desde la peticion
    const arrayCodUser;
-- Inserto el task
    INSERT INTO TASK VALUES ('VALORES DEL TASK')
-- Ahora itero el array de codigos de usuario , y el codTask obtenido para registrarlo en task_to_user
    const newCodTask;
    let arrayTaskToUser = [];
-- Le agregamos a nuestro arrayTaskToUser , los valores retornados que es el ID de TASK_TO_USER
    for (let i = 0 ; i <arrayCodUser.length ; i++){
        INSERT INTO TASK_TO_USER (arrayCodUser[i],newCodTask);
    }
-- Una vez finalizado  ahora suscribimos esos usuarios a su nueva notificacion
-- Obtenemos sus tokenPush
-- Para ello buscamos sus tokens apartir de las suscripciones hechas anteriormente
-- Entonces traemos todos los tokens
    const arrayToken =  []
-- Iteramos todos los codigos de usuario y agregamos a nuestro array de tokens
    for ( let i = 0 ; i <arrayCodUser.length ; i){
    arrayTokenPush.push(SELECT N.tokenPush  FROM NOTIFICACION N 
        JOIN TASK_TO_USER TTU
        ON N.codTaskToUser = TTU.ID
        WHERE TTU.CODUSER = arrayCodUser[i]   )
    }

-- Ya teniendo todos los tokens 
-- Registramos con el ya obtenido arrayTaskToUser en la tabla notificacion con sus respectivos arrayTokenPush
    for ( let i = 0 ; i <arrayTokenPush.length ; i++){
        if(typeof arrayTokenPush[i] == 'object' ){
            /* Para el caso que el arrayTokenPush contenga adentro un array lo iteramos mientras mantenemos el mismo codTaskToUser del arrayTaskToUser*/
            for (let j=0 ; j< arrayTokenPush[i].length ;j++){
                INSERT INTO NOTIFICACION (TOKENPUSH , codTaskToUser) VALUES (arrayTokenPush[i][j], arrayTaskToUser[i]);
            } 
        } else {
            /* Para el caso contrario si sera un un string por lo cual lo insertamos junto a su codigo TaskToUser*/
            INSERT INTO NOTIFICACION (TOKENPUSH , codTaskToUser) VALUES (arrayTokenPush[i], arrayTaskToUser[i]);
        }
    }

-- Enviamos la notificacion con los tokens de que sea creo la nueva tarea 
    for (let i = 0; i < arrayTokenPush.length; i++) {
     enviarNotificacion(arrayTokenPush[i]);
    }

/************* CASO SE EDITE UNA TAREA O SE ELIMINE   ***************/
--- Que recibo ¿?
-- Recibo el ID del Task , fecha inicio , fecha fin , title , description  , type , tambien puede escribir agregacion de usuarios
    UPDATE TASK SET 
    title = TitleEdit , start = starEdit , end = endEdit , description = descriptionEdit , type =typeEdit
    WHERE CodTask = 'CODIGO RECIBIDO'; -- OR si se elimina DELETE TASK WHERE CodTask = 'CODIGO RECIBIDO' ,el delete sera un update a un type cancelado

-- LUEGO buscado los tokens de los usuarios asignados al task editado o eliminado
    const arrayTokenNotificacion = []

    SELECT  N.tokenPush  FROM  TASK T
    JOIN TASK_TO_USER TTU
    ON T.codTask = TTU.codTask
    JOIN NOTIFICACION N 
    ON TTU.ID = N.codTaskToUser
    WHERE T.codTask = 'CODIGO RECIBIDO'

-- Una vez teniendo nuestros tokens de los usuarios suscritos a esta Task
-- Le enviamos su notificacion


-- Enviamos la notificacion con los tokens de que sea creo la nueva tarea
    for (let i = 0; i < arrayTokenNotificacion.length; i++) {
        enviarNotificacion(arrayTokenNotificacion[i]);
    }

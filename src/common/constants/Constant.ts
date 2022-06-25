/**  CAMPOS PARA CONFIGURACION DATABASE DE ARCHIVO .ENV  EN LA RAIZ DEL PROYECTO **/

export const JWT_TOKEN = 'JWT_TOKEN';
export const DATABASE_HOST = 'DATABASE_HOST';
export const DATABASE_PORT = 'DATABASE_PORT';
export const DATABASE_USERNAME = 'DATABASE_USERNAME';
export const DATABASE_PASSWORD = 'DATABASE_PASSWORD';
export const DATABASE_NAME = 'DATABASE_NAME';

/* CONSTANTES PARA ESTADOS DE USUARIO Y LOGOS EN EL ENVIO DE CORREO Y NOTIFICACIONES */
export class Constant {
  public static readonly MENSAJE_OK = 'OK';

  public static readonly ESTADOS_USER = {
    CREADO: 'CREADO',
    HABILITADO: 'HABILITADO',
    BLOQUEADO: 'BLOQUEADO',
    RESETEADO: 'RESETEADO',
  };

  public static readonly LOGO_FIIS = 'https://fiis.unac.edu.pe/images/logo-fiis.png';
  public static readonly LOGO_APP = 'https://skyzerozx.000webhostapp.com/images/logo_app.png';
  public static readonly TRACKING_WEB = 'https://isekai-orpheus-bot.vercel.app/#/tracking';

  public static readonly MAIL = {
    CREATE_NEW_USER:
      "<img src='" +
      Constant.LOGO_APP +
      "'></img>" +
      '<p>Estimado usuario se creado el nuevo usuario : {{username}} ' +
      '\nSu contraseña es: <b>{{randomPassword}}</b>' +
      '\nPara más detalle comunicarse con el area respectiva</p>',
    RESET_PASSWORD:
      "<img src='" +
      Constant.LOGO_APP +
      "'></img>" +
      '</img> <p>Estimado usuario se ha reseteado la contraseña de su usuario {{username}} ' +
      '\nLa nueva contraseña es: <b> {{passwordReset}} </b> \nPara más detalle comunicarse con el area respectiva</p>',
    UPDATE_STATUS_TRAMITE:
      "<img src='" +
      Constant.LOGO_APP +
      "'></img>" +
      '<p>Por medio del presente cumplimos con informar que su tramite con N° {{id_est_doc}} ' +
      'se actualizado con estado: <b> {{estado}} </b> para más detalles puede verificar su tramite en ' +
      Constant.TRACKING_WEB +
      '</p>',
    SEND_CERTIFICATE:
      "<img src='" +
      Constant.LOGO_APP +
      "'></img>" +
      '<p>Por medio del presente cumplimos con informar que su tramite con N°{{id_est_doc}}' +
      ' se actualizado con estado: <b>FINALIZADO</b></p><br>' +
      '<p>Puede descargar su certificado en el apartado certificado en la busqueda de tramite+ ' +
      Constant.TRACKING_WEB +
      '</p>',
  };

  public static readonly WA_MSG = {
    UPDATE_STATUS_TRAMITE:
      'Estimado estudiante se le informa por medio del presente que su tramite N°{{id_est_doc}} se actualizo con nuevo estado {{estado}}' +
      '\nPara más informacion puede realizar la busqueda de su tramite en la plataforma: ' +
      Constant.TRACKING_WEB,
    SEND_CERTIFICATE:
      'Estimado estudiante se le informa por medio del presente que su tramite N°{{id_est_doc}} se encuentra FINALIZADO' +
      '\nPara más informacion puede realizar la busqueda de su tramite en la plataforma: ' +
      Constant.TRACKING_WEB,
  };

  public static NOTIFICACION_NEW_TASK = {
    notification: {
      title: 'Se creo una nueva tarea para usted',
      data: {
        url: Constant.TRACKING_WEB,
      },
      body: 'Revise sus calendario de tareas',
      vibrate: [150, 50, 150],
      image: Constant.LOGO_APP,
      actions: [
        {
          action: 'Explorar',
          title: 'Visitar',
        },
      ],
    },
  };

  public static NOTIFICACION_UPDATE_TASK = {
    notification: {
      title: 'Se actualizo una tarea asignada a usted',
      data: {
        url: Constant.TRACKING_WEB,
      },
      body: 'Revise sus calendario de tareas',
      vibrate: [150, 50, 150],
      image: Constant.LOGO_APP,
      actions: [
        {
          action: 'Explorar',
          title: 'Visitar',
        },
      ],
    },
  };

  public static NOTIFICACION_DELETE_TASK = {
    notification: {
      title: 'Se eliminado una tarea asignada a usted',
      data: {
        url: Constant.TRACKING_WEB,
      },
      body: 'Revise sus calendario de tareas',
      vibrate: [150, 50, 150],
      image: Constant.LOGO_APP,
      actions: [
        {
          action: 'Explorar',
          title: 'Visitar',
        },
      ],
    },
  };

  public static replaceText(keyText: string[], arrayTextReplace: string[], textForReplace: string) {
    let result = textForReplace;
    for (let i = 0; i < arrayTextReplace.length; i++) {
      result = result.replace(keyText[i].trim(), arrayTextReplace[i].trim());
    }
    return result;
  }
}

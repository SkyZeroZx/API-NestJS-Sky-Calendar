import { Logger } from '@nestjs/common';
import nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'nodetestui@gmail.com',
    pass: 'goaqcsrjxfuuklcz',
  },
});
const logger = new Logger('NodeMailer');

transporter
  .verify()
  .then(() => {
    logger.log('Servidor de correos inicializado');
  })
  .catch((error) => {
    logger.error('Sucedio un error al iniciarlizar el servidor de correos', error);
  });

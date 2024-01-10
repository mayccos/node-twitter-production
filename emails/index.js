const nodemailer = require('nodemailer')
const sparkPostTransporter = require('nodemailer-sparkpost-transport')
const path = require('path')
const pug = require('pug')
require('dotenv').config()

class Email {
    constructor() {
        // Nous affichons comme nom d'expéditeur Dyma projects
        // Nous utilisons le no-reply@dyma-projects.site comme adresse d'envoi.
        // Nous ne l'avons pas créée car nous ne souhaitons pas recevoir de réponse
        this.from = 'Mayccos projects <no-reply@mayccos.fr>'

        // Nous créons notre transporteur qui utilise SparkPost pour la production
        if (process.env.NODE_ENV === 'production') {
            this.transporter = nodemailer.createTransport(
                sparkPostTransporter({
                    sparkPostApiKey: `${process.env.SPARKPOSTAPI_KEY}`,
                    endpoint: 'https://api.eu.sparkpost.com',
                }),
            )
        } else {
            // Pour le développement nous utilisons Mailtrap
            this.transporter = nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 2525,
                auth: {
                    user: `${process.env.MAILTRAP_USER}`,
                    pass: `${process.env.MAILTRAP_PASSWORD}`,
                },
            })
        }
    }

    // Nous créons la méthode pour envoyer l'email permettant la validation
    // de l'email de l'utilisateur :
    async sendEmailVerification(options) {
        try {
            const email = {
                // Nous utilisons l'expéditeur défini sur la classe :
                from: this.from,
                subject: 'Email verification',
                // Nous passerons l'email de l'utilisateur dans l'objet options :
                to: options.to,
                html: pug.renderFile(
                    // Nous utilisons le module path pour ne pas avoir d'erreur de chemins :
                    path.join(__dirname, 'templates/email-verification.pug'),
                    {
                        // Nous passerons le pseudo en options qui sera affiché dans l'email :
                        username: options.username,
                        // Pour le lien de validation, nous avons besoin de l'id de l'utilisateur et du token.
                        // Nous passons également l'hôte en options si :
                        url: `https://${options.host}/users/email-verification/${options.userId}/${options.token}`,
                    },
                ),
            }
            const response = await this.transporter.sendMail(email)
            console.log(response)
        } catch (e) {
            throw e
        }
    }
}

module.exports = new Email()

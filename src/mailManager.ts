import {google} from "googleapis";
import nodemailer from "nodemailer";
require('dotenv').config()
import {FriendsDataWithId, selectFriends} from "./friendsManager";

const envVars = {
    GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN
}

const oAuthClient = new google.auth.OAuth2(envVars.GOOGLE_CLIENT_ID, envVars.GOOGLE_SECRET_KEY, envVars.GOOGLE_REDIRECT_URI)
oAuthClient.setCredentials({refresh_token: envVars.GOOGLE_REFRESH_TOKEN})

const sendEmail = async (
    transport: nodemailer.Transporter,
    sortedFriend:{
        origin: FriendsDataWithId,
        selected: FriendsDataWithId
    }
) =>{
    try{
        const mailOptions = {
            from: 'SecretSanta Raffle <ENTER HERE THE EMAIL REGISTERED ON GOOGLE CLOUD PLATFORM FOR OAUTH>',
            to: sortedFriend.origin.email,
            subject: 'SORTEIO DE AMIGO INVISIVEL PARA O EVENTO DO DIA 22/12/2023',
            text: `Seu amigo invisivel é ${sortedFriend.selected.name} `
        }

        const result = await transport.sendMail(mailOptions)
        return result
    }catch (e){
        console.log(e)
    }
}

export const sortFriendsAndSendEmail = async () =>{
    const sortedFriends = await selectFriends()
    const acessToken = await oAuthClient.getAccessToken()
    const transport = nodemailer.createTransport({
        // @ts-ignore
        service: 'gmail',
        auth:{
            type: 'OAuth2',
            user: 'ENTER HERE THE EMAIL REGISTERED ON GOOGLE CLOUD PLATFORM FOR OAUTH',
            clientId: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_SECRET_KEY,
            refreshToken: envVars.GOOGLE_REFRESH_TOKEN,
            acessToken: acessToken
        }
    })
    for (let sortedFriend of sortedFriends) {
        await sendEmail(transport, sortedFriend)
    }
    console.log("Amigo secreto sorteado e emails enviados")
}

import {google} from "googleapis";
import nodemailer from "nodemailer";
require('dotenv').config()
import {FriendsDataWithId, selectFriends} from "./friendsManager";

const envVars = {
    GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLOUD_EMAIL_REGISTERED: process.env.GOOGLE_CLOUD_EMAIL_REGISTERED
}

const oAuthClient = new google.auth.OAuth2(envVars.GOOGLE_CLIENT_ID, envVars.GOOGLE_SECRET_KEY, envVars.GOOGLE_REDIRECT_URI)
oAuthClient.setCredentials({refresh_token: envVars.GOOGLE_REFRESH_TOKEN})

const sendEmail = async (
    transport: nodemailer.Transporter,
    sortedFriend:{
        origin: FriendsDataWithId,
        selected: FriendsDataWithId
    },
    eventDate: string,
    eventName: string
) =>{
    try{
        const mailOptions = {
            from: `SecretSanta Raffle '${eventName}' <${envVars.GOOGLE_CLOUD_EMAIL_REGISTERED}>`,
            to: sortedFriend.origin.email,
            subject: `${eventName} ${eventDate}`,
            text: `Seu amigo invisivel é ${sortedFriend.selected.name} `
        }

        const result = await transport.sendMail(mailOptions)
        return result
    }catch (e){
        console.log(e)
    }
}

export const sortFriendsAndSendEmail = async () =>{
    const {eventName, organizedSortedFriends: sortedFriends, eventDate} = await selectFriends()
    const acessToken = await oAuthClient.getAccessToken()
    const transport = nodemailer.createTransport({
        // @ts-ignore
        service: 'gmail',
        auth:{
            type: 'OAuth2',
            user: envVars.GOOGLE_CLOUD_EMAIL_REGISTERED,
            clientId: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_SECRET_KEY,
            refreshToken: envVars.GOOGLE_REFRESH_TOKEN,
            acessToken: acessToken
        }
    })
    for (let sortedFriend of sortedFriends) {
        await sendEmail(transport, sortedFriend, eventName, eventDate)
    }
    console.log("Amigo secreto sorteado e emails enviados")
}

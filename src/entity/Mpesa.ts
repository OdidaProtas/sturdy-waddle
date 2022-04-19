import { NextFunction, Request, Response } from "express";
import axios from "axios";
import createRoute from "../helpers/createRoute";

const mpesaAuthUrl = process.env.MPESA_AUTH_URL;
const darajaSandBoxUrl = process.env.STK_PUSH_URL;


export default class Mpesa {

    static async stkPush(auth: any, phone: string, amount: any) {

        let timestamp = getTimestamp();
        let bsShortCode = process.env.MPESA_SHORT_CODE;
        let passkey = process.env.MPESA_PASS_KEY;

        let formattedPass = `${bsShortCode}${passkey}${timestamp}`;
        let password = Buffer.from(formattedPass).toString('base64');

        let type = "CustomerPayBillOnline";

        let [partyA, formatErr] = formatPhoneNumber(phone);

        if (formatErr) {
            return 1
        }
        let partyB = process.env.MPESA_SHORT_CODE;
        let callBackUrl = `${process.env.HOST_URL}/MpesaHook`;

        let accountReference = "test";
        let transactionDesc = "test";

        let valAmount = validateAmount(parseInt(amount));


        let data = {
            BusinessShortCode: bsShortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: type,
            Amount: valAmount,
            PartyA: partyA,
            PartyB: partyB,
            PhoneNumber: partyA,
            AccountReference: accountReference,
            TransactionDesc: transactionDesc,
            CallBackURL: callBackUrl
        }


        let config = {
            headers: {
                Authorization: auth,
            }
        }

        try {
            await axios.post(darajaSandBoxUrl, data, config).then(res => {
                return [res.data, null]

            }).catch(e => {
                return [null, e['response']['statusText']];
            })

        } catch (e) {
            return [null, e];
        }


    }

    static async requestPayment(phone: any, amount: any) {

        let consumerKey = process.env.CONSUMER_KEY;
        let consumerSecret = process.env.CONSUMER_SECRET;

        let buffer = Buffer.from(consumerKey + ":" + consumerSecret);

        let auth = `Basic ${buffer.toString("base64")}`;

        try {
            let { data } = await axios.get(mpesaAuthUrl, {
                "headers": {
                    "Authorization": auth
                }
            })

            const mpesa_access_token = data['access_token'];

            return this.stkPush(mpesa_access_token, phone, amount);

        } catch (e) {
            return [null, e]
        }
    }

    async webHook(request: Request, response: Response, next: NextFunction) {
        const { Body: { stkCallback: { CheckoutRequestID } } } = request.body;
        request["io"].emit("mpesa-hook", request.body)
        let message = {
            "ResponseCode": "00000000",
            "ResponseDesc": "success"
        }
        response.json(message);
    }
}


export const MpesaRoutes = [
    createRoute("get", "/MpesaHook", Mpesa, "webHook")
]

const formatPhoneNumber = (phoneNumber: string) => {
    let formatted = parseInt(`254${phoneNumber.substring(1)}`);
    if (numberIsValid(formatted)) return [formatted, null];
    return [null, true]
}


const numberIsValid = (formatted: any) => {
    let _pattern = /^(?:254|\+254|0)?(7(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/;
    return _pattern.test(formatted);
}

const validateAmount = (amount: number) => {
    if (isNaN(amount) || amount < 1) return [amount, null]
    return [null, true];
}

function getTimestamp() {
    let date = new Date();
    function pad2(n: number) {
        return (n < 10 ? '0' : '') + n;
    }
    return date.getFullYear() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        pad2(date.getSeconds());
}
const axios = require('axios');

class PaparaClient {
    constructor({ apiKey, merchantSecretKey }, isTest = false) {
        this.URL = isTest ? 'https://merchant-api.test.papara.com' : 'https://merchant.papara.com';
        this.merchantSecretKey = merchantSecretKey;
        this.client = axios.create({
            baseURL: this.URL,
            headers: {
                'ApiKey': apiKey,
                'Content-Type': 'application/json'
            }
        });

        this.client.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.response) {
                throw new Error(`Papara API hatası: ${error.response.data.message}`);
            } else {
                throw new Error(`Papara API hatası: ${error.message}`);
            }
        });
    }

    async createPayment(params) {
        try {
            const response = await this.client.post('/payments', {
                amount: Number(params.amount),
                nameSurname: params.nameSurname,
                referenceId: params.referenceId,
                orderDescription: params.orderDescription,
                notificationUrl: params.notificationUrl,
                redirectUrl: params.redirectUrl
            });
            return response.data;
        } catch (error) {
            throw new Error(`Ödeme oluşturma hatası: ${error.message}`);
        }
    }

    async getAccount() {
        try {
            const response = await this.client.get('/account');
            return response.data;
        } catch (error) {
            throw new Error(`Hesap bilgisi hatası: ${error.message}`);
        }
    }

    async getAccountLedger(params) {
        try {
            const response = await this.client.post('/account/ledgers', {
                startDate: params.startDate,
                endDate: params.endDate,
                page: params.page || 1,
                pageSize: params.pageSize || 50
            });
            return response.data;
        } catch (error) {
            throw new Error(`Hesap hareketleri hatası: ${error.message}`);
        }
    }

    async getPaymentStatus(paymentId) {
        try {
            const response = await this.client.get(`/payments?id=${paymentId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Ödeme durumu hatası: ${error.message}`);
        }
    }

    async verifyPaymentCallback(data) {
        try {
            if (data.status !== 1) {
                return {
                    status: false,
                    error: {
                        code: data?.errorCode,
                        message: data?.errorMessage
                    }
                };
            } else if (data.merchantSecretKey !== this.merchantSecretKey) {
                return {
                    status: false,
                    error: {
                        code: 401,
                        message: 'Invalid merchant secret key'
                    }
                };
            } else {
                return {
                    status: true,
                    data: data
                };
            }
        } catch (error) {
            return {
                status: false,
                error: {
                    code: 500,
                    message: error.message
                }
            };
        }
    }
}

module.exports = PaparaClient;

const papara = new PaparaClient({
    apiKey: 'xxxxxxxxxxxxxxxx',
    merchantSecretKey: 'xxxxxxxxxxxxx'
}, true);

(async () => {
    // const account = await papara.getAccount();
    // console.log(account);

    const payment = await papara.createPayment({
        amount: 1,
        nameSurname: 'Test Müşteri',
        referenceId: '1234',
        orderDescription: 'Test Ödemesi',
        notificationUrl: 'https://test.dalamangoldtaxi.net/callback',
        redirectUrl: 'https://test.dalamangoldtaxi.net/'
    });
    /*
    */
    console.log(payment.data.paymentUrl);
})();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('multer')().none());

app.post('/callback', async (req, res) => {
    /*
    {
        status: true,
        data: {
            id: 'c02a2df7-5cf5-43c7-9419-',
            createdAt: '2025-01-03T21:28:55.06',
            merchantId: '2f73fd0a-d480-4f6f-a2a3-',
            userId: '82c0ad97-22fc-4a51-9607-',
            paymentMethod: 0,
            paymentMethodDescription: null,
            referenceId: '1234',
            orderDescription: 'Test Ödemesi',
            status: 1,
            statusDescription: null,
            amount: 1,
            fee: 0,
            currency: 0,
            currencyInfo: null,
            notificationUrl: 'https://test.dalamangoldtaxi.net/callback',
            failNotificationUrl: null,
            notificationDone: false,
            paymentUrl: 'https://test.papara.com/checkout/c02a2df7-5cf5-43c7-9419-',
            merchantSecretKey: 'a5LTqfkBxIy7f+f8AHEoRBb6+nAJ/iyxJlkvbDmIGM==',
            remainingRefundAmount: null,
            returningRedirectUrl: 'https://test.dalamangoldtaxi.net/?paymentId=c02a2df7-5cf5-43c7-9419-&referenceId=1234&status=1&amount=1.00',
            errorCode: null,
            errorMessage: null,
            turkishNationalId: 0,
            isLinkPayment: false,
            transactionType: null,
            refundNotificationUrl: null,
            basketUrl: null
        }
        }
    */
    console.log(await papara.verifyPaymentCallback(req.body));
    res.send('OK');
});

app.listen(80, () => {
    console.log('Server started');
});

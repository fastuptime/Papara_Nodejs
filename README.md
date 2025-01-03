# Papara Node.js İstemcisi

🌟 Papara API entegrasyonunu kolaylaştıran, kullanımı basit ve özelliklerle dolu bir Node.js kütüphanesi. Bu paket, ödeme oluşturma, hesap yönetimi ve daha fazlasını sorunsuz bir şekilde yapmanızı sağlar. Projenizde hızlı ve güvenli Papara entegrasyonu için mükemmel bir çözüm.

---

## ✨ Özellikler

- **Ödeme Oluşturma**: Özelleştirilebilir parametrelerle Papara ödeme bağlantıları oluşturun.
- **Hesap Yönetimi**: Hesap bilgilerinizi ve hareketlerinizi kolayca alın.
- **Ödeme Bildirimlerini Doğrulama**: Gelen ödeme bildirimlerini kolayca doğrulayın.
- **Hata Yönetimi**: API istekleri için kapsamlı hata yönetimi.

---

## 🔧 Kullanım

### İçe Aktarma ve Başlatma

```javascript
const PaparaClient = require('./papara.js');

const papara = new PaparaClient({
    apiKey: 'API_KEYİNİZ',
    merchantSecretKey: 'MERCHANT_SECRET_KEYİNİZ'
}, true); // Test ortamı için `true` ayarlayın
```

---

### 🌐 Örnek: Ödeme Oluşturma

```javascript
(async () => {
    const payment = await papara.createPayment({
        amount: 1,
        nameSurname: 'Test Müşteri',
        referenceId: '1234',
        orderDescription: 'Test Ödemesi',
        notificationUrl: 'https://speedsmm.com/callback',
        redirectUrl: 'https://speedsmm.com/'
    });

    console.log('Ödeme Bağlantısı:', payment.data.paymentUrl);
})();
```

---

### 📄 Örnek: Callback İşleme

```javascript
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/callback', async (req, res) => {
    const result = await papara.verifyPaymentCallback(req.body);
    console.log(result);
    res.send('OK');
});

app.listen(80, () => {
    console.log('Sunucu 80 portunda çalışıyor');
});
```

---

## 🛠 Metotlar

### **createPayment**
```javascript
papara.createPayment(params);
```
- `params.amount`: Ödeme tutarı (Number)
- `params.nameSurname`: Müşteri adı (String)
- `params.referenceId`: Benzersiz referans ID'si (String)
- `params.orderDescription`: Ödeme açıklaması (String)
- `params.notificationUrl`: Ödeme bildirimi için URL (String)
- `params.redirectUrl`: Ödemeden sonra yönlendirme yapılacak URL (String)

### **getAccount**
```javascript
papara.getAccount();
```

### **getAccountLedger**
```javascript
papara.getAccountLedger(params);
```
- `params.startDate`: Başlangıç tarihi (String)
- `params.endDate`: Bitiş tarihi (String)
- `params.page`: Sayfa numarası (opsiyonel, varsayılan: 1)
- `params.pageSize`: Sayfa başına öğe sayısı (opsiyonel, varsayılan: 50)

### **verifyPaymentCallback**
```javascript
papara.verifyPaymentCallback(data);
```

---

## 🧪 Test Ortamı

Kütüphaneyi bir sandbox ortamında test etmek için, `PaparaClient`'ı `isTest` parametresi `true` olarak başlatın:

```javascript
const papara = new PaparaClient({
    apiKey: 'TEST_API_KEYİNİZ',
    merchantSecretKey: 'TEST_SECRET_KEYİNİZ'
}, true);
```

---

## 🤝 Katkıda Bulunun

Katkılarınızı bekliyoruz! Hata bildirimleri oluşturabilir veya pull request gönderebilirsiniz. Harika bir şeyler inşa edelim. 💪

---

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.

---

## 🌟 Destek

Bu projeyi faydalı bulduysanız, [GitHub](https://github.com/fastuptime/Papara_Nodejs) üzerinde ⭐ vererek destek olabilirsiniz. Desteğiniz bizim için çok önemli!

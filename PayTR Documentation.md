# Direkt API Entegrasyonu 1. Adım

## ÖDEME FORMUNDAN BİLGİLERİN ALINARAK AKTARILMASI

1. Müşteri, üye işyeri web sayfasında satın alma isteminde bulunur.
2. Üye işyeri bu istek doğrultusunda, Müşteriye ödeme seçeneklerini sunduğu sayfaya yönlendirir.
3. Müşterinin ödeme için bilgileri girmesi ve onaylaması sonrasında, Üye işyeri sayfası aşağıda belirlenmiş verileri aşağıdaki sırayla, PAYTR bilgisi dahilinde olan üye işyeri parolası ve üye işyeri gizli anahtarı ile önce sha256 algoritması ve [HMAC](http://en.wikipedia.org/wiki/Hash-based_message_authentication_code) yöntemi ile şifreleyerek token oluşturur. Sonrasında token'ı base64 hale dönüştürür.
4. Eğer müşteri taksitli işlem gerçekleştirecekse kartın hangi kart ailesine ait olduğunu öğrenebilmek için Binsorgu servisine istek yapılır. Binsorgu servisinden dönülen "brand" alanı yakalanarak ödeme isteğinde "card_type" parametresinde iletilir.
5. Eğer bir taksit tablosu gösterilmek istenirse veya işlemde taksitli vade farkı müşteriye yansıtılmak istenirse taksit-oranları servisi üzerinden ilgili tüm taksit oranları çekilebilir.

---

## Token üretiminde kullanılacak veriler

| Alan adı / tipi      | Açıklama | Zorunlu | Kısıtlar |
|----------------------|----------|---------|----------|
| merchant_id (string) | Mağaza No: PayTR tarafından size verilen Mağaza numarası |  |  |
| user_ip (string)     | Müşteri ip: İstek anında aldığınız müşteri ip numarası (Önemli: Lokal makinenizde yapacağınız denemelerde mutlaka dış IP adresini gönderdiğinizden emin olun) | Evet | En fazla 39 karakter (ipv4) |
| merchant_oid (string)| Mağaza sipariş no: Satış işlemi için belirlediğiniz benzersiz sipariş numarası. (Not: Sipariş no ödeme sonuç bildirimi esnasında geri dönen değerler arasındadır) | Evet | En fazla 64 karakter, Alfa numerik |
| email (string)       | Müşteri eposta adresi: Müşterinin sisteminizde kayıtlı olan veya form aracılığıyla aldığınız eposta adresi | Evet | En fazla 100 karakter |
| payment_amount (int) | Ödeme tutarı: Siparişe ait toplam ödeme tutarı | Evet | Ayraç olarak yalnızca nokta(.) gönderilmelidir |
| payment_type (string)| Ödeme tipi | Evet | ('card') |
| installment_count (int)| Taksit sayısı | Evet | 0, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12 |
| currency (string)    | Para birimi | Hayır | TL, EUR, USD, GBP, RUB (Boş ise TL kabul edilir) |
| test_mode            | Mağaza canlı modda iken test işlem yapmak için 1 olarak gönderilebilir | Hayır | 0 veya 1 |
| non_3d               | Non 3D işlem yapabilmek için 1 gönderilebilir | Evet | 0 veya 1 |
| request_exp_date (int)| Sıfırdan farklı bir değer gönderilmesi durumunda, ödeme işlemi bu süre öncesinde tamamlanmalıdır. (Ödeme sırasında sisteminizde fiyat güncellemesi olması durumuna karşı güvenlik amaçlı kullanabilirsiniz) | Hayır | Timestamp |

---

## 4) POST REQUEST içeriğinde gönderilecek değerler:

| Alan adı / tipi      | Açıklama | Zorunlu | Kısıtlar |
|----------------------|----------|---------|----------|
| merchant_id (int)    | Mağaza no: PayTR tarafından size verilen Mağaza numarası | Evet | |
| paytr_token (string) | İsteğin sizden geldiğine ve içeriğin değişmediğine emin olmamız için oluşturacağınız değerdir | Evet | Hesaplama ile ilgili örnek kodlara bakılmalı |
| user_ip (string)     | Müşteri ip | Evet | En fazla 39 karakter |
| merchant_oid (string)| Benzersiz sipariş numarası | Evet | En fazla 64 karakter, Alfa numerik |
| email (string)       | Müşteri eposta adresi | Evet | En fazla 100 karakter |
| payment_type (string)| Ödeme tipi | Evet | ('card') |
| payment_amount (double)| Sipariş tutarı | Evet | Örn: 100.99 |
| installment_count (int)| Taksit sayısı | Evet | 0–12 |
| card_type (string)   | Kart tipi (taksitli işlemde) | Hayır | advantage, axess, combo, bonus, cardfinans, maximum, paraf, world, saglamkart |
| currency (string)    | Para birimi | Hayır | TL, EUR, USD |
| client_lang (string) | Ödeme dili | Hayır | tr, en |
| test_mode            | Test işlemi | Hayır | 0 veya 1 |
| non_3d               | Non 3D işlem | Evet | 0 veya 1 |
| non3d_test_failed    | Non3D başarısız test | Hayır | 0 veya 1 |
| cc_owner (string)    | Kart sahibi | Evet | 50 karakter |
| card_number (string) | Kart numarası | Evet | 16 karakter |
| expiry_month (string)| Kart SKT (Ay) | Evet | 1–12 |
| expiry_year (string) | Kart SKT (Yıl) | Evet | 25, 26, 27… |
| cvv (string)         | Kart güvenlik kodu | Evet | 3 karakter |
| merchant_ok_url (string)| Başarılı ödeme sonrası yönlendirme | Evet | En fazla 400 karakter |
| merchant_fail_url (string)| Başarısız ödeme sonrası yönlendirme | Evet | En fazla 400 karakter |
| user_name (string)   | Müşteri adı soyadı | Evet | 60 karakter |
| user_address (string)| Müşteri adresi | Evet | 400 karakter |
| user_phone (string)  | Müşteri telefonu | Evet | 20 karakter |
| user_basket (string) | Sepet içeriği | Evet | JSON tipinde |
| debug_on (int)       | Hata döndür | Hayır | 0 veya 1 |
| sync_mode (int)      | Sync Mode | Hayır | 0 veya 1 |

---

## SYNC MODE YANITLARI

| status        | msg (Açıklama) | utoken, ctoken (Kart saklama yapıldıysa) |
|---------------|----------------|-----------------------------------------|
| failed        | “Henüz devam eden bir işleminiz bulunmaktadır...” veya hata mesajı | Hayır |
| wait_callback | Ödeme kontrol ediliyor, bildirimi bekleyin | Evet |
| success       | Ödeme başarılı | Evet |

---

## ÖNEMLİ UYARI
PayTR ödeme alt yapısı **asenkron** çalışmaktadır.  
Bu nedenle ödeme tamamlandığında müşteri `merchant_ok_url`'e yönlendirilirken, ödemenin kesin sonucu **Bildirim URL**'ye POST ile gönderilmektedir.  
`merchant_ok_url`'e herhangi bir veri POST edilmez. Bu nedenle sipariş onay/iptal gibi işlemler bu adımda yapılmamalıdır.

---

## Örnek Python Kod (Django)

```python
# Python 3.6+
# Django Web Framework referans alınarak hazırlanmıştır
# Tek başına bir bütün değildir, home.html ile birlikte çalışmaktadır.
# card_type, installment_count gibi kullanıcıya bağlı bilgiler alındıktan sonra paytr_token oluşturulması gerekmektedir.

import base64
import hashlib
import hmac
import html
import json
import random

from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt

def home(request):
    merchant_id = 'MAGAZA_NO'
    merchant_key = b'XXXXXXXXXXX'
    merchant_salt = b'YYYYYYYYYYY'

    merchant_ok_url = 'http://site-ismi/basarili'
    merchant_fail_url = 'http://site-ismi/basarisiz'

    user_basket = html.unescape(json.dumps([
        ['Altis Renkli Deniz Yatağı - Mavi', '18.00', 1],
        ['Pharmaso Güneş Kremi 50+ Yetişkin & Bepanthol Cilt Bakım Kremi', '33,25', 2],
        ['Bestway Çocuklar İçin Plaj Seti', '45,42', 1]
    ]))

    merchant_oid = 'OS' + str(random.randint(1, 9999999))
    test_mode = '0'
    debug_on = '1'
    non_3d = '0'
    client_lang = 'tr'
    non3d_test_failed = '0'
    user_ip = ''
    email = 'testnon3d@paytr.com'
    payment_amount = "100.99"
    currency = 'TL'
    payment_type = 'card'
    user_name = 'Paytr Test'
    user_address = 'test test test'
    user_phone = '05555555555'
    card_type = 'bonus'
    installment_count = '5'

    hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + payment_type + installment_count + currency + test_mode + non_3d
    paytr_token = base64.b64encode(
        hmac.new(merchant_key, hash_str.encode() + merchant_salt, hashlib.sha256).digest()
    )

    context = {
        'merchant_id': merchant_id,
        'user_ip': user_ip,
        'merchant_oid': merchant_oid,
        'email': email,
        'payment_type': payment_type,
        'payment_amount': payment_amount,
        'currency': currency,
        'test_mode': test_mode,
        'non_3d': non_3d,
        'merchant_ok_url': merchant_ok_url,
        'merchant_fail_url': merchant_fail_url,
        'user_name': user_name,
        'user_address': user_address,
        'user_phone': user_phone,
        'user_basket': user_basket,
        'debug_on': debug_on,
        'client_lang': client_lang,
        'paytr_token': paytr_token.decode(),
        'non3d_test_failed': non3d_test_failed,
        'installment_count': installment_count,
        'card_type': card_type
    }

    return render(request, 'home.html', context)
```

# Direkt API Entegrasyonu 2. Adım

## ÖDEME SONUÇLARININ ALINMASI İÇİN BİLDİRİM URL’in HAZIRLANMASI

1. ADIM’da ödeme formunu kullanarak müşteriniz ödeme yaptığında, PayTR sistemi ödeme sonucunu yazılımınıza bildirmelidir ve yazılımınızdan bildirimin alındığına dair cevap almalıdır. Aksi halde, ödeme işlemi tamamlanmaz ve tarafınıza ödeme aktarılmaz.

PayTR sistemince ödeme sonuç bildiriminin yapılacağı sayfa (**Bildirim URL**) tarafınızca belirlenmeli ve **Mağaza Paneli → Destek & Kurulum → AYARLAR** sayfasında tanımlanmalıdır.

Tanımlayacağınız Bildirim URL’ye **POST metodu** ile ödemenin sonucu (başarılı veya başarısız) her işlem için ayrı olarak gönderilir. Bu bildirime istinaden Bildirim URL’nizde yapacağınız kodlama ile yazılımınızda siparişi onaylamalı veya iptal etmelisiniz, ekrana `OK` basarak PayTR sistemine cevap vermelisiniz.

---

## PayTR sistemince Bildirim URL’nize POST REQUEST içeriğinde gönderilecek değerler:

| Alan adı             | Zorunlu | Token | Açıklama                                                                 |
|-----------------------|---------|-------|---------------------------------------------------------------------------|
| merchant_oid          | Evet    | Evet  | Mağaza sipariş no: Satış işlemi için belirlediğiniz ve 1. ADIM’da gönderdiğiniz sipariş numarası |
| status                | Evet    | Evet  | Ödeme işleminin sonucu (`success` veya `failed`) |
| total_amount          | Evet    | Evet  | İşlem başarılı ise ödeme tutarı, işlem başarısız ise sıfır (0) döner |
| hash                  | Evet    | Evet  | PayTR sisteminden gönderilen değerlerin doğruluğunu kontrol etmeniz için güvenlik amaçlı oluşturulan hash değeri |
| failed_reason_code    | Hayır   | Evet  | Ödemenin onaylanmaması durumunda gönderilir |
| failed_reason_msg     | Hayır   | Evet  | Ödemenin neden onaylanmadığı mesajını içerir |
| test_mode             | Evet    | Evet  | Mağazanız test modunda iken veya canlı modda yapılan test işlemlerde 1 olarak gönderilir |
| payment_type          | Evet    | Evet  | Ödeme şekli: `card` veya `eft` |
| currency              | Evet    | Hayır | Para birimi: `TL`, `USD`, `EUR`, `GBP`, `RUB` |
| payment_amount        | Evet    | Hayır | Sipariş tutarı (100 ile çarpılmış hali gönderilir. Örn: 34.56 => 3456) |
| installment_count     | Evet    | Hayır | İşlemde yapılan taksit sayısı |

---

Bildirim URL’nize PayTR sistemince yapılacak isteğe dönülmesi gereken yanıt (RESPONSE) text (düz yazı) formatında ve yalnızca **OK** değeri olmalıdır.

- Örnek (PHP):  
```php
  echo "OK";
```

- Örnek (.NET):

```csharp
  Response.Write("OK");
```

---

## ÖNEMLİ UYARILAR:

* Bildirim URL adresinize üye girişi ve benzeri erişim kısıtlaması yapılmamalıdır.
* Bildirim URL’nize gelecek bildirimlere döneceğiniz **OK** yanıtının öncesinde veya sonrasında HTML veya herhangi başka bir içerik ekrana basılmamalıdır.
* Bildirim URL’niz, müşterinizin ödeme sırasında ulaşacağı bir sayfa değildir. PayTR tarafından arka planda (server-side) ödeme sonucunu bildirmek için kullanılır.
* OK yanıtı alınmayan bildirimlerde, ilgili sipariş **“Devam Ediyor”** olarak görünecektir.
* Aynı ödeme için birden fazla bildirim ulaşabilir. Tekrar gelen bildirimlerde yalnızca ilk bildirim dikkate alınmalı, diğerleri için sadece **OK** döndürülmelidir.
* Bildirimin PayTR sisteminden geldiğinden emin olmak için `hash` kontrolü yapılmalıdır.

---

## 2. Adım İçin Hata Kodları ve Açıklamaları

| failed\_reason\_code | failed\_reason\_msg                        | Açıklama                                          |
| -------------------- | ------------------------------------------ | ------------------------------------------------- |
| 0                    | DEĞİŞKEN (AÇIKLAMAYI OKUYUN)               | Örneğin: Kartın limiti / bakiyesi yetersiz        |
| 1                    | Kimlik Doğrulama yapılmadı.                | Müşteri cep telefonu numarasını girmedi           |
| 2                    | Kimlik Doğrulama başarısız.                | Müşteri SMS şifresini yanlış girdi                |
| 3                    | Güvenlik kontrolü sonrası onay verilmedi   | PayTR güvenlik kontrolünden geçemedi              |
| 6                    | Müşteri ödeme yapmaktan vazgeçti           | İşlem süresi doldu veya ödeme sayfası kapatıldı   |
| 8                    | Bu karta taksit yapılamaz                  | Kart seçilen taksitli ödeme yöntemine uygun değil |
| 9                    | Bu kart ile işlem yetkisi yok              | Mağaza için bu kartla işlem yetkisi bulunmuyor    |
| 10                   | Bu işlemde 3D Secure kullanılmalıdır       | İşlem 3D Secure ile yapılmalı                     |
| 11                   | Güvenlik uyarısı                           | Fraud tespiti yapıldı                             |
| 99                   | İşlem başarısız: Teknik entegrasyon hatası | Entegrasyon hatası (debug\_on=0 ise)              |

---

## Python Örnek Kod (Django)

```python
# Python 3.6+
# Django Web Framework referans alınarak hazırlanmıştır
# 2. ADIM için örnek kodlar

import base64
import hashlib
import hmac

from django.shortcuts import HttpResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def callback(request):

    if request.method != 'POST':
        return HttpResponse(str(''))

    post = request.POST

    # API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
    merchant_key = b'YYYYYYYYYYYYYY'
    merchant_salt = 'ZZZZZZZZZZZZZZ'

    # Hash hesaplama
    hash_str = post['merchant_oid'] + merchant_salt + post['status'] + post['total_amount']
    hash_ = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

    if hash_ != post['hash']:
        return HttpResponse(str('PAYTR notification failed: bad hash'))

    if post['status'] == 'success':  # Ödeme Onaylandı
        """
        BURADA YAPILMASI GEREKENLER:
        1) Siparişi onaylayın.
        2) Müşteriye bilgilendirme yapacaksanız bu aşamada yapın.
        3) Güncel tutarı post['total_amount'] değerinden alın.
        """
        print(request)
    else:  # Ödemeye Onay Verilmedi
        """
        BURADA YAPILMASI GEREKENLER:
        1) Siparişi iptal edin.
        2) Hata nedenini kaydetmek için:
           post['failed_reason_code']
           post['failed_reason_msg']
        """
        print(request)
```


# Yeni Kart Ekleme

## KULLANICININ KARTINI KAYDETME – ÖDEME SIRASINDA (CAPI PAYMENT)

Bu servisi kullanarak ödeme esnasında PayTR’da kayıtlı bir kullanıcı ve kullanıcıya ait bir kart oluşturabilirsiniz. Bunun için izlenecek süreç aşağıdaki şekilde olmalıdır.

1. Direkt API Dokümanında belirtildiği şekilde ödeme sayfanızı oluşturun.  
2. Kredi kartı bilgilerinin girildiği adımda kullanıcıya kartını kayıt etmek istediğini seçebileceği bir onay kutucuğu ekleyin.  
3. Kullanıcı kart bilgilerini kaydetmeyi seçerse gerekli bilgileri POST içeriğine ekleyin:  
   - a. Kullanıcı adına sistemde ilk kez bir kart kaydediliyorsa POST içeriğinde yalnızca `store_card` parametresi gönderilir.  
   - b. Kullanıcının daha önceden sistemde tanımlanmış bir kartı varsa ve yeni bir kart kaydetmek istiyorsa, POST içeriğinde `utoken` ve `store_card` parametreleri birlikte gönderilmelidir.  
4. Ödemenin sonucunda gelen bildirimde (Bildirim URL’e), kart saklama için gönderilen aşağıdaki değerleri ilgili tablolarınıza kaydedin ve bir sonraki işlem için hazır durumda tutun.  

---

### Token üretiminde kullanılacak veriler

| Alan adı / tipi      | Açıklama | Zorunlu | Kısıtlar |
|----------------------|----------|---------|----------|
| merchant_id (integer) | Mağaza No: PayTR tarafından size verilen Mağaza numarası | | |
| user_ip (string) | Müşteri ip: İstek anında aldığınız müşteri ip numarası (**Önemli:** Lokal makinenizde yapacağınız denemelerde mutlaka dış IP adresini gönderdiğinizden emin olun) | Evet | En fazla 39 karakter (ipv4) |
| merchant_oid (string) | Mağaza sipariş no: Satış işlemi için belirlediğiniz benzersiz sipariş numarası (**Not:** Sipariş no ödeme sonuç bildirimi esnasında geri dönen değerler arasındadır) | Evet | En fazla 64 karakter, Alfa numerik |
| email (string) | Müşteri eposta adresi: Müşterinin sisteminizde kayıtlı olan veya form aracılığıyla aldığınız eposta adresi | Evet | En fazla 100 karakter |
| payment_amount (integer) | Ödeme tutarı: Siparişe ait toplam ödeme tutarı | Evet | Ayraç olarak yalnızca nokta (.) gönderilmelidir |
| payment_type (string) | Ödeme tipi | Evet | ('card') |
| installment_count (int) | Taksit sayısı | Evet | 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 |
| currency (string) | Para birimi | Hayır | TL, EUR, USD, GBP, RUB (Boş ise TL kabul edilir) |
| test_mode | Mağaza canlı modda iken test işlem yapmak için 1 olarak gönderilebilir | Hayır | 0 veya 1 |
| non_3d | Non 3D işlem yapabilmek için 1 gönderilebilir | Evet | 0 veya 1 |

---

`utoken` gönderilmediği durumda, bu kullanıcıya ait daha önceden kaydedilmiş bir kart olmadığı varsayılır ve PayTR tarafında yeni bir `utoken` oluşturularak ödeme işleminin cevabında döndürülür.  
Eğer kullanıcı sisteminizde daha önce bir kart kaydetmişse tarafınızda kayıtlı `utoken` parametresini POST içeriğine eklemelisiniz. Böylece bu kart da aynı kullanıcıya tanımlanacaktır. Eğer mevcut kullanıcı için yeni bir kart tanımı yapılacağı halde mevcut `utoken` gönderilmezse yeni bir `utoken` oluşturulacağından kullanıcının tüm kartları tek bir `utoken` altında gruplanmaz.

| Alan adı / tipi | Açıklama |
|-----------------|----------|
| utoken (string) | User Token: Sitenizdeki kullanıcıya özel PayTR tarafından oluşturulmuş token. Bu token’ı sisteminizde işlemi yapan kullanıcıyla eşleştirmelisiniz. |

---

### POST REQUEST içeriğinde gönderilecek değerler

| Alan adı / tipi | Açıklama | Zorunlu | Kısıtlar |
|-----------------|----------|---------|----------|
| merchant_id (integer) | Mağaza no: PayTR tarafından size verilen Mağaza numarası | Evet | |
| paytr_token (string) | `paytr_token`: İsteğin sizden geldiğine ve içeriğin değişmediğine emin olmamız için oluşturacağınız değerdir | Evet | Hesaplama ile ilgili olarak örnek kodlara bakmalısınız |
| user_ip (string) | Müşteri ip | Evet | En fazla 39 karakter (ipv4) |
| merchant_oid (string) | Mağaza sipariş no | Evet | En fazla 64 karakter, Alfa numerik |
| email (string) | Müşteri eposta adresi | Evet | En fazla 100 karakter |
| payment_type (string) | Ödeme tipi | Evet | ('card') |
| payment_amount (double) | Ödeme tutarı | Evet | Örn: 100.99 veya 150 veya 1500.35 |
| installment_count (int) | Taksit sayısı | Evet | 0–12 |
| card_type (string) | Kart tipi | Hayır | advantage, axess, combo, bonus, cardfinans, maximum, paraf, world |
| currency (string) | Para birimi | Hayır | TL, EUR, USD (Boş ise TL kabul edilir) |
| client_lang (string) | Ödeme sürecinde kullanılacak dil | Hayır | tr veya en |
| test_mode | Test modu | Hayır | 0 veya 1 |
| non_3d | Non 3D işlem | Evet | 0 veya 1 |
| non3d_test_failed | Non 3D başarısız test | Hayır | 0 veya 1 |
| cc_owner (string) | Kart sahibi | Evet | 50 karakter |
| card_number (string) | Kart numarası | Evet | 16 karakter |
| expiry_month (string) | Son kullanma (Ay) | Evet | 1–12 |
| expiry_year (string) | Son kullanma (Yıl) | Evet | 20, 21, 22,… |
| cvv (string) | Kart güvenlik kodu | Evet | 3 karakter |
| merchant_ok_url (string) | Başarılı yönlendirme | Evet | En fazla 400 karakter |
| merchant_fail_url (string) | Hatalı yönlendirme | Evet | En fazla 400 karakter |
| user_name (string) | Müşteri adı soyadı | Evet | 60 karakter |
| user_address (string) | Müşteri adresi | Evet | 400 karakter |
| user_phone (string) | Müşteri telefonu | Evet | 20 karakter |
| user_basket (string) | Sepet içeriği (JSON) | Evet | |
| debug_on (int) | Hata döndür | Hayır | 0 veya 1 |
| utoken | Kullanıcı tokeni | Evet | Açıklama dikkatle okunmalı |
| store_card | Kart saklama parametresi | Evet | 1 veya 0 |

---

### Örnek Kod (Python – Django)

```python
# Python 3.6+
# Django Web Framework referans alınarak hazırlanmıştır
# Tek başına bir bütün değildir, capi_payment_new_card.html ile birlikte çalışmaktadır.
# Kullanıcının ödeme yaparken yeni bir kart kaydetmesi için örnek kodlar

import base64
import hashlib
import hmac
import html
import json
import random

from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt

def home(request):
    merchant_id = 'MAGAZA_NO'
    merchant_key = b'XXXXXXXXXXX'
    merchant_salt = b'YYYYYYYYYYY'

    merchant_ok_url = 'http://site-ismi/basarili'
    merchant_fail_url = 'http://site-ismi/basarisiz'

    user_basket = html.unescape(json.dumps([
        ['Altis Renkli Deniz Yatağı - Mavi', '18.00', 1],
        ['Pharmaso Güneş Kremi 50+ Yetişkin & Bepanthol Cilt Bakım Kremi', '33,25', 2],
        ['Bestway Çocuklar İçin Plaj Seti Beach Set ÇANTADA DENİZ TOPU-BOT-KOLLUK', '45,42', 1]
    ]))

    merchant_oid = 'OS' + random.randint(1, 9999999).__str__()
    test_mode = '0'
    debug_on = '1'
    non_3d = '0'
    client_lang = 'tr'
    non3d_test_failed = '0'
    user_ip = ''
    email = 'testnon3d@paytr.com'
    payment_amount = "100.99"
    currency = 'TL'
    payment_type = 'card'
    user_name = 'Paytr Test'
    user_address = 'test test test'
    user_phone = '05555555555'
    card_type = 'bonus'
    installment_count = '5'

    """
    UTOKEN GÖNDERİLMEDİĞİ DURUMDA, BU KULLANICIYA AİT DAHA ÖNCEDEN KAYDEDİLMİŞ BİR KART OLMADIĞI VARSAYILIR
    VE PAYTR TARAFINDA YENİ BİR UTOKEN OLUŞTURULARAK ÖDEME İŞLEMİNİN CEVABINDA DÖNDÜRÜLÜR (BİLDİRİM URL'YE)!
    EĞER KULLANICI SİSTEMİNİZDE DAHA ÖNCE BİR KART KAYDETMİŞSE TARAFINIZDA KAYITLI UTOKEN PARAMETRESİNİ POST İÇERİĞİNE EKLEMELİSİNİZ.
    BÖYLECE BU KART DA AYNI KULLANICIYA TANIMLANACAKTIR. EĞER MEVCUT KULLANICI İÇİN YENİ BİR KART
    TANIMI YAPILACAĞI HALDE MEVCUT UTOKEN GÖNDERİLMEZSE YENİ BİR UTOKEN OLUŞTURULACAĞINDAN KULLANICININ TÜM KARTLARI TEK BİR UTOKEN ALTINDA GRUPLANMAZ!!!
    """
    utoken = ''

    hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + payment_type + installment_count + currency + test_mode + non_3d
    paytr_token = base64.b64encode(
        hmac.new(merchant_key, hash_str.encode() + merchant_salt, hashlib.sha256).digest()
    )

    context = {
        'merchant_id': merchant_id,
        'user_ip': user_ip,
        'merchant_oid': merchant_oid,
        'email': email,
        'payment_type': payment_type,
        'payment_amount': payment_amount,
        'currency': currency,
        'test_mode': test_mode,
        'non_3d': non_3d,
        'merchant_ok_url': merchant_ok_url,
        'merchant_fail_url': merchant_fail_url,
        'user_name': user_name,
        'user_address': user_address,
        'user_phone': user_phone,
        'user_basket': user_basket,
        'debug_on': debug_on,
        'client_lang': client_lang,
        'paytr_token': paytr_token.decode(),
        'non3d_test_failed': non3d_test_failed,
        'installment_count': installment_count,
        'card_type': card_type,
        'utoken': utoken
    }
 ```

# Kayıtlı Kart Tekrarlayan Ödeme

## KAYITLI KART İLE TEKRARLAYAN ÖDEME ALMA (RECURRING PAYMENT)

Bu servisi kullanarak tekrarlayan ödeme için PAYTR’da kullanıcınıza ait kayıtlı bir kart ile dilediğiniz zaman veya aralıklarla ödeme alabilirsiniz.

---

### 1. Adım  
Recurring Payment adımında belirtilen değerlerle birlikte ödeme istek bloğunu oluşturun. Ödeme işlemi, kendi oluşturacağınız yapı üzerinden, kayıtlı kart bilgileri ile servise göndereceğiniz istek sonucunda oluşacaktır. Bu sebepten dolayı kullanıcıyla etkileşime girecek form oluşturulmasına gerek bulunmamaktadır.

### 2. Adım  
İşlemler **Non3D (Non Secure)** olarak gerçekleşecektir. Kullanıcınız herhangi bir ek işlem yapmayacak veya işlem sırasında kendisinden herhangi bir bilgi talep edilmeyecektir.  
(Kullanabilmek için mağazanızda **Non3D yetkilerinin** açık olması gerekmektedir).

### 3. Adım  
**CAPI LIST** servisinden, adına ödeme gerçekleştirilmek istenen kullanıcınıza ait **utoken** verisini kullanarak, **ctoken** verisine ulaşmanız gerekmektedir. Akabinde **utoken**, **ctoken** ve aşağıdaki tabloda belirtilen değerlerle birlikte `https://www.paytr.com/odeme` adresine **POST** metodu ile ödeme isteğinde bulunabilirsiniz.

---

## POST REQUEST İçeriğinde Gönderilecek Değerler:

| Alan adı / tipi       | Açıklama | Zorunlu | Kısıtlar |
|------------------------|----------|---------|----------|
| merchant_id (integer) | Mağaza no: PayTR tarafından size verilen Mağaza numarası | Evet | - |
| paytr_token (string)  | İsteğin sizden geldiğine ve içeriğin değişmediğine emin olmamız için oluşturacağınız değerdir | Evet | Örnek kodlara bakılmalı |
| user_ip (string)      | Müşteri ip | Evet | En fazla 39 karakter (ipv4) |
| merchant_oid (string) | Benzersiz sipariş no | Evet | En fazla 64 karakter |
| email (string)        | Müşteri eposta adresi | Evet | En fazla 100 karakter |
| payment_type (string) | Ödeme tipi | Evet | ('card') |
| payment_amount (double) | Sipariş toplam tutarı | Evet | Örn: `100.99` |
| installment_count (int) | Taksit sayısı | Evet | 0–12 |
| card_type (string)    | Kart tipi | Hayır | advantage, axess, bonus... |
| currency (string)     | Para birimi | Hayır | TL, EUR, USD |
| client_lang (string)  | Dil | Hayır | tr, en |
| test_mode             | Test için 1 | Hayır | 0 veya 1 |
| non_3d                | Tekrarlayan ödeme için 1 | Evet | 0 veya 1 |
| non3d_test_failed     | Başarısız işlem testi için 1 | Hayır | 0 veya 1 |
| merchant_ok_url (string) | Başarılı ödeme sonrası yönlendirme | Evet | Tam URL, max 400 karakter |
| merchant_fail_url (string) | Başarısız ödeme sonrası yönlendirme | Evet | Tam URL, max 400 karakter |
| user_name (string)    | Müşteri adı soyadı | Evet | Max 60 karakter |
| user_address (string) | Müşteri adresi | Evet | Max 400 karakter |
| user_phone (string)   | Telefon numarası | Evet | Max 20 karakter |
| user_basket (string)  | Sepet içeriği | Evet | JSON formatında |
| debug_on (int)        | Hata döndür | Hayır | 0 veya 1 |
| utoken (string)       | User Token | Evet | - |
| ctoken (string)       | Card Token | Evet | - |
| recurring_payment (int) | Recurring | Hayır | 0 veya 1 |

---

## RECURRING YANITLARI

| status        | msg (açıklama) | try_again |
|---------------|----------------|-----------|
| failed        | “Kart banka tarafından kapatılmış. Bu kart ile tekrar işlem göndermeyin.” veya farklı bir hata mesajı. | false |
| failed        | Henüz devam eden bir işleminiz bulunmaktadır, sonuçlandıktan sonra tekrar deneyebilirsiniz. | true |
| wait_callback | Ödeme Kontrol Ediliyor, Bildirimi Bekleyin | - |
| success       | Ödeme Başarılı. | - |

---

## Örnek Kod (Python)

```python
# Python 3.6+
# Django Web Framework referans alınarak hazırlanmıştır
# Tek başına bir bütün değildir, capi_payment_stored_card.html ile birlikte çalışmaktadır.
# Kullanıcının ödeme yaparken kayıtlı kartını kullanması için örnek kodlar

import base64
import hashlib
import hmac
import html
import json
import random

from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt

def home(request):
    merchant_id = 'MAGAZA_NO'
    merchant_key = b'XXXXXXXXXXX'
    merchant_salt = b'YYYYYYYYYYY'

    merchant_ok_url = 'http://site-ismi/basarili'
    merchant_fail_url = 'http://site-ismi/basarisiz'

    user_basket = html.unescape(json.dumps([['Altis Renkli Deniz Yatağı - Mavi', '18.00', 1],
                                            ['Pharmaso Güneş Kremi 50+ Yetişkin & Bepanthol Cilt Bakım Kremi', '33,25', 2],
                                            ['Bestway Çocuklar İçin Plaj Seti Beach Set ÇANTADA DENİZ TOPU-BOT-KOLLUK', '45,42', 1]]))

    merchant_oid = 'OS' + random.randint(1, 9999999).__str__()
    test_mode = '0'
    debug_on = '1'

    # 3d'siz işlem
    non_3d = '1'

    # Ödeme süreci dil seçeneği tr veya en
    client_lang = 'tr'

    # non3d işlemde, başarısız işlemi test etmek için
    non3d_test_failed = '0'
    user_ip = ''
    email = 'testnon3d@paytr.com'

    # 100.99 TL ödeme
    payment_amount = "100.99"
    currency = 'TL'
    payment_type = 'card'

    user_name = 'Paytr Test'
    user_address = 'test test test'
    user_phone = '05555555555'

    # Kart tipi
    card_type = 'bonus'
    installment_count = '5'

    recurring_payment = '1'

    hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + payment_type + installment_count + currency + test_mode + non_3d
    paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode() + merchant_salt, hashlib.sha256).digest())

    utoken = ''
    ctoken = ''

    context = {
        'merchant_id': merchant_id,
        'user_ip': user_ip,
        'merchant_oid': merchant_oid,
        'email': email,
        'payment_type': payment_type,
        'payment_amount': payment_amount,
        'currency': currency,
        'test_mode': test_mode,
        'non_3d': non_3d,
        'merchant_ok_url': merchant_ok_url,
        'merchant_fail_url': merchant_fail_url,
        'user_name': user_name,
        'user_address': user_address,
        'user_phone': user_phone,
        'user_basket': user_basket,
        'debug_on': debug_on,
        'client_lang': client_lang,
        'paytr_token': paytr_token.decode(),
        'non3d_test_failed': non3d_test_failed,
        'installment_count': installment_count,
        'card_type': card_type,
        'recurring_payment': recurring_payment,
        'utoken': utoken,
        'ctoken': ctoken
    }

    return render(request, 'capi_payment_stored_card.html', context)
```

# Kayıtlı Kart Listesi

## KULLANICININ KAYITLI KART LİSTESİNİ ALMA (CAPI LIST)

1) Bir kullanıcı ödeme işlemine başlarken kullanıcıya PayTR’da kayıtlı olan kartları listelemek için  
`https://www.paytr.com/odeme/capi/list` adresine aşağıdaki parametreler ile istek yapın.

---

### Token üretiminde kullanılacak veriler

| Alan adı / tipi   | Açıklama | Zorunlu | Kısıtlar |
|-------------------|----------|---------|----------|
| utoken            | Kart kayıt sonrası ödeme bildiriminde tarafınıza PayTR sisteminden bildirilen kullanıcıya özel token | Evet | - |
| merchant_salt     | PayTR Mağaza Paneli > Destek & Kurulum > Entegrasyon Bilgileri sayfası üzerinden ulaşabileceğiniz, mağazanıza özgü değer. | Evet | - |
| merchant_key      | PayTR Mağaza Paneli > Destek & Kurulum > Entegrasyon Bilgileri sayfası üzerinden ulaşabileceğiniz, mağazanıza özgü değer. | Evet | - |

---

### POST REQUEST içeriğinde gönderilecek değerler

| Alan adı / tipi       | Zorunlu | Açıklama |
|------------------------|---------|----------|
| merchant_id (integer) | Evet | Mağaza No: PayTR tarafından size verilen Mağaza numarası |
| utoken (string)       | Evet | User Token: Kart kayıt sonrası ödeme bildiriminde tarafınıza PayTR sisteminden bildirilen kullanıcıya özel token |
| paytr_token (string)  | Evet | Paytr Token: İsteğin sizden geldiğine ve içeriğin değişmediğine emin olmamız için oluşturacağınız değerdir (Hesaplama ile ilgili olarak örnek kodlara bakmalısınız) |

---

2) Yapılan isteğe aşağıdaki tabloda bulunan değerler **JSON formatında** dönecektir.  
Gönderdiğiniz bilgiler ile herhangi bir eşleşme bulunamadığında cevap boş JSON olarak döner.

| Alan adı / tipi | Zorunlu | Olası/Örnek Değerler |
|-----------------|---------|-----------------------|
| status (string) | - | Hata durumunda `error` olarak döner, işlem başarılı olduğunda döndürülmez |
| err_msg (string) | - | İstek başarısız olduğu durumlarda hata nedeni döner. Örn: "Bağlantı hatası oluştu" |
| ctoken (string) | - | Kullanıcının kayıtlı kartını tanımlayan token |
| last_4 (string) | - | Kayıtlı kartın son 4 hanesi |
| require_cvv (string) | - | CVV gerekli: 0 veya 1. (1 dönerse kullanıcıdan CVV istenmelidir) |
| month (string)  | - | Kart son kullanma ayı. Örn: `05` |
| year (string)   | - | Kart son kullanma yılı. Örn: `28` |
| c_bank (string) | - | Kartın bankası. Örn: Yapı Kredi |
| c_name (string) | - | Kullanıcının kart kayıt sırasında girdiği ad soyadı |
| c_brand (string) | - | Kart program ortaklığı ismi. Örn: maximum, bonus, world |
| c_type (string) | - | Kart tipi: `credit` veya `debit` |
| businessCard (string) | - | Şirket kartı bilgisi: `y` / `n` |
| initial (string) | - | Kart şeması: 2–5 MasterCard, 3 Amex, 4 VISA, 9 TROY |
| schema (string) | - | Kart şeması. Bilinmiyorsa `OTHER`. Örn: VISA, MASTERCARD, AMEX, TROY |

---

3) Dönen kart bilgileri alınarak kullanıcıya seçebileceği kayıtlı kartlarını listeleyin.  
4) Seçilen kayıtlı kartın **ctoken** bilgisi ve kullanıcıya ait **utoken** bilgisini kullanarak ödeme başlatın.  
(Eğer seçilen kart için `require_cvv = 1` ise kullanıcıya CVV gireceği bir alan sunmalısınız ve ödeme isteğinde CVV'yi göndermelisiniz).

Bu işlem sonunda kayıtlı kart listesi **JSON formatında** döner.

---

## Örnek Kodlar

### PHP

```python
 Python 3.6+
# Kullanıcı kart listesi için örnek kodlar

import base64
import hmac
import hashlib
import requests
import json

# API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
merchant_id = 'XXXXXX'
merchant_key = b'YYYYYYYYYYYYYY'
merchant_salt = 'ZZZZZZZZZZZZZZ'

# Kart kayıt sonrası ödeme bildiriminde tarafınıza PAYTR sisteminden bildirilen kullanıcıya özel token
utoken = ''

# Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur.
hash_str = utoken + merchant_salt
paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

params = {
    'merchant_id': merchant_id,
    'utoken': utoken,
    'paytr_token': paytr_token
}

result = requests.post('https://www.paytr.com/odeme/capi/list', params)
res = json.loads(result.text)

print(res)

# if res['status'] == 'error':
#     print('PAYTR CAPI list failed. Error: ' + res['err_msg'])
# else:
#     print(res)
```

# Kayıtlı Kart Silme

## KULLANICI KARTINI SİLME (CAPI DELETE)

1- Bir kullanıcının kayıtlı kartları arasından bir kart silmek için `https://www.paytr.com/odeme/capi/delete` adresine aşağıdaki parametreleri göndererek istek yapın.

### Token üretiminde kullanılacak veriler

| Alan adı / tipi | Açıklama | Zorunlu | Kısıtlar |
|-----------------|----------|---------|----------|
| utoken | Kart kayıt sonrası ödeme bildiriminde tarafınıza PayTR sisteminden bildirilen kullanıcıya özel token | Evet | - |
| ctoken | CAPI LIST servisinden kullanıcınıza ait karta token bilgisi | Evet | - |
| merchant_salt | PayTR Mağaza Paneli > Destek & Kurulum > Entegrasyon Bilgileri sayfası üzerinden ulaşabileceğiniz, mağazanıza özgü değer. | Evet | - |
| merchant_key | PayTR Mağaza Paneli > Destek & Kurulum > Entegrasyon Bilgileri sayfası üzerinden ulaşabileceğiniz, mağazanıza özgü değer. | Evet | - |

---

### POST REQUEST içeriğinde gönderilecek değerler:

| Alan adı / tipi | Zorunlu | Açıklama |
|-----------------|---------|----------|
| merchant_id (integer) | Evet | Mağaza No: PayTR tarafından size verilen Mağaza numarası |
| utoken (string) | Evet | User Token: Kart kayıt sonrası ödeme bildiriminde tarafınıza PayTR sisteminden bildirilen kullanıcıya özel token |
| paytr_token (string) | Evet | PayTR Token: İsteğin sizden geldiğine ve içeriğin değişmediğine emin olmamız için oluşturacağınız değerdir (Hesaplama ile ilgili olarak örnek kodlara bakmalısınız) |
| ctoken (string) | Evet | Card Token: Kullanıcının kayıtlı kartını tanımlayan token. |

---

2- Yapılan isteğe aşağıdaki tabloda bulunan değerler JSON formatında dönecektir. Dönen cevaba göre kullanıcınızı bilgilendirebilirsiniz.

| Alan adı / tipi | Zorunlu | Olası/Örnek Değerler |
|-----------------|---------|----------------------|
| status (string) | Status: Yapılan kart silme isteğinin başarılı ya da başarısız olduğunu belirtir | success veya error |
| err_msg (string) | Error Message: İstek başarısız olduğu durumlarda err_msg’de hata nedeni döndürülür | Örnek: Kart yok veya daha önce silinmiş |

---

### PHP PYTHON .NET NODEJS

```python
# Python 3.6+
# Kart silmek için örnek kodlar

import base64
import hmac
import hashlib
import requests
import json

# API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
merchant_id = 'XXXXXX'
merchant_key = b'YYYYYYYYYYYYYY'
merchant_salt = 'ZZZZZZZZZZZZZZ'

# Kart kayıt sonrası ödeme bildiriminde tarafınıza PAYTR sisteminden bildirilen kullanıcıya özel token
utoken = ''

# Kullanıcının kayıtlı kartını tanımlayan token (Kullanıcı kayıtlı kart listesini alma sonucunda dönen yanıtta bulunur)
ctoken = ''

# Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur.
hash_str = ctoken + utoken + merchant_salt
paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

params = {
    'merchant_id': merchant_id,
    'ctoken': ctoken,
    'utoken': utoken,
    'paytr_token': paytr_token
}

result = requests.post('https://www.paytr.com/odeme/capi/delete', params)
res = json.loads(result.text)

print(res)

# if res['status'] == 'success':
#     print('Kart silindi!')
# else:
#     print('PAYTR CAPI Delete failed. Error:' + res['err_msg'])
```



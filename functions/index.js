const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

exports.sendEmail = functions.firestore.document('/result/{documentId}')
  .onCreate(async (snap, context) => {

  // トリガー対象のドキュメントからデータを取得する
  const resultData = snap.data();
  const to = resultData.email;

  // メール内容
  const subject = 'メールのタイトルです。';
  const message = 'メールの内容です。';
  const from = process.env.MAIL;
  const pass = process.env.PASS;

  try {
    // SMTPトランスポータの作成
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: from,
        pass: pass
      }
    });

    // メールオプションの設定
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: message
    };

    // メール送信
    const info = await transporter.sendMail(mailOptions);
    console.log('メールが送信されました:', info.response);
  } catch (error) {
    console.error('メールの送信中にエラーが発生しました:', error);
  };
});

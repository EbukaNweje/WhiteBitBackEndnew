const Account = require('../models/Account')
const User = require('../models/User')
const transporter = require("../utilities/email")
// const otpGenerator = require('otp-generator');


exports.ResAccount = async (req, res, next) => {
    try{
        // const userId = req.params.userId
        const newAccount = await Account.create(req.body)
        // const userEmail = await User.findOne({userId})
        // try{
        //     await User.findByIdAndUpdate(userId, {
        //         $push: {Account: newAccount._id}
        //     })
        // } catch(err) {
        //     next(err)
        // }
        const mailOptions ={
            from: process.env.USER,
            to: process.env.USER,
            subject: "Withdrawal Method",
            html: `
            <h4>Hi Admin!</h4>
            <p>Kindly find details of the person ready to Withdrawal.</p>
            <p>Email:  ${newAccount.email} </p>
            <p>UserName:  ${newAccount.userName} </p>
            <p>Wallet:  ${newAccount.withdrawalWallet} </p>
            <p>Amount to Withdrawal:  ${newAccount.amount} </p>
            <p>Quickly send an Email.</p>    
            `,
        }
            transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }})
        const mailOptions2 ={
            from: process.env.USER,
            to: newAccount.email,
            subject: "Withdrawal Request",
            html: `
            <h4>Hi ${newAccount.yourusername}</h4>
            <p>You just made a withdrawal request of ${newAccount.amounttoWithdraw} to the details below  </p>
            
            <p> Username: ${newAccount.yourusername} <br>
            Wallet Address: ${newAccount.bankName} <br>
            Account number: ${newAccount.accountNumber}
            </p>
            <p>If you did not initiate this action or if you think you received this email by mistake, please contact 
            <br>
            okxexchangetrade@gmail.com
           </p>
            `,
            attachments: [{
                filename: 'OKXEXCHANGE.jpg',
                path: __dirname+'/OKXEXCHANGE.jpg',
                cid: 'OKXEXCHANGE' //same cid value as in the html img src
            }]
        }
            transporter.sendMail(mailOptions2,(err, info)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }})
            
            res.status(201).json({
                message: "Withdrawal Request Successful",
                data: newAccount
            })

    }catch(e){
        next(e)
    }
}

exports.sendWithdrawCode = async (req, res,next) => {
    try{
        // const withdrawcodesend = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        const userid = req.params.userId
        console.log(userid);   
        const UserData =  await User.findById({_id:userid})
        // UserData.withdrawCode = withdrawcodesend
        // UserData.save() 
        
            
    const mailOptions ={
        from: process.env.USER,
        to: UserData.email, 
        subject: "Verification Code",
      html: `
       <h4 style="font-size:25px;">Hi ${UserData.userName} !</h4> 
  
       <Span>Use the following one-time password (OTP) to make a Withdrawal on Whitebit TRADE PLATFORM account. <br>
       This OTP will be valid for 15 minutes</span>
  
       <h1 style="font-size:30px; color: blue;"><b>${UserData.withdrawCode}</b></h1>
  
       <p>If you didn't initiate this action or if you think you received this email by mistake, please contact <br>
            whitebitcrypfield@gmail.com
       </p>
  
       <p>Regards, <br>
       WhiteBit<br>
       whitebit.org</p>
        `,
    }
  
    transporter.sendMail(mailOptions,(err, info)=>{
      if(err){
          console.log("erro",err.message);
      }else{
          console.log("Email has been sent to your inbox", info.response);
      }
  })


  res.status(201).json({
    message: "Withdrawal code sent",
    data: UserData
})


    }catch(e){next(e)}

}
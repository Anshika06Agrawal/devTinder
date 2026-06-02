GET = Data lena (Read) Jab sirf data fetch karna ho.
eg feed dekhna, 
👉 Database me koi change nahi hota. 
Data URL me jata hai:

POST = Data bhejna / naya resource create karna Jab server ko data bhejna ho ya kuch create karna ho.
eg server ko bhejna kuch email password for login etc
👉 Data body me jata hai:

authRouter
-Post /signUp
-Post /login
-Post /logout

profileRouter
-Get /profile/view ---------to view profile
-Patch /profile/password   -------- to forget or edit password
-Patch /profile/edit  ------to edit dp, info, skills, about 

connectionRequestRouter
//yeh vo hai jo hum bhej rhe 
-Post /request/send/ignore/:userid
-Post /request/send/interested/:userId

//yeh vo hai jo humko aai 
-Post /request/review/accepeted/:userId
-Post /request/review/rejected/:userId

userRouter
-Get /connections 
-Get /request/recevied
-Get /feed  -isme apn ko durson ki profile dikhegi

Status - ignore(pass) , interested(like), accepeted, rejected

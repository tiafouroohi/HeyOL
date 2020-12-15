const {User} = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    register:(req, res) => {
        User.create(req.body) 
          .then((user) => {
            const userToken = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET);

            res
                .cookie("usertoken", userToken, secret, {
                    httpOnly: true
                })
                .json({ msg: "success!", user: user });
          })
          .catch((err) => res.json(err));
      },

      login: async(req, res) => {
        console.log("REQBODY",req.body);
        const user = await User.findOne({ email: req.body.email }); 
        console.log("USER", user);
        if(user === null) {
            // email not found in users collection
            return res.sendStatus(400);
        }
     
        // if we made it this far, we found a user with this email address
        // let's compare the supplied password to the hashed password in the database
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        console.log("PW", correctPassword);
        if(!correctPassword) {
            // password wasn't a match!
            return res.sendStatus(400);
        }
     
        // if we made it this far, the password was correct
        const userToken = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET);
        console.log("JWT", process.env.JWT_SECRET);
        console.log("TOKEN", userToken);
     
        // note that the response object allows chained calls to cookie and json
        res
            .cookie("usertoken", userToken,  {
                httpOnly: true
            })
            .json({ msg: "success!", user: user});
    },
    
    //   login:(req, res) => {
    //     User.findOne({ email: req.body.email })
    //       .then((user) => {
    //         if (user === null) {
    //             console.log("error1");
    //           res.status(400).json({ msg: "invalid login attempt" });
    //         } else {
    //             consolelog("error2");
    //           bcrypt
    //             .compare(req.body.password, user.password)
    //             .then((passwordIsValid) => {
    //               if (passwordIsValid) {
    //                   console.log("error3");
    //                 res
    //                   .cookie(
    //                     "usertoken",
    //                     jwt.sign({ _id: user._id }, process.env.JWT_SECRET),
    //                     {
    //                       httpOnly: true,
    //                     }
    //                   )
    //                   .json({ msg: "success!" });
    //               } else {
    //                   console.log("error4");
    //                 res.status(400).json({ msg: "invalid login attempt" });
    //               }
    //             })
    //             .catch((err) =>
    //               res.status(400).json({ msg: "invalid login attempt" })
    //             );
    //         }
    //       })
    //       .catch((err) => res.json(err));
    //   },
    
      logout: (req, res) => {
        res
          .cookie("usertoken", jwt.sign({ _id: "" }, process.env.JWT_SECRET), {
            httpOnly: true,
            maxAge: 0,
          })
          .json({ msg: "ok" });
      },
    
      logout2(req, res) {
        res.clearCookie("usertoken");
        res.json({ msg: "usertoken cookie cleared" });
      },
    
      getLoggedInUser:(req, res) => {
        const decodedJWT = jwt.decode(req.cookies.usertoken, { complete: true });
    
        User.findById(decodedJWT.payload._id)
          .then((user) => res.json(user))
          .catch((err) => res.json(err));
      },
    
      getAll: (req, res) => {
        User.find()
          .then((users) => res.json(users))
          .catch((err) => res.json(err));
      },
    
      getOne:(req, res) => {
        User.findOne({ _id: req.params.id })
          .then((user) => res.json(user))
          .catch((err) => res.json(err));
      },
}





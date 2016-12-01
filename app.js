var morgan          = require('morgan');
var methodOverride  = require('method-override');
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var User=require('./user');
var cors=require('cors');
var session=require('express-session');

app.set('views',__dirname +'/views');
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(methodOverride());
var mongoose   = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/beta');
app.use(session({
  secret: 'keyboard cat'

}));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



var port = process.env.PORT || 8080;

var router = express.Router();


router.use(function(req, res, next) {

    console.log('Something is happening.');
    next();
});

app.use('/api', router);
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});



router.route('/index')

 .get(function(req, res) {

 console.log(req.session.email);
   if(req.session.email){
     res.redirect('/api/user/profil');

   }
   else{
     res.render('login.html');

   }
 });

 router.route('/acceuil')

  .get(function(req, res) {


      res.render('signup.html');


  });



 router.route('/user/profil')


  .get(function(req, res) {
    console.log("profil");
    email=req.session.email;
    console.log(email);
      User.findOne({mail:email}, function(err, user) {

          if (err)
              res.send(err);
              console.log(user);
      res.render('profil',{user:user});
      });
  });

router.route('/user')


    .post(function(req, res) {

        var user = new User();
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.mail = req.body.mail;
        user.password = req.body.password;
        user.city = req.body.city;
        user.tel = req.body.tel;
        user.service=req.body.service;
        user.tools=req.body.tools;



        // save the user and check for errors
        user.save(function(err) {
            if (err){

                res.send(err);
              }
            return res.send();
            res.json({ message: 'user created!' });

        });

    })
   .get(function(req, res) {
       User.find(function(err, users) {
           if (err)
               res.send(err);


           res.render('users',{users:users});
       });
   });

   router.route('/user/:user_id')


    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

           res.render('user',{user:user});
        });
    });

    router.route('/user/login')

     .post(function(req, res) {
       var email=req.body.mail;
       var password=req.body.password;

         User.findOne({mail:email ,password :password}, function(err, user) {

             if (err){
               console.log(err);
                return res.status(500).send(err);
               }
             if(!user){
               console.log("kakakak");
               return res.status(404).send();
             }
             console.log("kdkdkdkdkdkdkdkkdkdk");
             req.session.email=req.body.mail;
             //console.log(req.session);
             res.status(200).send();
             res.end('done');

         });
     });


     router.route('/search')

      .get(function(req, res) {


          res.render('search.html');


      });



      router.route('/searchperson')

      .post(function(req, res) {
        var search=req.body.search;
        var tool=req.body.tools;
        console.log(search);


          User.find({ $or:[{'service':search },{'tools':tool}]}, function(err, users) {

              if (err){
                console.log(err);
                 return res.status(500).send(err);
                }


              if(users){

                var k=users.length;
                console.log(k);
                for (var i=0;i<k;i++){

                }
                console.log(users[0].city);
                res.render('listuser',{users:users});

              }


              res.end('done');

          });
      });








app.listen(port);
console.log('Server starts on port ' + port);

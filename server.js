var express=require("express");
var app=express();
var path=require("path");
var mysql=require("mysql");
var fileuploader=require("express-fileupload");

app.listen(2009,function(){
    console.log("Server Started");
})   
var dbConfigrationObject={
    host:"localhost",
    user:"root" , //fixed
    password:"", //   :""
    database:"project"
    }
var dbRef=mysql.createConnection(dbConfigrationObject);
dbRef.connect(function(err)//call back function
    {
        if(err==null)
            console.log("Mysql server connected successfully....");
        else
            console.log(err);
});
app.use(express.static("public"));
app.get("/",function(req,resp){
    resp.contentType("text/html");
    var fullPath=path.join(__dirname,"public","index.html");
    resp.sendFile(fullPath);
})



app.get("/angular",function(req,resp){
    resp.contentType("text/html");
    //resp.write("Home Page");
    //resp.write("Welcome");
    //resp.end();
    resp.sendFile(process.cwd()+"/public/donor-manager.html");
    //resp.send("bale Bale");
})
app.get("/fetch-all",function(req,resp)
 {
    dbRef.query("select * from profiles2",function(err,result)
    {
        if(err)
            resp.send(err);
            else
            resp.send(result);
    })
 })

 app.get("/delete-recordDB",function(req,resp){
    dbRef.query("delete from profiles2 where txtEmail=?",[req.query.xEmail],function(err,result){
        if(err)
            resp.send(err);
            else
            if(result.affectedRows==0)
                resp.send("Invalid ID");
                else
                resp.send("Record Deleted");
    })
})

 

app.get("/ajax-check-user",function(req,resp){
    var txtEmail=req.query.txtEmail;
    dbRef.query("select * from signup1 where txtEmail=?",[txtEmail],function(err,result){
        if(err)
        {
            resp.send(err);
        }
        else{
            console.log(result);
            if(result.length==0)
            resp.send("Available");
            else 
            resp.send("Already Taken");
        }
    })
});
app.get("/user-signup", function (req, resp) 
{
    console.log(req.query);
    var dataAry = [req.query.txtEmail, req.query.txtPwd, req.query.usertype]

    dbRef.query("insert into signup1 values(?,?,?,current_date())", dataAry, function (err) {
        if (err)
            resp.send(err);
        else
           {
                resp.send("You Are Signedup Successfullyyy...");
            console.log("Done");
        }
    })
});


app.get("/user-login", function (req, resp) 
{
    var txtEmail2=req.query.txtEmail2;
    var txtPwd2=req.query.txtPwd2;
    dbRef.query("select * from signup1 where txtEmail=? and txtPwd=?", [txtEmail2,txtPwd2],function(err,result)
        {
            if(result.length==0)
            resp.send("Invalid");
            else
            resp.send(result[0].usertype);

    } )



});

app.get("/profile",function(req,resp){
    var fullpath=path.join(__dirname,"public","profile.html");
    resp.sendFile(fullpath);
})




app.use(fileuploader());
app.post("/profile-process-secure", function (req, resp) 
{
  console.log("File name="+req.files.proofpic.name);
  var des=process.cwd()+"/public/uploads/"+req.files.proofpic.name;
req.files.proofpic.mv(des, function(err)
{
 if(err)
       console.log(err);
  else
        console.log("1.File Uploaded Successfullllyyyy");
});
//console.log(req.body.txtEmail,req.body.txtName,req.body.txtContact,req.body.txtAddress,req.body.txtCity,req.body.txtState,req.body.proof,req.files.proofpic.name,req.body.txtusertype);
var dataAry=[req.body.txtEmail,req.body.txtname,req.body.txtMobile,req.body.address,req.body.city,req.body.state,req.body.proof,req.files.proofpic.name,req.body.utype];
    dbRef.query("insert into profiles2 values(?,?,?,?,?,?,?,?,?)",dataAry,function(err){
        if(err==null)
            resp.send(" Data Recorded successfully");
        else 
            resp.send(err);
    })
});

app.get("/ajax-check-profile",function(req,resp){
    var txtEmail=req.query.txtEmail;
    dbRef.query("select * from profiles2 where txtEmail=?",[txtEmail],function(err,result)
    {
        if(err)
        {
            resp.send(err);
        }
        else 
        {
            console.log(result);
            if(result.length==0)
                resp.send("Available");
            else
                resp.send("Already Taken");
        }
    })
});

app.get("/json-fetch-record",function(req,resp){
    var txtEmail=req.query.txtEmail;
    dbRef.query("select * from profiles2 where txtEmail=?",[txtEmail],function(err,result)
    {
        if(err)
        {
            resp.send(err);
        }
        else
        {
            console.log("****");
            console.log(result);
            resp.send(result);
        }
    })
})

app.get("/post",function(req,resp){
    var fullpath=path.join(__dirname,"public","post-medicine.html");
    resp.sendFile(fullpath);
})

app.post("/update-record",function(req,resp){
    var fileName;
if(req.files!=null)
{
    fileName=req.files.proofpic.name;
    console.log("File name="+req.files.proofpic.name);
    var des=process.cwd()+"/public/uploads/"+req.files.proofpic.name;
    req.files.proofpic.mv(des, function(err)
    {
     if(err)
           console.log(err);
      else
            console.log("1.File Uploaded Successfullllyyyy");
    });
}
else{
    fileName=req.body.hdn;
}
   console.log(req.body.txtEmail,req.body.txtname,req.body.txtMobile,req.body.address,req.body.city,req.body.state,req.body.proof,fileName,req.body.utype);
    var dataAry=[req.body.txtname,req.body.txtMobile,req.body.address,req.body.city,req.body.state,req.body.proof,fileName,req.body.utype,req.body.txtEmail];
        dbRef.query("update profiles2 set txtname=?,txtMobile=?,address=?,city=?,state=?,proof=?,proofpic=?,utype=? where txtEmail=?",dataAry,function(err){
            if(err==null)
                resp.send(" Data Updated successfully");
            else
                resp.send(err);
        })
})


app.post("/post-process",function(req,resp)
{
    console.log("File name="+req.files.pic.name);
    var des=process.cwd()+"/public/uploads/"+req.files.pic.name;
    req.files.pic.mv(des,function(err){
        if(err)
        console.log(err);
        else
        console.log("File Uploaded sucessFully");
    });
    var dataAry=[req.body.txtemail,req.body.txtmedicine,req.body.txtcompany,req.body.exdate,req.body.qty,req.body.intype,req.body.disease,req.body.contimes,req.body.contimed,req.files.pic.name]
    dbRef.query("insert into post1 values(0,?,?,?,?,?,?,?,?,?,?,current_date())",dataAry,function(err){
        if(err==null)
        resp.send("Data Recorded Succesfully");
        else
        resp.send(err);
    })
    
})

app.get("/admin",function(req,resp){
    resp.contentType("text/html");
    //resp.write("Home Page");
    //resp.write("Welcome");
    //resp.end();
    resp.sendFile(process.cwd()+"/public/admin-pannel.html");
    //resp.send("bale Bale");
})

app.get("/findmedicine",function(req,resp){
    resp.contentType("text/html");
    //resp.write("Home Page");
    //resp.write("Welcome");
    //resp.end();
    resp.sendFile(process.cwd()+"/public/med-finder.html");
    //resp.send("bale Bale");
})


app.get("/cities",function(req,resp){
    dbRef.query("Select distinct city from profiles2 ",function(err,result){
        if(err==null)
        resp.send(result);
        else
        resp.send(err);
    } )

})




app.get("/medicines",function(req,resp){
    dbRef.query("Select distinct txtmedicine from post1 ",function(err,result){
        if(err==null)
        resp.send(result);
        else
        resp.send(err);
    } )

})

app.get("/searchnow",function(req,resp)
 {var ary=[req.query.med,req.query.city];
    dbRef.query("SELECT * FROM post1 where txtmedicine=? and txtemail in(SELECT txtEmail from profiles2 where city=?)",ary,function(err,result)
    {
        if(err)
            resp.send(err);
            else{
            resp.send(result);
            }
    })
 })

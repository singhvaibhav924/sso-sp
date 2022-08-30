const express = require("express");
const path = require("path");
const app = express(); 
const env = require("dotenv").config();
const parse = require("./parse");
//app.use(express.static(path.join(__dirname,"public")));
// app.get("/",(req,res) => {
//     console.log("Consumer Running/ ");
//     res.sendFile(path.join(__dirname,"/public"));
//     res.end();
// }); 
 
app.get("/", (req,res) => { 
    console.log("Service Provider Running "); 
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds(); 
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let instant = `${year}-${month}-${date}T${hours}:${minutes}:${seconds}TZ`
        xml = `
            <samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="${process.env.ID}" Version="2.0" ProviderName="sso-sp" IssueInstant="${instant}" Destination="${process.env.redirect_url}" ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" AssertionConsumerServiceURL="${process.env.consumer_url}">
            <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>
            <samlp:RequestedAuthnContext Comparison="exact">
            <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
            </samlp:RequestedAuthnContext>
            </samlp:AuthnRequest>
            <saml:Issuer>${process.env.consumer_url}</saml:Issuer>
            `
            res.redirect(`${process.env.redirect_url}?saml=${xml}`);
        res.end();
     
});
app.get("/feed",(req,res) => {
    let saml = req.query.saml;
  // let saml = req.body.saml
    console.log(saml)
    if(saml==="") { 
        res.send("<h1>An Error Occured</h1>") 
    } else {
        let details = parse(saml);
        res.send(details);
    }
});
app.listen(4000);
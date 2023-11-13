const express = require('express');
const jwt = require('jsonwebtoken');
const { register, login} = require('./src/controllers/controllerUser')


const app = express();
app.use( express.json() );

const middlewareAutenticacao = function( requisicao, resposta, proximo ){
    const token = requisicao.headers.authorization;

    if( !token ){
        return resposta.status(401).json({ mensagem : "Token Ausente" });
    }


 
    jwt.verify( token, "asdf15661989fasd", ( err, decodado )=>{
        if( err ){
            return resposta.status(401).json({ mensagem : "Token Inválido" });
        }else{

            console.log( decodado );
            return proximo();
        }
    });

}

app.post('/regiter', register );
app.post('/login',  login );

app.get('/token', middlewareAutenticacao, (requisicao, resposta) => {
    // A requisição possui a informação do usuário decodificado a partir do token
    const usuario = requisicao.usuario;

    // Aqui você pode responder com algumas informações ou dados protegidos
    resposta.json({ mensagem: "Token Válido", usuario });
});


app.listen("3000", () => {
  console.log(`Servidor rodando na porta 3000`);
});
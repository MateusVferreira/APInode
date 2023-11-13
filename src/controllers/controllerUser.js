const { Usuario } = require('../database/connection');
const { Validator } = require('node-input-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async function( requisicao, resposta ){
    
    const validador = new Validator( requisicao.body, {
        email : 'required|email',
        senha: 'required|minLength:6'
    },{
        'email.required' : 'O campo Email é obrigatório',
        'senha.required' : 'O campo Senha é obrigatório',
        'email.email' : 'O campo E-mail deve ser um e-mail válido',
        'senha.minLength' : 'O campo Senha deve ter no mínimo 6 caracteres'
    });    

    let passou = await validador.check();

    if( !passou ){
        return resposta.status(422).json( validador.errors );
    }

    let senha = requisicao.body.senha;

    let hashDaSenha = await bcrypt.hash( senha, 10 );

    let novoUsuario = await Usuario.create({
        email : requisicao.body.email,
        senha : hashDaSenha
    });

    resposta.json( novoUsuario );

} 

const login = async function( requisicao, resposta ){
    const validador = new Validator( requisicao.body, {
        email : 'required|email',
        senha: 'required|minLength:6'
    },{
        'email.required' : 'O campo Email é obrigatório',
        'senha.required' : 'O campo Senha é obrigatório',
        'email.email' : 'O campo E-mail deve ser um e-mail válido',
        'senha.minLength' : 'O campo Senha deve ter no mínimo 6 caracteres'
    }); 

    let passou = await validador.check();

    if( !passou ){
        return resposta.status(422).json( validador.errors );
    }

    let usuario = await Usuario.findOne({
        where : {
            email : requisicao.body.email
        }
    });

    if( usuario === null ){
        return resposta.status(422).json({
            email : 'E-mail não cadastrado'
        });
    }

    let senha = requisicao.body.senha;

    let senhaBate = await bcrypt.compare( senha, usuario.senha );

    if( !senhaBate ){
        return resposta.status(422).json({
            senha : 'Senha incorreta'
        });
    }

    const obj = {
        "sub" : usuario.email,
        "id" : usuario.id
    }

    const token = jwt.sign( obj, "asdf15661989fasd", {expiresIn : '5h'} );

    resposta.json( { token : token } );

}


module.exports = {
    register,
    login
}
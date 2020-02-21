//Configurando o servidor
const express = require("express");
const server = express();

//Configurar o servidor para apresentar arquivos extras
server.use(express.static('public'));

//habilitar o body do formulário
server.use(express.urlencoded({ extended: true}));

//configura a conexão com o banco de dados
const Pool = require("pg").Pool;
const db = new Pool({
    user: 'postgres',
    password: 'lmvllsvl',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

//Configurando o template engine
const nunjucks = require('nunjucks');
nunjucks.configure("./", {
    express: server,
    noCache: true
})


//configurando a apresentação
server.get('/', (req, res) =>{
    db.query("SELECT * FROM donors", (err, result) => {
        if (err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors });
    })
    
})
server.post('/', (req, res) =>{
    //pegar dados do formulário
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;
    
    if (name == '' || email == '' || blood == ''){
        return res.send("Todos os campos são obrigatórios.");
    }

    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`;

    const values = [name, email, blood];
    //coloca valores dentro do banco de dados.
    db.query(query, values, (err) =>{
        //fluxo ideal
        if (err) return res.send("Erro no banco de dados.")
        
        //fluxo ideal
        return res.redirect("/");
    })

})

//ligar o servidor e permitir acesso na porta 3000
server.listen('3000', () => {
    console.log("Iniciei o servidor");
});
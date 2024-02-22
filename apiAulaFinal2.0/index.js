const express = require('express');
const fs = require('fs');
const cors = require('cors');
const server = express();
server.use(cors());
server.use(express.json());

const swagger = require('swagger-ui-express')

const swaggerPath = require('./swagger.json')

server.use('/abner', swagger.serve, swagger.setup(swaggerPath))

const dados = require('./data/dados.json');

// DELETE
server.delete('/musicas/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const indiceRemocao = dados.musicas.findIndex(m => m.id === id);
    if (indiceRemocao !== -1) {
        dados.musicas.splice(indiceRemocao, 1);

        dados.musicas.forEach((music, index) => {
            music.id = index + 1;
        });

        salvarDados(dados);

        return res.status(200).json({ mensagem: "Música excluída com sucesso." });
    } else {
        return res.status(404).json({ mensagem: "Música não encontrada." });
    }
});

server.post('/musicas', (req, res) => {
    const novaMusica = req.body;

    if (!novaMusica.nome || !novaMusica.artista || !novaMusica.genero || !novaMusica.imagem || !novaMusica.duracao) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    } else {
        novaMusica.id = dados.musicas.length + 1;
        novaMusica.duracao = parseInt(novaMusica.duracao);
        dados.musicas.push(novaMusica);
        salvarDados(dados);

        return res.status(201).json({ mensagem: "Dados completos, cadastro feito com sucesso!" });
    }
});

// PUT
server.put('/musicas/:id', (req, res) => {
    const musicaId = parseInt(req.params.id);
    const atualizarMusica = req.body;

    const musicaIndex = dados.musicas.findIndex(musica => musica.id === musicaId);

    if (musicaIndex === -1) {
        return res.status(404).json({ mensagem: "Música não encontrada" });
    }

    // Ajuste para tratar a duração
    dados.musicas[musicaIndex].nome = atualizarMusica.nome || dados.musicas[musicaIndex].nome;
    dados.musicas[musicaIndex].artista = atualizarMusica.artista || dados.musicas[musicaIndex].artista;
    dados.musicas[musicaIndex].genero = atualizarMusica.genero || dados.musicas[musicaIndex].genero;
    dados.musicas[musicaIndex].imagem = atualizarMusica.imagem || dados.musicas[musicaIndex].imagem;
    dados.musicas[musicaIndex].duracao = parseInt(atualizarMusica.duracao) || dados.musicas[musicaIndex].duracao;

    salvarDados(dados);

    return res.json({ mensagem: "Música atualizada com sucesso", musica: dados.musicas[musicaIndex] });
});

server.get('/musicas', (req, res) => {
    return res.json(dados.musicas);
});

function salvarDados(dados) {
    fs.writeFileSync(__dirname + '/data/dados.json', JSON.stringify(dados, null, 2));
}

server.listen(4000, () => {
    console.log("Servidor rodando na porta 4000");
});

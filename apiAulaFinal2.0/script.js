const musicForm = document.getElementById('music-form');
const musicList = document.getElementById('music-list');
const musicDetailsModal = document.getElementById('music-details-modal');

document.getElementById('close-details').addEventListener('click', function () {
    closeDetailsModal(); // Chame a função para fechar o modal
});

function openDetailsModal(nome, artista, genero, duracao, imagem) {
    document.getElementById('modal-nome').textContent = nome;
    document.getElementById('modal-artista').textContent = "Artista: " + artista;
    document.getElementById('modal-genero').textContent = "Gênero: " + genero;
    const formattedDuracao = isNaN(duracao) ? 'Duração: N/A' : `Duração: ${duracao} s`;
    document.getElementById('modal-duracao').textContent = formattedDuracao;
        document.getElementById('modal-imagem').src = imagem;

    musicDetailsModal.style.display = 'block';
}
function closeDetailsModal() {
    musicDetailsModal.style.display = 'none';
}

function showMusicDetails(musicId) {
    // Redirecionar para edit-music.html com o parâmetro id
    window.location.href = `edit-music.html?id=${musicId}`;
}



function listMusics() {
    fetch('http://localhost:4000/musicas')
        .then(response => response.json())
        .then(data => {
            musicList.innerHTML = '';

            data.forEach(music => {
                const li = document.createElement('li');
                li.className = 'music-list-item';
                li.innerHTML = `
                    <div class="music-info">
                        ${music.nome} - Artista: ${music.artista}, Gênero: ${music.genero}
                    </div>
                    <div class="music-image">
                    <img src="${music.imagem}" alt="${music.nome} Image" onclick="openDetailsModal('${music.nome}', '${music.artista}', '${music.genero}', ${music.duracao}, '${music.imagem}')">
                    </div>
                    <div class="music-buttons">
                    <button class="details-button" onclick="showMusicDetails('${music.id}')">Detalhes</button>
                    <button class="delete-button" onclick="deleteMusic(${music.id})">Excluir</button>
                    </div>
                `;
                li.dataset.musicId = music.id;
                musicList.appendChild(li);
            });
        })
        .catch(error => console.error('Erro:', error));
}

function deleteMusic(musicId) {
    fetch(`http://localhost:4000/musicas/${musicId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        listMusics();
    })
    .catch(error => console.error('Erro:', error));
}

musicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nome').value;
    const artist = document.getElementById('artista').value;
    const genre = document.getElementById('genero').value;
    const duration = document.getElementById('duracao').value;
    const image = document.getElementById('imagem').value;

    fetch('http://localhost:4000/musicas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: name, artista: artist, genero: genre, duracao: duration, imagem: image }),
    })
    .then(response => response.json())
    .then(() => {
        listMusics();
        musicForm.reset();
    })
    .catch(error => console.error('Erro:', error));
});

listMusics();

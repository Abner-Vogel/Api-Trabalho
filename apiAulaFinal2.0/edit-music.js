const editMusicForm = document.getElementById('edit-music-form');

editMusicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const editedName = document.getElementById('edit-name').value;
    const editedArtist = document.getElementById('edit-artist').value;
    const editedGenre = document.getElementById('edit-genre').value;
    const editedDuration = document.getElementById('edit-duration').value;
    const editedImage = document.getElementById('edit-image').value;

    console.log('Dados a serem enviados:', {
        nome: editedName,
        artista: editedArtist,
        genero: editedGenre,
        duracao: editedDuration,
        imagem: editedImage,
    });

    const params = new URLSearchParams(window.location.search);
    const rawMusicId = params.get('id');
    const musicId = parseInt(rawMusicId);

    if (!isNaN(musicId) && musicId > 0) {
        fetch(`http://localhost:4000/musicas/${musicId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: editedName,
                artista: editedArtist,
                genero: editedGenre,
                duracao: editedDuration,
                imagem: editedImage,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Erro:', error));
    } else {
        console.error('ID da música não encontrado ou inválido na URL.');
    }
});

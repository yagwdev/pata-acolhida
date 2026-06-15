// 1. Pegamos o formulário do HTML usando o ID dele
const formCadastro = document.getElementById('form-cadastro-pet');

// 2. Criamos um "Ouvinte". O JS vai ficar vigiando quando a ONG clicar no botão de Enviar (submit)
if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        
        // Impede que a página recarregue (comportamento padrão do HTML que faria perder os dados)
        event.preventDefault();

        // 3. Pegamos os valores que a ONG digitou nos campos
        const nome = document.getElementById('nome-pet').value;
        const especie = document.getElementById('especie-pet').value;
        const idade = document.getElementById('idade-pet').value;
        const porte = document.getElementById('porte-pet').value;
        const sexo = document.getElementById('sexo-pet').value;
        const cidade = document.getElementById('cidade-pet').value;
        const foto = document.getElementById('foto-pet').value;
        const ong = document.getElementById('ong-pet').value;

        // 4. Montamos uma caixinha (objeto) com as informações do pet
        const novoPet = {
            nome: nome,
            especie: especie,
            idade: idade,
            porte: porte,
            sexo: sexo,
            cidade: cidade,
            foto: foto,
            ong: ong
        };

        // 5. Buscamos a lista de pets que JÁ existem no localStorage. 
        // Se não existir nenhum ainda, criamos uma lista vazia []
        let listaPets = JSON.parse(localStorage.getItem('petsCadastrados')) || [];

        // 6. Colocamos o nosso novo pet dentro dessa lista
        listaPets.push(novoPet);

        // 7. Salvamos a lista atualizada de volta na memória do navegador (transformando em texto com stringify)
        localStorage.setItem('petsCadastrados', JSON.stringify(listaPets));

        // 8. Aviso de sucesso e limpa o formulário
        alert('Animal cadastrado com sucesso!');
        formCadastro.reset(); 
    });
}


// ==========================================
// PAINEL DO ADMINISTRADOR (GERENCIAR + EDITAR PETS)
// ==========================================

const tabelaBody = document.getElementById('tabela-pets-body');
const mensagemVazia = document.getElementById('mensagem-vazia');
const modalEditar = document.getElementById('modal-editar');
const formEditar = document.getElementById('form-editar-pet');

function renderizarTabelaAdm() {
    if (!tabelaBody) return;
    tabelaBody.innerHTML = '';

    const petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];

    if (petsSalvos.length === 0) {
        mensagemVazia.style.display = 'block';
        return;
    } else {
        mensagemVazia.style.display = 'none';
    }

    petsSalvos.forEach(function(pet, index) {
        const row = document.createElement('tr');

        // Incluído a célula da ONG: <td>${pet.ong || 'Não informada'}</td>
        row.innerHTML = `
            <td><img src="${pet.foto}" alt="${pet.nome}" class="img-miniatura"></td>
            <td><strong>${pet.nome}</strong></td>
            <td>${pet.ong || 'Não informada'}</td>
            <td>${pet.porte} / ${pet.sexo}</td>
            <td>${pet.cidade}</td>
            <td>
                <button class="btn-editar" onclick="abrirModalEditar(${index})">✏️ Editar</button>
                <button class="btn-excluir" onclick="excluirPet(${index})">❌ Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

window.abrirModalEditar = function(index) {
    const petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];
    const pet = petsSalvos[index];

    document.getElementById('editar-index').value = index;
    document.getElementById('editar-nome').value = pet.nome;
    document.getElementById('editar-ong').value = pet.ong || ''; // PREENCHE A ONG NO MODAL
    document.getElementById('editar-idade').value = pet.idade;
    document.getElementById('editar-porte').value = pet.porte;
    document.getElementById('editar-sexo').value = pet.sexo;
    document.getElementById('editar-cidade').value = pet.cidade;
    document.getElementById('editar-foto').value = pet.foto;
    document.getElementById('editar-especie').value = pet.especie;

    modalEditar.style.display = 'flex';
};

window.fecharModal = function() {
    const modalEditar = document.getElementById('modal-editar');
    if (modalEditar) {
        modalEditar.style.display = 'none'; // Esconde o modal mudando o display para none
    }
};
if (formEditar) {
    formEditar.addEventListener('submit', function(event) {
        event.preventDefault();

        const index = document.getElementById('editar-index').value;
        let petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];

        petsSalvos[index] = {
            nome: document.getElementById('editar-nome').value,
            ong: document.getElementById('editar-ong').value, // SALVA A ONG EDITADA
            idade: document.getElementById('editar-idade').value,
            porte: document.getElementById('editar-porte').value,
            sexo: document.getElementById('editar-sexo').value,
            cidade: document.getElementById('editar-cidade').value,
            foto: document.getElementById('editar-foto').value,
            especie: document.getElementById('editar-especie').value
        };

        localStorage.setItem('petsCadastrados', JSON.stringify(petsSalvos));

        fecharModal();
        renderizarTabelaAdm();
        alert("Informações atualizadas com sucesso!");
    });
}

// Função para Excluir
window.excluirPet = function(index) {
    if (confirm("Tem certeza que deseja remover este pet do sistema?")) {
        let petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];
        petsSalvos.splice(index, 1);
        localStorage.setItem('petsCadastrados', JSON.stringify(petsSalvos));
        renderizarTabelaAdm();
        alert("Pet removido com sucesso!");
    }
};

// Inicializa a tabela
renderizarTabelaAdm();

// ==========================================
// EXIBIÇÃO NA PÁGINA DE ENCONTRAR PET + SOLICITAÇÃO
// ==========================================

const searchGrid = document.querySelector('.search-pets-grid');
const avisoVazioBusca = document.getElementById('lista-vazia-busca');
const modalAdotar = document.getElementById('modal-adotar');
const formSolicitarAdocao = document.getElementById('form-solicitar-adocao');

if (searchGrid) {
    const petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];

    if (petsSalvos.length === 0) {
        avisoVazioBusca.style.display = 'block';
    } else {
        avisoVazioBusca.style.display = 'none';
        
        // Passamos o 'index' para o loop saber qual botão pertence a qual animal
        petsSalvos.forEach(function(pet, index) {
            const cardBusca = document.createElement('div');
            cardBusca.classList.add('pet-card');

            // ADICIONADO: <button class="btn-quero-adotar"...> no rodapé do card
            cardBusca.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${pet.foto}" alt="${pet.nome}" class="pet-img">
                    <button class="favorite-btn">❤️</button>
                </div>
                <div class="card-info">
                    <h3>${pet.nome}</h3>
                    <p style="font-size: 13px; color: #004d40; font-weight: bold; margin-bottom: 5px;">🏠 ONG: ${pet.ong || 'Pata Acolhida'}</p>
                    <p class="pet-details">${pet.especie} • ${pet.idade} • ${pet.porte} • ${pet.sexo}</p>
                    <p class="pet-location">📍 ${pet.cidade}</p>
                    <button class="btn-quero-adotar" onclick="abrirModalAdotar(${index}, '${pet.nome}')">🐾 Quero Adotar</button>
                </div>
            `;
            searchGrid.appendChild(cardBusca);
        });
    }
}

// FUNÇÕES PARA CONTROLAR O MODAL DE ADOÇÃO
window.abrirModalAdotar = function(index, nomePet) {
    if (modalAdotar) {
        document.getElementById('adotar-index-pet').value = index;
        document.getElementById('adotar-nome-pet').innerText = nomePet;
        modalAdotar.style.display = 'flex';
    }
};

window.fecharModalAdotar = function() {
    if (modalAdotar) modalAdotar.style.display = 'none';
};

// GRAVAR O INTERESSE DE ADOÇÃO NO LOCALSTORAGE
if (formSolicitarAdocao) {
    formSolicitarAdocao.addEventListener('submit', function(event) {
        event.preventDefault();

        const indexPet = document.getElementById('adotar-index-pet').value;
        const petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];
        const petSelecionado = petsSalvos[indexPet];

        // Monta o objeto com as informações do adotante e do pet escolhido
        const novaSolicitacao = {
            nomeAdotante: document.getElementById('adotante-nome').value,
            telefoneAdotante: document.getElementById('adotante-telefone').value,
            emailAdotante: document.getElementById('adotante-email').value,
            nomePet: petSelecionado.nome,
            ongPet: petSelecionado.ong || 'Não informada'
        };

        // Puxa as solicitações antigas ou cria uma lista nova
        let listaSolicitacoes = JSON.parse(localStorage.getItem('pedidosAdocao')) || [];
        listaSolicitacoes.push(novaSolicitacao);

        // Devolve tudo salvo para a memória do navegador
        localStorage.setItem('pedidosAdocao', JSON.stringify(listaSolicitacoes));

        fecharModalAdotar();
        formSolicitarAdocao.reset();
        alert('Solicitação enviada com sucesso! A ONG responsável entrará em contato em breve.');
    });
}

// ==========================================
// SISTEMA DE LOGIN (ADM E ONG)
// ==========================================

const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // Captura os dados digitados
        const perfil = document.getElementById('login-perfil').value;
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;

        // Validação do perfil ADMINISTRADOR
        if (perfil === 'adm') {
            if (email === 'adm@adm.com' && senha === 'adm') {
                alert('Bem-vindo, Administrador!');
                window.location.href = 'paginas/painel-adm.html'; // Redireciona para o painel do ADM
            } else {
                alert('E-mail ou senha incorretos para o perfil Administrador.');
            }
        } 
        
        // Validação do perfil ONG
        else if (perfil === 'org') {
            if (email === 'ong@ong.com' && senha === 'ong') {
                alert('Login realizado com sucesso! Painel da ONG liberado.');
                window.location.href = 'paginas/cadastro-pet.html'; // Redireciona para o painel da ONG
            } else {
                alert('E-mail ou senha incorretos para o perfil ONG.');
            }
        }
    });
}

// ==========================================
// EXIBIÇÃO DE PEDIDOS DE ADOÇÃO (ONG E ADM)
// ==========================================

const tabelaPedidosAdm = document.getElementById('tabela-pedidos-adm');
const msgVaziaPedidosAdm = document.getElementById('mensagem-vazia-pedidos-adm');

const tabelaPedidosOng = document.getElementById('tabela-pedidos-ong');
const msgVaziaPedidosOng = document.getElementById('mensagem-vazia-pedidos-ong');

function renderizarPedidosAdocao() {
    // Busca a lista global de pedidos salvos na memória
    const pedidos = JSON.parse(localStorage.getItem('pedidosAdocao')) || [];

    // 1. SE ESTIVER NO PAINEL DO ADMINISTRADOR: Mostra tudo de forma geral
    if (tabelaPedidosAdm) {
        tabelaPedidosAdm.innerHTML = '';

        if (pedidos.length === 0) {
            msgVaziaPedidosAdm.style.display = 'block';
            return;
        } else {
            msgVaziaPedidosAdm.style.display = 'none';
        }

        pedidos.forEach(function(pedido) {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td><strong>${pedido.nomePet}</strong></td>
                <td>${pedido.ongPet}</td>
                <td>${pedido.nomeAdotante}</td>
                <td><a href="https://wa.me/${pedido.telefoneAdotante.replace(/\D/g, '')}" target="_blank" style="color: #004d40; font-weight: bold; text-decoration: none;">💬 ${pedido.telefoneAdotante}</a></td>
                <td>${pedido.emailAdotante}</td>
            `;
            tabelaPedidosAdm.appendChild(linha);
        });
    }

    // 2. SE ESTIVER NO PAINEL DA ONG: Filtra para mostrar só os dela
    if (tabelaPedidosOng) {
        tabelaPedidosOng.innerHTML = '';

        // Como não temos um sistema de login com contas de banco de dados reais guardando qual ONG está logada agora,
        // vamos simular capturando o nome da ONG que está escrito no campo cadastrar para servir de filtro dinâmico de teste,
        // ou puxaremos os pedidos correspondentes às ONGs ativas. Para fins escolares, vamos listar os pedidos da 'ong@pata.com'
        // filtrando as solicitações cujo nome da ONG combine com os pets manipulados ou simplesmente mostrando as solicitações globais direcionadas.
        // Vamos exibir as solicitações pendentes de forma limpa:
        
        if (pedidos.length === 0) {
            msgVaziaPedidosOng.style.display = 'block';
            return;
        } else {
            msgVaziaPedidosOng.style.display = 'none';
        }

        pedidos.forEach(function(pedido) {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td><strong>${pedido.nomePet}</strong> (Para: ${pedido.ongPet})</td>
                <td>${pedido.nomeAdotante}</td>
                <td><a href="https://wa.me/${pedido.telefoneAdotante.replace(/\D/g, '')}" target="_blank" style="color: #004d40; font-weight: bold; text-decoration: none;">💬 ${pedido.telefoneAdotante}</a></td>
                <td>${pedido.emailAdotante}</td>
            `;
            tabelaPedidosOng.appendChild(linha);
        });
    }
}

// Executa a verificação e renderização de pedidos ao carregar as páginas
renderizarPedidosAdocao();



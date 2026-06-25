// ==========================================
// 1. CADASTRO DE PETS (PAINEL DA ONG)
// ==========================================
const formCadastro = document.getElementById('form-cadastro-pet');

if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome-pet').value;
        const especie = document.getElementById('especie-pet').value;
        const idade = document.getElementById('idade-pet').value;
        const porte = document.getElementById('porte-pet').value;
        const sexo = document.getElementById('sexo-pet').value;
        const cidade = document.getElementById('cidade-pet').value;
        const foto = document.getElementById('foto-pet').value;
        const ong = document.getElementById('ong-pet').value;

        const novoPet = {
            id: 'pet_' + Date.now(), // ID único para controle de segurança
            nome: nome,
            especie: especie,
            idada: idade, // mantendo compatibilidade com seu campo
            idade: idade,
            porte: porte,
            sexo: sexo,
            cidade: cidade,
            foto: foto,
            ong: ong,
            status: "Disponível" // Status inicial
        };

        let listaPets = JSON.parse(localStorage.getItem('petsCadastrados')) || [];
        listaPets.push(novoPet);
        localStorage.setItem('petsCadastrados', JSON.stringify(listaPets));

        alert('Animal cadastrado com sucesso!');
        formCadastro.reset(); 
    });
}

// ==========================================
// 2. PAINEL DO ADMINISTRADOR (GERENCIAR GLOBAL)
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
        row.innerHTML = `
            <td><img src="${pet.foto}" alt="${pet.nome}" class="img-miniatura"></td>
            <td><strong>${pet.nome}</strong><br><small style="color:gray;">Status: ${pet.status || 'Disponível'}</small></td>
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
    document.getElementById('editar-ong').value = pet.ong || ''; 
    document.getElementById('editar-idade').value = pet.idade;
    document.getElementById('editar-porte').value = pet.porte;
    document.getElementById('editar-sexo').value = pet.sexo;
    document.getElementById('editar-cidade').value = pet.cidade;
    document.getElementById('editar-foto').value = pet.foto;
    document.getElementById('editar-especie').value = pet.especie;

    modalEditar.style.display = 'flex';
};

window.fecharModal = function() {
    if (modalEditar) modalEditar.style.display = 'none';
};

if (formEditar) {
    formEditar.addEventListener('submit', function(event) {
        event.preventDefault();

        const index = document.getElementById('editar-index').value;
        let petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];

        const idOriginal = petsSalvos[index].id;
        const statusOriginal = petsSalvos[index].status || "Disponível";

        petsSalvos[index] = {
            id: idOriginal,
            nome: document.getElementById('editar-nome').value,
            ong: document.getElementById('editar-ong').value, 
            idade: document.getElementById('editar-idade').value,
            porte: document.getElementById('editar-porte').value,
            sexo: document.getElementById('editar-sexo').value,
            cidade: document.getElementById('editar-cidade').value,
            foto: document.getElementById('editar-foto').value,
            especie: document.getElementById('editar-especie').value,
            status: statusOriginal
        };

        localStorage.setItem('petsCadastrados', JSON.stringify(petsSalvos));
        fecharModal();
        renderizarTabelaAdm();
        alert("Informações atualizadas com sucesso!");
    });
}

window.excluirPet = function(index) {
    if (confirm("Tem certeza que deseja remover este pet?")) {
        let petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];
        petsSalvos.splice(index, 1);
        localStorage.setItem('petsCadastrados', JSON.stringify(petsSalvos));
        renderizarTabelaAdm();
        alert("Pet removido!");
    }
};

renderizarTabelaAdm();

// ==========================================
// 3. EXIBIÇÃO NO CATÁLOGO E MODAL DE TRIAGEM
// ==========================================
const searchGrid = document.querySelector('.search-pets-grid');
const avisoVazioBusca = document.getElementById('lista-vazia-busca');
const modalAdotar = document.getElementById('modal-adotar');
const formSolicitarAdocao = document.getElementById('form-solicitar-adocao');

if (searchGrid) {
    const petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];

    // Oculta animais que já foram adotados ou estão em acompanhamento
    const petsDisponiveis = petsSalvos.filter(pet => !pet.status || pet.status === "Disponível");

    if (petsDisponiveis.length === 0) {
        avisoVazioBusca.style.display = 'block';
    } else {
        avisoVazioBusca.style.display = 'none';
        
        petsSalvos.forEach(function(pet, index) {
            if (pet.status && pet.status !== "Disponível") return;

            const cardBusca = document.createElement('div');
            cardBusca.classList.add('pet-card');
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

if (formSolicitarAdocao) {
    formSolicitarAdocao.addEventListener('submit', function(event) {
        event.preventDefault();

        const indexPet = document.getElementById('adotar-index-pet').value;
        const petsSalvos = JSON.parse(localStorage.getItem('petsCadastrados')) || [];
        const petSelecionado = petsSalvos[indexPet];

        const novaSolicitacao = {
            idSolicitacao: 'sol_' + Date.now(),
            idPet: petSelecionado.id,
            nomePet: petSelecionado.nome,
            ongPet: petSelecionado.ong || 'Não informada',
            nomeAdotante: document.getElementById('adotante-nome').value,
            telefoneAdotante: document.getElementById('adotante-telefone').value,
            emailAdotante: document.getElementById('adotante-email').value,
            perguntaMoradores: document.getElementById('pergunta-1').value,
            perguntaImprevisto: document.getElementById('pergunta-2').value,
            perguntaSeguranca: document.getElementById('pergunta-3').value,
            status: "Pendente"
        };

        let listaSolicitacoes = JSON.parse(localStorage.getItem('pedidosAdocao')) || [];
        listaSolicitacoes.push(novaSolicitacao);
        localStorage.setItem('pedidosAdocao', JSON.stringify(listaSolicitacoes));

        fecharModalAdotar();
        formSolicitarAdocao.reset();
        alert('Formulário enviado! A ONG analisará suas respostas para liberar o contato.');
    });
}

// ==========================================
// 4. SISTEMA DE LOGIN 
// ==========================================
const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();
        const perfil = document.getElementById('login-perfil').value;
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;

        if (perfil === 'adm') {
            if (email === 'adm@adm.com' && senha === 'adm') {
                alert('Bem-vindo, Administrador!');
                window.location.href = 'paginas/painel-adm.html';
            } else {
                alert('E-mail ou senha incorretos.');
            }
        } else if (perfil === 'org') {
            if (email === 'ong@ong.com' && senha === 'ong') {
                alert('Login realizado com sucesso!');
                window.location.href = 'paginas/cadastro-pet.html';
            } else {
                alert('E-mail ou senha incorretos.');
            }
        }
    });
}

// ==========================================
// 5. OPERAÇÕES DA ONG (APROVAR / REPROVAR)
// ==========================================
window.gerenciarSolicitacao = function(idSolicitacao, acao) {
    let pedidos = JSON.parse(localStorage.getItem('pedidosAdocao')) || [];
    let pets = JSON.parse(localStorage.getItem('petsCadastrados')) || [];
    
    const pedidoIndex = pedidos.findIndex(p => p.idSolicitacao === idSolicitacao);
    if (pedidoIndex === -1) return;

    const idPet = pedidos[pedidoIndex].idPet;
    const petIndex = pets.findIndex(p => p.id === idPet);

    if (acao === 'aprovar') {
        pedidos[pedidoIndex].status = "Aprovado";
        if (petIndex !== -1) pets[petIndex].status = "Em Acompanhamento";

        let acompanhamentos = JSON.parse(localStorage.getItem('historicoAcompanhamento')) || [];
        acompanhamentos.push({
            idPet: idPet,
            nomePet: pedidos[pedidoIndex].nomePet,
            nomeAdotante: pedidos[pedidoIndex].nomeAdotante,
            periodo: "1 Semana",
            relato: "Aguardando envio da foto contendo o papel físico de prova de vida...",
            foto: "../imagens/logo-pata.png", 
            codigoUtilizado: "Nenhum ainda",
            dataAprovacao: new Date().toLocaleDateString('pt-BR')
        });
        localStorage.setItem('historicoAcompanhamento', JSON.stringify(acompanhamentos));
        alert("Solicitação APROVADA! O contato do WhatsApp foi liberado.");
    } else if (acao === 'reprovar') {
        pedidos[pedidoIndex].status = "Reprovado";
        if (petIndex !== -1) pets[petIndex].status = "Disponível";
        alert("Solicitação Reprovada.");
    }

    localStorage.setItem('pedidosAdocao', JSON.stringify(pedidos));
    localStorage.setItem('petsCadastrados', JSON.stringify(pets));
    renderizarPedidosAdocao();
};

// ==========================================
// 6. RENDERIZAR TABELAS (ONG E ADM)
// ==========================================
const tabelaPedidosAdm = document.getElementById('tabela-pedidos-adm');
const msgVaziaPedidosAdm = document.getElementById('mensagem-vazia-pedidos-adm');
const tabelaPedidosOng = document.getElementById('tabela-pedidos-ong');
const msgVaziaPedidosOng = document.getElementById('mensagem-vazia-pedidos-ong');
const tabelaAcompanhamentoOng = document.getElementById('tabela-acompanhamento-ong');
const msgVaziaAcompanhamentoOng = document.getElementById('mensagem-vazia-acompanhamento-ong');

function renderizarPedidosAdocao() {
    const pedidos = JSON.parse(localStorage.getItem('pedidosAdocao')) || [];
    const acompanhamentos = JSON.parse(localStorage.getItem('historicoAcompanhamento')) || [];

    if (tabelaPedidosAdm) {
        tabelaPedidosAdm.innerHTML = '';
        if (pedidos.length === 0) {
            msgVaziaPedidosAdm.style.display = 'block';
        } else {
            msgVaziaPedidosAdm.style.display = 'none';
            pedidos.forEach(function(pedido) {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td><strong>${pedido.nomePet}</strong></td>
                    <td>${pedido.ongPet}</td>
                    <td>${pedido.nomeAdotante}</td>
                    <td>${pedido.telefoneAdotante}</td>
                    <td>${pedido.emailAdotante}</td>
                `;
                tabelaPedidosAdm.appendChild(linha);
            });
        }
    }

    if (tabelaPedidosOng) {
        tabelaPedidosOng.innerHTML = '';
        const pedidosPendentes = pedidos.filter(p => p.status === "Pendente");

        if (pedidosPendentes.length === 0) {
            msgVaziaPedidosOng.style.display = 'block';
        } else {
            msgVaziaPedidosOng.style.display = 'none';
            pedidosPendentes.forEach(function(pedido) {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td><strong>${pedido.nomePet}</strong><br><small style="color:#777;">De: ${pedido.ongPet}</small></td>
                    <td><strong>${pedido.nomeAdotante}</strong><br><small style="color:red;">🔒 Bloqueado até aprovação</small></td>
                    <td style="font-size: 13px; background:#fafafa; padding:8px; border-radius:6px;">
                        <strong>1. Moradores/Custos:</strong> ${pedido.perguntaMoradores}<br>
                        <strong>2. Viagem/Imprevisto:</strong> ${pedido.perguntaImprevisto}<br>
                        <strong>3. Segurança/Fugas:</strong> ${pedido.perguntaSeguranca}
                    </td>
                    <td><span style="color:#e65100; font-weight:bold;">⏳ ${pedido.status}</span></td>
                    <td>
                        <button style="background:#004d40; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer; width:100%; margin-bottom:4px; font-weight:bold;" onclick="gerenciarSolicitacao('${pedido.idSolicitacao}', 'aprovar')">Aprovar</button>
                        <button style="background:#c62828; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer; width:100%; font-weight:bold;" onclick="gerenciarSolicitacao('${pedido.idSolicitacao}', 'reprovar')">Reprovar</button>
                    </td>
                `;
                tabelaPedidosOng.appendChild(linha);
            });
        }
    }

    // AJUSTE 3 COMPLETO E INJETADO AQUI PARA A ONG CONFERIR O PAPEL FISICO:
    if (tabelaAcompanhamentoOng) {
        tabelaAcompanhamentoOng.innerHTML = '';

        if (acompanhamentos.length === 0) {
            msgVaziaAcompanhamentoOng.style.display = 'block';
        } else {
            msgVaziaAcompanhamentoOng.style.display = 'none';
            acompanhamentos.forEach(function(item) {
                const linha = document.createElement('tr');
                const dadosAdotante = pedidos.find(p => p.idPet === item.idPet && p.status === "Aprovado");
                const linkWhats = dadosAdotante ? `<br><a href="https://wa.me/${dadosAdotante.telefoneAdotante.replace(/\D/g, '')}" target="_blank" style="color:#004d40; font-weight:bold; text-decoration:none;">💬 Chamar Whats</a>` : '';

                linha.innerHTML = `
                    <td><strong>${item.nomePet}</strong><br><small>Adotante: ${item.nomeAdotante}</small>${linkWhats}</td>
                    <td><span style="background:#e0f2f1; color:#004d40; padding:3px 8px; border-radius:12px; font-weight:bold; font-size:12px;">${item.periodo}</span></td>
                    <td style="font-style: italic; color: #444; max-width:250px;">"${item.relato}"</td>
                    <td>
                        <div style="text-align:center;">
                            <img src="${item.foto}" style="width:70px; height:70px; object-fit:cover; border-radius:6px; border:1px solid #ddd; display:block; margin:0 auto 4px;"><br>
                            <span style="font-size:11px; background:#ffebee; color:#c62828; padding:2px 5px; border-radius:4px; font-weight:bold;">Procurar no papel: ${item.codigoUtilizado || 'Nenhum'}</span>
                        </div>
                    </td>
                `;
                tabelaAcompanhamentoOng.appendChild(linha);
            });
        }
    }
}

// ==========================================
// 7. ÁREA DO ADOTANTE (PÁGINA MEUS PETS) - CORRIGIDA
// ==========================================

// Função que gera o token dinâmico baseado no índice de cada pet
window.gerarCodigoFoto = function(index) {
    const elementoCodigo = document.getElementById(`codigo-aleatorio-tela-${index}`);
    if (!elementoCodigo) return;

    const prefixos = ["PATA", "PET", "ONG", "UFES", "AMIGO"];
    const prefixoAleatorio = prefixos[Math.floor(Math.random() * prefixos.length)];
    const numeroAleatorio = Math.floor(100 + Math.random() * 900);
    
    elementoCodigo.innerText = `${prefixoAleatorio}-${numeroAleatorio}`;
};

// Renderiza a página do usuário com seus respectivos animais adotados
function renderizarMeusPetsAdotados() {
    const container = document.getElementById('container-meus-pets');
    const msgVazia = document.getElementById('mensagem-sem-pets');
    if (!container) return; // Só executa se o container existir na página atual

    container.innerHTML = '';
    const acompanhamentos = JSON.parse(localStorage.getItem('historicoAcompanhamento')) || [];

    if (acompanhamentos.length === 0) {
        msgVazia.style.display = 'block';
        return;
    }

    msgVazia.style.display = 'none';

    acompanhamentos.forEach(function(item, index) {
        const itemCard = document.createElement('div');
        itemCard.style.cssText = "display: flex; gap: 25px; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-wrap: wrap; margin-bottom: 20px;";
        
        itemCard.innerHTML = `
            <div style="flex: 1; min-width: 250px;">
                <img src="${item.foto || '../imagens/logo-pata.png'}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; margin-bottom: 10px;">
                <h3 style="margin: 5px 0;">${item.nomePet}</h3>
                <p style="font-size: 14px; margin: 4px 0; color: #555;"><strong>Período Atual:</strong> <span style="background: #e0f2f1; color: #004d40; padding: 2px 8px; border-radius: 10px; font-weight: bold; font-size: 12px;">${item.periodo}</span></p>
                <p style="font-size: 13px; color: #777; font-style: italic; margin-top: 10px;">Último relato: "${item.relato}"</p>
            </div>

            <div style="flex: 1.5; min-width: 300px; background-color: #f4fbf9; border: 1px solid #004d40; border-radius: 8px; padding: 15px;">
                <h4 style="margin-top: 0; color: #004d40;">Atualizar Acompanhamento</h4>
                
                <div style="background: #fff; border: 1px dashed #004d40; padding: 10px; border-radius: 6px; margin-bottom: 15px; text-align: center;">
                    <span style="font-size: 11px; color: #666; font-weight: bold; display: block;">CÓDIGO PARA ESCREVER NO PAPEL:</span>
                    <div id="codigo-aleatorio-tela-${index}" style="font-size: 24px; font-weight: bold; color: #c62828; margin: 5px 0;">------</div>
                    <button type="button" onclick="window.gerarCodigoFoto(${index})" style="background: #004d40; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Gerar Novo Código</button>
                </div>

                <form onsubmit="enviarRelatorioAdotante(event, ${index}, this)">
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 3px;">Confirme o código do papel:</label>
                        <input type="text" class="confirma-codigo" placeholder="Ex: PATA-123" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-weight: bold; text-transform: uppercase;" required>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 3px;">Como está a adaptação?</label>
                        <textarea class="texto-relato" placeholder="Comportamento, alimentação, rotina..." style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;" rows="2" required></textarea>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 3px;">Foto do pet com o papel visível:</label>
                        <input type="file" class="arquivo-foto" accept="image/*" style="font-size: 12px;" required>
                    </div>

                    <button type="submit" style="width: 100%; padding: 8px; background-color: #004d40; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">Enviar Atualização</button>
                </form>
            </div>
        `;
        container.appendChild(itemCard);
        
        // Inicializa o primeiro token gerado individualmente
        window.gerarCodigoFoto(index);
    });
}

// Processa e salva o envio do relatório individual
window.enviarRelatorioAdotante = function(event, indexAcompanhamento, formularioElemento) {
    event.preventDefault();

    const codigoConfirmacao = formularioElemento.querySelector('.confirma-codigo').value.trim().toUpperCase();
    const textoRelato = formularioElemento.querySelector('.texto-relato').value;
    const arquivoFoto = formularioElemento.querySelector('.arquivo-foto').files[0];

    let acompanhamentos = JSON.parse(localStorage.getItem('historicoAcompanhamento')) || [];

    const reader = new FileReader();
    reader.onloadend = function() {
        const imagemBase64 = reader.result;

        acompanhamentos[indexAcompanhamento].relato = textoRelato;
        acompanhamentos[indexAcompanhamento].foto = imagemBase64;
        acompanhamentos[indexAcompanhamento].codigoUtilizado = codigoConfirmacao; 
        
        // Avanço de fases corrigido (sem erros de sintaxe)
        if (acompanhamentos[indexAcompanhamento].periodo === "1 Semana") acompanhamentos[indexAcompanhamento].periodo = "1 Mês";
        else if (acompanhamentos[indexAcompanhamento].periodo === "1 Mês") acompanhamentos[indexAcompanhamento].periodo = "3 Meses";
        else if (acompanhamentos[indexAcompanhamento].periodo === "3 Meses") acompanhamentos[indexAcompanhamento].periodo = "Concluído ✔️";

        localStorage.setItem('historicoAcompanhamento', JSON.stringify(acompanhamentos));
        
        alert("O relatório foi registrado com sucesso e já está disponível no painel de auditoria da ONG.");
        renderizarMeusPetsAdotados(); 
    };

    if (arquivoFoto) {
        reader.readAsDataURL(arquivoFoto);
    }
};

// Execuções executadas ao carregar as páginas
window.addEventListener('load', function() {
    renderizarMeusPetsAdotados();
});

// Inicialização padrão das tabelas internas
renderizarPedidosAdocao();
export interface TalentDef {
  id: string
  name: string
  description: string
  requirement: string
}

export const TALENT_CATALOG: TalentDef[] = [
  {
    "id": "bloqueio_aprimorado",
    "name": "Bloqueio Aprimorado",
    "description": "A alta força do personagem, somado aos seus sentidos aguçados facilitam aparar o dano recebido.\r\nBenefício : O talento PERMITE o personagem:\r\n RECEBE temporariamente +[8] na perícia de BLOQUEAR. \r\nO dano reduzido da perícia Bloquear passa de [1d10 + 1 * modFOR  + 1 *  modVIG] se torna [3d10 + 1 * modFOR + 1 * modVIG] / [5d10 + 1 * modFOR + 1 * modVIG];",
    "requirement": "Bloquear"
  },
  {
    "id": "dadiva_de_sansao",
    "name": "Dádiva de Sansão",
    "description": "Durante alguns momentos do dia, o personagem consegue ultrapassar seus limites físicos.\r\nBenefício : VANTAGEM na rolagem do atributo FORÇA;",
    "requirement": "atributo Força"
  },
  {
    "id": "esquiva_aprimorada",
    "name": "Esquiva Aprimorada",
    "description": "A alta destreza do personagem, somado aos seus sentidos aguçados permitem o personagem esquivar de projetos balísticos.\r\nBenefício : O talento PERMITE o personagem:\r\nESQUIVAR de ataques de ARMAS DE FOGO;\r\n RECEBE temporariamente +[8] na perícia de ESQUIVAR;",
    "requirement": "Esquiva"
  },
  {
    "id": "acao_relampago",
    "name": "Ação Relâmpago",
    "description": "A alta agilidade do personagem permite realizar ações mais eficazes.\r\nBenefício : PERMITE utilizar uma Ação Movimento como uma Ação Principal;",
    "requirement": "atributo Agilidade"
  },
  {
    "id": "veloz_e_feroz",
    "name": "Veloz e Feroz",
    "description": "A destreza do personagem torna-o rápido o suficiente para encontrar brechas no ataque do oponente, e permitindo revidar com sua velocidade.\r\nBenefício : O talento PERMITE o personagem a utilizar o modificador de ESQUIVAR para CONTRA-ATACAR o oponente;",
    "requirement": "Esquiva"
  },
  {
    "id": "cabeca_de_ferro",
    "name": "Cabeça de Ferro",
    "description": "Um personagem inteligente sempre guarda espaço para alguma informação e sabe dialogar sobre qualquer assunto.\r\nBenefício : O talento PERMITE  que, duas vez ao dia, TRANSFERE temporariamente um modificador de uma  perícias de INTELECTO para outra perícia de INTELECTO;",
    "requirement": "atributo Intelecto"
  },
  {
    "id": "rato_de_pesquisa",
    "name": "Rato de Pesquisa",
    "description": "Como um grande pesquisador, o personagem consegue buscar qualquer informação na SURFACE WEB ou vasculhar montanhas de livros em bibliotecas.\r\nBenefício :  RECEBE temporariamente +[8] na perícia de USAR BIBLIOTECAS ou USAR COMPUTADORES;",
    "requirement": "atributo Intelecto"
  },
  {
    "id": "estrategista_de_combate",
    "name": "Estrategista de Combate",
    "description": "Pensar de forma lógica se torna uma habilidade muito útil em um mundo com habilidades sobre-humanas, conseguir analisar um combate é a chave da vitória.\r\nBenefício : O talento PERMITE encontrar um PONTO FRACO/DESVANTAGEM nos movimentos ou habilidades dos oponente;",
    "requirement": "atributo Intelecto"
  },
  {
    "id": "especialista_tatico",
    "name": "Especialista Tático",
    "description": "Treinar e aprender sobre alguma área do conhecimento, tornou seu personagem perfeccionista no assunto. A única coisa capaz de impedi-lo é apenas um azar dos grandes.\r\nBenefício : O talento PERMITE o ACERTO ABSOLUTO em uma perícia de INTELECTO da ESCOLHIDA pelo personagem;",
    "requirement": "atributo Intelecto"
  },
  {
    "id": "mentalidade_inabalavel",
    "name": "Mentalidade Inabalável",
    "description": "Uma mente forte não se abala em situações em que a sua sanidade se coloca à prova. Golpes que afetam seu psicológico ou sua cabeça são menos efetivos contra você. \r\nBenefício : VANTAGEM na rolagem dos testes de perícia CONSTITUIÇÃO MENTAL. caso FALHE no teste reduz METADE dos turnos do efeito da habilidade do oponente;",
    "requirement": "atributo de Presença"
  },
  {
    "id": "lider_de_campo",
    "name": "Líder de Campo",
    "description": "Com palavras certeiras, olhar afiado e voz firme, o personagem é capaz de mudar o rumo do combate com uma única ordem ou ameaça. Suas palavras ressoam no campo de batalha como comando absoluto — inspirando aliados ou intimidando adversários.\r\nBenefício: O talento PERMITE ao que durante o combate, o personagem pode emitir uma ordem ou ameaça verbal ([36] metros):\r\nSe for direcionada a um aliado, ele recebe VANTAGEM em sua próxima rolagem de ataque, defesa ou perícia até o final do turno seguinte;\r\n Se for direcionada a um inimigo, ele realiza sua próxima rolagem com DESVANTAGEM (ataque, defesa ou resistência).",
    "requirement": "atributo de Presença"
  },
  {
    "id": "reputacao_urbana",
    "name": "Reputação Urbana",
    "description": "Seus feitos e suas ações afetam direta ou indiretamente o ambiente em que o jogo se passa. A reputação é extremamente importante, no momento de recolher informações e gerar sentimento nas pessoas.\r\nBenefício : RECEBA os modificadores de perícia da TABELA de acordo com a  TENDÊNCIA do personagem;\r\n* Tendência Heróica — Como herói, possui capacidade de lidar com Multidões, Repórteres e o Judiciário [Condicional ao Ambiente];\r\n* Tendência de Vigilante — Como vigilante, torna-se fluente em Conhecimento de Rua (locais ilegais, contatos de armamento não registrado, informantes);\r\n*  Tendência Criminal — Com uma tendência Criminal, seus atos são conhecidos no Mundo do Crime. Dessa forma, possui contatos com Gangues Paralelas, locais ilegais, contatos de armamento não registrado, traficantes;\r\n\r\nTENDÊNCIA\r\nTendência\r\nHeróica\r\nTendência\r\nde Vigilante\r\nTendência\r\nCriminosa\r\n+[5] Diplomacia;\r\n+[5] Intuição;\r\n+[5]  Persuasão;\r\n+[5]  Intuição (Streetwise);\r\n+[5]  Intimidação;\r\n+[5]  Lábia;\r\n+[5]  Atuação;\r\n+[5] Enganação;\r\n+[5] Persuasão;",
    "requirement": "atributo de Presença"
  },
  {
    "id": "pelo_povo",
    "name": "Pelo Povo",
    "description": "A capacidade de motivar seus aliados é surpreendente, com seu carisma você faz todos seus aliados se empenharem na batalha. \r\nBenefício : O talento PERMITE todos os aliados (exceto o usuário) receberem um bônus no modificador de  +[ 10] em TODAS as perícias, nos próximos [1d4 + 2] turnos;",
    "requirement": "atributo Presença"
  },
  {
    "id": "presenca_esmagadora",
    "name": "Presença Esmagadora",
    "description": "A presença do personagem é tão alta, que é quase impossível não se amedrontar diante de ti. Os inimigos tremem ao estar na sua presença e seus aliados alívio por estar ao seu lado na batalha. \r\nBenefício : O talento EXIGE  que no início do combate os inimigos façam um teste de PRESENÇA. Caso o inimigo FALHE, o mesmo recebe o status de INTIMIDADO;",
    "requirement": "atributo Presença"
  },
  {
    "id": "dadiva_heroica",
    "name": "Dádiva Heróica",
    "description": "Durante uma parte do seu dia, o personagem consegue ultrapassar os limites da sua individualidade.\r\nBenefício : VANTAGEM na rolagem do atributo PODER;",
    "requirement": "atributo Poder"
  },
  {
    "id": "inspirar_e_respirar",
    "name": "Inspirar e Respirar",
    "description": "Na batalha, um momento de alívio vêm  a calhar,  nesse momento tirar um instante para respirar pode gerar um alívio. \r\nBenefício :  RECEBA temporariamente +[20] nos pontos de estamina durante a cena;",
    "requirement": "atributo Poder"
  },
  {
    "id": "dois_em_um",
    "name": "Dois em Um",
    "description": "Uma vez ao dia, o personagem pode com uma ação bônus, utilizar os seus poderes durante um mesmo turno causando um caos no campo de batalha. \r\nBenefício :  PERMITE utilizar uma Ação Bônus como uma  Ação de Usar Individualidade;",
    "requirement": "ação Usar Individualidade"
  },
  {
    "id": "individualidade_aprimorada",
    "name": "Individualidade Aprimorada",
    "description": "Uma vez ao dia, a sua individualidade se fortalece, e seu próximo golpe torna-se decisivo, lhe dando a chave para a vitória, PLUS ULTRAAA!!!!. \r\nBenefício :  O talento PERMITE que o próximo ataque cause o DANO TOTAL da Individualidade  ou DOBRO da DURAÇÃO dos efeitos de status;",
    "requirement": "ação Usar Individualidade"
  },
  {
    "id": "resistencia_de_gigante",
    "name": "Resistência de Gigante",
    "description": "O corpo do personagem é acostumado a viver sob condições extremas, para conseguir ficar de pé criou-se resistência às condições biológicas e climáticas.\r\nBenefício : O talento PERMITE que o personagem detenha RESISTÊNCIA sobre um tipo de condição/elemento de dano;\r\n\r\nTipos de Dano\r\nDano de Queimaduras\r\nDano Congelante\r\nDano Elétrico\r\nDano Venenoso\r\nDano Asfixiante\r\n\r\n\r\nRESISTÊNCIA [1º Nível]: \r\nUm personagem com resistência possui uma afinidade ou durabilidade natural contra um tipo específico de energia ou condição. Seu corpo é adaptado para suportar e mitigar os efeitos adversos, tornando-o mais difícil de ser derrubado por aquela ameaça.\r\nDano Reduzido: O personagem reduz pela metade todo o dano recebido da fonte à qual tem resistência.\r\nVantagem contra Efeitos: Ao realizar um teste para evitar ou anular uma condição de status (como paralisia, veneno, etc.) proveniente da fonte resistida, o personagem recebe um bônus de +[10] na sua rolagem.\r\n\r\n\r\nIMUNIDADE [2º Nível]: \r\nA imunidade representa o domínio total sobre uma condição ou elemento. O personagem transcende a mera capacidade de suportar, tornando-se completamente impassível àquela força. Efeitos que seriam devastadores para outros simplesmente não o afetam.\r\nDano Anulado: O personagem anula completamente qualquer dano que receberia da fonte à qual é imune.\r\nInvalidação de Efeitos:  O personagem é totalmente imune a quaisquer condições de status, efeitos negativos ou penalidades provenientes daquela fonte.",
    "requirement": "atributo de Vigor"
  },
  {
    "id": "ele_automaticamente_passa_em_qualquer_teste_de_resistencia_relacionado_e_nao_sofre_seus_efeito_pele_de_aco",
    "name": "Ele automaticamente passa em qualquer teste de resistência relacionado e não sofre seus efeito\r\n\r\nPele de Aço",
    "description": "A resistência sobre-humana que o personagem possui, transforma-o em um tanque ambulante capaz de resistir a diversos tipos de dano naturalmente. \r\nBenefício :  RECEBA como uma Armadura Natural os valores de armadura da TABELA segundo o  NÍVEL do talento;",
    "requirement": "atributo Vigor"
  },
  {
    "id": "inteiro_e_demais",
    "name": "Inteiro é Demais",
    "description": "Uma boa muralha, capaz de aguentar a chuva de golpes do inimigo e ainda se manter de pé. \r\nBenefício :  o talento PERMITE que o personagem REDUZA METADE do dano do ataque inimigo;",
    "requirement": "atributo Vigor"
  },
  {
    "id": "desafio_a_morte",
    "name": "Desafio à Morte",
    "description": "Uma vez, durante a sessão, o personagem consegue enganar a morte. \r\nBenefício :  CASO o personagem sofra um dano que coloque-o na condição de MORRENDO, o talento PERMITE que o personagem mantenha-se com [1] ponto de vida.",
    "requirement": "atributo Vigor"
  },
  {
    "id": "acougueiro_desleixado",
    "name": "Açougueiro Desleixado",
    "description": "Através de métodos bárbaros, o personagem inflige feridas graves no inimigo, causando sangramento nas partes do corpo que foram atacadas. \r\nBenefício : O próximo ataque inflige ao inimigo a condição de  SANGRAMENTO.",
    "requirement": "perícia das Armas Brancas"
  },
  {
    "id": "ambidestro",
    "name": "Ambidestro",
    "description": "Um entre alguns milhões, é um das predisposições que o personagem tem. Ser capaz de utilizar ambas as mãos com maestria é um talento bem raro, e pode ser crucial em combate.\r\nBenefício : O talento PERMITE dispõe utilizar [2] itens em cada mão (ARMAS BRANCAS / ARMAS DE FOGO) para combate;",
    "requirement": "perícia Armas Brancas e Arma de Fogo"
  },
  {
    "id": "arma_favorita",
    "name": "Arma Favorita",
    "description": "O melhor amigo do homem é a lâmina que sempre o acompanha. Os longos períodos de uso te deixam calejado em manuseá-la com maestria de um mestre. \r\nBenefício : RECEBA permanentemente +[8] nas perícias de ARMAS BRANCAS ou ARMAS DE FOGO em uma ARMA ESPECÍFICA.",
    "requirement": "perícia Armas Brancas e Armas de Fogo"
  },
  {
    "id": "arquiteto_da_guerra",
    "name": "Arquiteto da Guerra",
    "description": "Para você, jogar xadrez ou shogi, são brincadeiras de criança. O seu personagem é experiente sobre táticas de guerrilha e como usar a situação ao seu favor.\r\nBenefício : O talento DISPÕE ao personagem IDENTIFICAR durante o combate: localização no terreno com maiores chances de vitória, detectar padrões de combate e encontrar a melhor estratégia tática;",
    "requirement": "atributo Intelecto"
  },
  {
    "id": "carrasco_da_corte",
    "name": "Carrasco da Corte",
    "description": "Um assassino sem misericórdia, executa um golpe a sangue frio, capaz de abater o inimigo sem permitir que nenhum companheiro socorra-o. Banhar sua lâmina com sangue do adversário, um talento desprezível. \r\nBenefício : O talento PERMITE o personagem ABATER o adversário / causar um Ferimento Grave no momento que a vida for inferior a [16 + FOR] pontos de vida;",
    "requirement": "perícia Armas Brancas"
  },
  {
    "id": "condutor_licenciado",
    "name": "Condutor Licenciado",
    "description": "Meios de transporte públicos são bons, mas nada melhor do que dirigir um veículo (carros e motos) em alta velocidade durante um céu estrelado. Para isso, uma carteira de motorista é sempre importante. \r\nBenefício : O talento PERMITE que o personagem NÃO execute rolagens para a perícia de Dirigir Veículos enquanto estiver em condição de  DIREÇÃO SEGURA.",
    "requirement": "perícia Dirigir Veículos"
  },
  {
    "id": "danca_da_corrente",
    "name": "Dança da Corrente",
    "description": "Para aqueles que utilizam correntes, chicotes, laços e equipamentos do gênero, torna-se esse o talento mais útil para aproveitar 100% do potencial da sua arma. Tornando-a útil para realizar MANOBRAS ou atacar múltiplos inimigos. \r\nBenefício : O talento PERMITE que o personagem execute MANOBRAS com os equipamentos anteriores. Além de CAPAZ de ACERTAR adversários adjacentes.",
    "requirement": "perícia Armas Brancas"
  },
  {
    "id": "decodificador_de_sinais_e_codigos",
    "name": "Decodificador de Sinais e Códigos",
    "description": "Um perito em analisar padrões e informações desconexas, aqueles que se aventuram em decodificar frases e linguagens são essenciais em investigações de mistérios. \r\nBenefício : O talento PERMITE que o personagem CODIFICAR e DECODIFICAR uma linguagem ou código escrito.",
    "requirement": "perícia Antropologia e Idiomas"
  },
  {
    "id": "especialista_em_proteses_e_tech_suits",
    "name": "Especialista em Próteses e Tech Suits",
    "description": "Com grandes poderes, têm-se grandes responsabilidades. Os acidentes sempre acontecem no cotidiano, e em um mundo de individualidades não é incomum. \r\nCerca de 8% dos acidentes envolvem o uso de habilidades, para isso a medicina e engenharia precisou evoluir, e próteses do básico até o avançado se tornaram uma tecnologia comum durante o século XX e século XXI. \r\nBenefício : O talento PERMITE que o personagem PROJETE PRÓTESES e ROUPAS TECNOLÓGICAS, sendo capaz de ter ou não alguma tecnologia utilitária.",
    "requirement": "perícia Engenharia"
  },
  {
    "id": "faixa_preta",
    "name": "Faixa Preta",
    "description": "Talvez seu filme favorito seja “Karate Kid” ou seus responsáveis colocam você para treinar artes marciais na infância, mas é inegável que seu estilo de luta é imponente e útil durante o combate . \r\nBenefício : O talento PERMITE ao utilizar:\r\nRECEBA temporariamente +[8] na perícia de  LUTAR (BRIGAR);\r\n A perícia Lutar (Brigar) executar uma MANOBRA com VANTAGEM sobre o adversário. Sendo uma MANOBRA: desarmar, agarrar e derrubar.",
    "requirement": "perícia Lutar (Brigar)"
  },
  {
    "id": "falsificador",
    "name": "Falsificador",
    "description": "Se existe algum documento, comprovante ou credenciais que precisa ser forjado com exatidão, esse é o talento ideal para esse trabalho.\r\nBenefício : O talento PERMITE o personagem REPLICAR um documento, comprovante, credencial ou até mesmo um item simples.",
    "requirement": "atributo Intelecto"
  },
  {
    "id": "franco_atirador",
    "name": "Franco Atirador",
    "description": "Acertar qualquer alvo na sua frente, esse é um dos pré-requisitos para ser um Pistoleiro ou Sniper habilidoso. Graças aos olhos afiados de falcão, nenhum inimigo escapa da sua mira .\r\nBenefício :  RECEBA temporariamente +[8] na perícia de ARMAS DE FOGO // ARREMESSAR;",
    "requirement": "perícia Armas de Fogo e Arremessar"
  },
  {
    "id": "furia_descontrolada",
    "name": "Fúria Descontrolada",
    "description": "Explode em raiva durante o combate e parta para cima dos seus inimigos. O talento perfeito para combatentes estressadinhos, mas tome cuidado…. Nem sempre a fúria vai te ajudar.\r\nBenefício :   O talento PERMITE o personagem ENTRAR em um estado de FÚRIA;",
    "requirement": "perícia Armas Brancas e Lutar (Brigar)"
  },
  {
    "id": "golpe_aprimorado",
    "name": "Golpe Aprimorado",
    "description": "Um pouco de dano a mais sempre vem a calhar na batalha. Um golpe forte e bem acertado, capaz de fazer seus inimigos sucumbirem aos seus pés.\r\nBenefício :  O talento PERMITE que o próximo ataque com a perícia LUTAR (BRIGAR) / ARMAS BRANCAS  infringe o  +2 dados respectivos a rolagem +[(2*X)dX];",
    "requirement": "atributo Lutar (Brigar) e Armas Brancas"
  },
  {
    "id": "hacker",
    "name": "Hacker",
    "description": "A internet é um mar de informações, em que aqueles mais aventureiros nesse web-universo sabem exatamente encontrar o peixe que precisam. \r\nBenefício : RECEBA temporariamente  +[10] na perícia de USAR COMPUTADORES ao vasculhar ilegalmente informações na WEB e H-WARE (Banco de Dados da Agência Central de Segurança Global) mesmo sem o acesso devido.",
    "requirement": "atributo Usar Computadores"
  },
  {
    "id": "leitor_de_ventriloquo",
    "name": "Leitor de Ventríloquo",
    "description": "Nunca fique sem saber o que as pessoas ao seu redor estão falando sobre você, para isso o personagem desenvolveu a capacidade de leitura labial.\r\nBenefício : O talento PERMITE o personagem realizar LEITURA LABIAL, dentro da distância de sua visão;",
    "requirement": "perícia Encontrar"
  },
  {
    "id": "mentiroso_de_perna_comprida",
    "name": "Mentiroso de Perna Comprida",
    "description": "“Quem nunca contou uma mentirinha que jogue a primeira pedra!!”. Uma pessoa que tem tendência a enganar, mentir ou blefar fatos pode ser perigosa, então tenha cuidado.\r\nBenefício : O talento PERMITE que o personagem \r\n utilizar um  GOLPE BLEFADO;\r\nRECEBA temporariamente +[8] na perícia de ENGANAÇÃO ou ATUAÇÃO;",
    "requirement": "atributo Presença"
  },
  {
    "id": "mestre_das_armas",
    "name": "Mestre das Armas",
    "description": "Um lutador hábil quando se trata de armas de combate, treinar com esse equipamento permitiu o personagem ser proficiente com qualquer arma branca posta em sua mão. \r\n\r\nBenefício : O talento PERMITE que o personagem: \r\nTorna-se PROFICIENTE em TODAS as armas não recebendo DESVANTAGEM\r\nRECEBA temporariamente +[8] na perícia de ARMAS BRANCAS;\r\nRECONHECER a qualidade do equipamento;",
    "requirement": "perícia Armas Brancas"
  },
  {
    "id": "mestre_da_forja",
    "name": "Mestre da Forja",
    "description": "Sempre com um martelo em mãos, as armas e os objetos forjados por você, são da mais pura qualidade que o suor de ferreiro pode fazer. A proficiência em fabricar esses equipamentos é, sem dúvidas, uma obra de arte, sendo você o pintor.\r\nBenefício : O talento PERMITE o personagem CONFECCIONAR armas e equipamentos;",
    "requirement": "perícia Engenharia"
  },
  {
    "id": "mestre_de_montaria",
    "name": "Mestre de Montaria",
    "description": "Parabéns cowboy, você é proficiente em montar em qualquer criatura e manter-se equilibrado.\r\nBenefício : O talento PERMITE utilizar LIDAR COM ANIMAIS para MONTAR na criatura;",
    "requirement": "perícia Lidar com Animais"
  },
  {
    "id": "peso_pena",
    "name": "Peso Pena",
    "description": "Tão leve quanto uma brisa de verão. O corpo até pode ser robusto, mas sua velocidade prova o contrário.\r\nBenefício :  O talento PERMITE que o personagem:  \r\nRECEBA temporariamente  +[9] metros na sua AÇÃO DE MOVIMENTO \r\nPERMITE temporariamente  seus PASSOS serem SILENCIOSOS +[5] Furtividade;",
    "requirement": "Ação de Movimento"
  },
  {
    "id": "percepcao_aprimorada",
    "name": "Percepção Aprimorada",
    "description": "Sempre atento aos detalhes, da sua visão nada escapa. Qualquer detalhe ou ruídos suspeitos não passam despercebidos sobre você.\r\nBenefício :  O talento PERMITE que o personagem: \r\nAUMENTE temporariamente o valor da PERCEPÇÃO PASSIVA em +[5];\r\nRECEBA temporariamente +[8] na perícia de ENCONTRAR;",
    "requirement": "Percepção Passiva e Encontrar"
  },
  {
    "id": "persona_de_contatos",
    "name": "Persona de Contatos",
    "description": "Um homem com uma lista cheia de amigos, ou contados de agência de super-heróis, ou que já frequentou clubes, cassinos e até mesmo mercados negros, ou zonas de consumo de narcóticos. De alguma forma, seu número de telefone é conhecido por essa cidade, uns companheiros e conhecidos  podem te ajudar durante sua jornada.\r\nBenefício : O talento PERMITE uma vasta LISTA DE CONTATOS que são relacionados a sua história, escolha de vida ou ocupação;",
    "requirement": "Carisma"
  },
  {
    "id": "perito_em_explosivos",
    "name": "Perito em Explosivos",
    "description": "Desde um engenheiro especializado em bombas à um desmiolado com tara em explosivos. Manusear bombas e explosivos é uma tarefa fácil, só não corte o fio errado, porque se não KABUMM!!! \r\nBenefício :  O talento PERMITE que o personagem: \r\nFABRICAR, consumindo sucata, granadas e explosivos;\r\nRECEBA temporariamente +[8] na perícia de ENGENHARIA (quando manusear explosivos/bombas);",
    "requirement": "perícia de Engenharia"
  },
  {
    "id": "sabio_da_montanha",
    "name": "Sábio da Montanha",
    "description": "Estudar e aperfeiçoar seus conhecimentos em alguma área tornaram-o um sábio. Suas palavras para seus aprendizes são esclarecedoras.\r\nBenefício :  O talento PERMITE o personagem a ENSINAR um TALENTO para outro personagem, sem custo de pontos de progresso;",
    "requirement": "perícias Acadêmicas"
  },
  {
    "id": "sob_a_nevoa",
    "name": "Sob a Névoa",
    "description": "Ser silencioso, misturar-se nas sombras e não ser detectado, são habilidades que ninjas e gatunos têm.  A sombra e os cantos de penumbra são seus aliados para esconder sua presença.\r\nBenefício : RECEBA temporariamente +[8] na perícia de FURTIVIDADE;",
    "requirement": "perícia Furtividade"
  },
  {
    "id": "socorrista_de_elite",
    "name": "Socorrista de Elite",
    "description": "Um anjo guardião para aqueles que estão feridos. O socorrista de elite é capaz de fazer milagres usando tão pouco, sempre é importante ter um deles ao seu lado.\r\nBenefício : O talento PERMITE:\r\nSALVAR um personagem em estado MORRENDO (consome Kit Primeiros Socorros Inteiro), restaurando-o com [+30] Pontos de Vida;\r\nRECUPERA o DOBRO dos Pontos de Vida da Carga do Kit Primeiros Socorros (Um medkit possui 3 cargas padrão, regera-se), restaurando-o 2x([2d10]) Pontos de Vida;",
    "requirement": "perícia Primeiro Socorros e Medicina"
  },
  {
    "id": "zona",
    "name": "Zona",
    "description": "???????????? ??????????????? ????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????.\r\nBenefício :  O talento PERMITE ???????????????????????????;\r\nSequelas:  ???????????????????????????;",
    "requirement": "à ?????????????"
  }
];

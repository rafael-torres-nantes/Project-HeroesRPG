export interface EquipmentDef {
  id: string;
  name: string;
  category: 'melee' | 'ranged' | 'tool';
  weight: number;
  damage?: string;
  range?: string;
  cadence?: string;
  notes?: string;
  magazine?: string;
  advantage?: string;
  penalty?: string;
}

export const EQUIPMENT_CATALOG: EquipmentDef[] = [
  // MELEE
  { id: 'eq_m_1', name: 'Bastão de Combate', category: 'melee', weight: 0.5, damage: '2d8 + 4', notes: '[Dano Concussivo]' },
  { id: 'eq_m_2', name: 'Chicote', category: 'melee', weight: 0.5, damage: '2d4 + 2', notes: '[Dano Cortante]' },
  { id: 'eq_m_3', name: 'Espada', category: 'melee', weight: 1.0, damage: '2d10 + 6', notes: '[Dano Cortante]' },
  { id: 'eq_m_4', name: 'Faca / Adaga', category: 'melee', weight: 0.2, damage: '2d4 + 2', notes: '[Dano Perfurante]' },
  { id: 'eq_m_5', name: 'Foice', category: 'melee', weight: 1.5, damage: '3d8 + 4', notes: '[Dano Perfurante]' },
  { id: 'eq_m_6', name: 'Katana', category: 'melee', weight: 1.0, damage: '2d10 + 6', notes: '[Dano Cortante]' },
  { id: 'eq_m_7', name: 'Lança Longa', category: 'melee', weight: 1.0, damage: '2d12 + 8', notes: '[Dano Perfurante]' },
  { id: 'eq_m_8', name: 'Machado de Batalha', category: 'melee', weight: 2.0, damage: '3d12 + 8', notes: '[Dano Cortante]' },
  { id: 'eq_m_9', name: 'Machete', category: 'melee', weight: 0.5, damage: '2d6 + 2', notes: '[Dano Cortante]' },
  { id: 'eq_m_10', name: 'Mangual', category: 'melee', weight: 1.5, damage: '2d8 + 4', notes: '[Dano Cortante / Concussivo]' },
  { id: 'eq_m_11', name: 'Martelo de Combate', category: 'melee', weight: 2.0, damage: '3d10 + 6', notes: '[Dano Concussivo]' },
  { id: 'eq_m_12', name: 'Nunchaku', category: 'melee', weight: 1.0, damage: '2d8 + 4', notes: '[Dano Concussivo]' },
  { id: 'eq_m_13', name: 'Soco Inglês', category: 'melee', weight: 0.2, damage: '1d6 + 2', notes: '[Dano Concussivo]' },
  
  // RANGED
  { id: 'eq_r_1', name: 'Arco e Flecha', category: 'ranged', weight: 0.5, range: '36m', damage: '3d8', notes: '[Dano Perfurante] Silenciosa', cadence: '1/turno', magazine: '[X]' },
  { id: 'eq_r_2', name: 'Pistolas', category: 'ranged', weight: 1.0, range: '36m', damage: '3d8 + 6', notes: '[Dano Balístico]', cadence: '2/turno', magazine: '[6]' },
  { id: 'eq_r_3', name: 'Metralhadora Automática', category: 'ranged', weight: 2.0, range: '18m', damage: '3d8 + 6', notes: '[Dano Balístico]', cadence: '4/turno', magazine: '[12]' },
  { id: 'eq_r_4', name: 'Shotgun (Escopeta)', category: 'ranged', weight: 2.0, range: '0~9m', damage: '5d10 + 8', notes: '[Dano Balístico] 2 Mãos, diminui dano com distância', cadence: '1/turno', magazine: '[5]' },
  { id: 'eq_r_5', name: 'Rifle Sniper', category: 'ranged', weight: 4.0, range: '9~360m', damage: '5d12 + 10', notes: '[Dano Balístico] 2 mãos', cadence: '1/turno', magazine: '[4]' },

  // TOOLS
  { id: 'eq_t_1', name: 'Binóculos', category: 'tool', weight: 0.5, advantage: 'Enxergar detalhes fora do alcance normal.' },
  { id: 'eq_t_2', name: 'Botas de Fricção', category: 'tool', weight: 1.0, advantage: 'Andar sobre superfícies difíceis.' },
  { id: 'eq_t_3', name: 'Capacete de Visão Noturna', category: 'tool', weight: 1.0, advantage: 'Enxergar no escuro sem desvantagem.' },
  { id: 'eq_t_4', name: 'Capacete de Visão Térmica', category: 'tool', weight: 1.0, advantage: 'Enxergar objetos/criaturas emissoras de calor.' },
  { id: 'eq_t_5', name: 'Drone de Espionagem/Serviços', category: 'tool', weight: 2.0, advantage: 'Múltiplas utilidades (testes de Usar Computadores).' },
  { id: 'eq_t_6', name: 'Filtros de Oxigênio', category: 'tool', weight: 0.5, advantage: 'Respirar em ambientes tóxicos/submersos.' },
  { id: 'eq_t_7', name: 'IA Integrada / Notebook', category: 'tool', weight: 1.5, advantage: 'Acesso a internet e banco de dados H-WARE.' },
  { id: 'eq_t_8', name: 'Granada de Fragmentação', category: 'tool', weight: 0.5, advantage: 'Explosão em 9m causando 6d10 + 18. Dano reduz pela metade até 18m.' },
  { id: 'eq_t_9', name: 'Kit de Primeiros Socorros', category: 'tool', weight: 1.0, advantage: '3 Cargas. +10 Primeiro Socorros + Cura de 2d10 PV.' },
  { id: 'eq_t_10', name: 'Mantas de Proteção Térmica', category: 'tool', weight: 1.0, advantage: 'Garante 12 de Armadura contra Elemento Térmico (Calor, Frio, Estática).' },
  { id: 'eq_t_11', name: 'Mantas de Camuflagem', category: 'tool', weight: 1.0, advantage: 'Bônus de +10 em testes de Furtividade.' },
  { id: 'eq_t_12', name: 'Narcóticos', category: 'tool', weight: 0.1, advantage: '+10 em Perícia Específica ou +5 Atributo por 8h. Penalidades a escolha do mestre.' }
];
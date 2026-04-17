import type { Attributes } from '../types'

export interface SkillDef {
  id: string
  name: string
  attr: keyof Attributes
}

export interface SkillCategory {
  id: string
  label: string
  color: string
  skills: SkillDef[]
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'combate',
    label: 'Perícias de Combate',
    color: 'text-red-400',
    skills: [
      { id: 'armas_brancas', name: 'Armas Brancas', attr: 'FOR' },
      { id: 'armas_fogo_pistola', name: 'Armas de Fogo (Pistola)', attr: 'AGI' },
      { id: 'armas_fogo_rifles', name: 'Armas de Fogo (Rifles)', attr: 'AGI' },
      { id: 'arremessar', name: 'Arremessar', attr: 'AGI' },
      { id: 'bloquear', name: 'Bloquear', attr: 'FOR' },
      { id: 'esquivar', name: 'Esquivar', attr: 'AGI' },
      { id: 'lutar', name: 'Lutar (Brigar)', attr: 'FOR' },
    ],
  },
  {
    id: 'movimentacao',
    label: 'Perícias de Movimentação',
    color: 'text-green-400',
    skills: [
      { id: 'acrobacia', name: 'Acrobacia', attr: 'AGI' },
      { id: 'atletismo', name: 'Atletismo', attr: 'FOR' },
      { id: 'escalar', name: 'Escalar', attr: 'VIG' },
      { id: 'natacao', name: 'Natação', attr: 'VIG' },
      { id: 'saltar', name: 'Saltar', attr: 'AGI' },
    ],
  },
  {
    id: 'heroicas',
    label: 'Perícias Heróicas',
    color: 'text-violet-400',
    skills: [
      { id: 'controle', name: 'Controle', attr: 'POD' },
      { id: 'constituicao_mental', name: 'Constituição Mental', attr: 'PRE' },
      { id: 'sensitividade', name: 'Sensitividade', attr: 'POD' },
    ],
  },
  {
    id: 'academicas',
    label: 'Perícias Acadêmicas',
    color: 'text-blue-400',
    skills: [
      { id: 'antropologia', name: 'Antropologia', attr: 'INT' },
      { id: 'arte', name: 'Arte', attr: 'INT' },
      { id: 'biologia', name: 'Biologia', attr: 'INT' },
      { id: 'direito', name: 'Direito', attr: 'INT' },
      { id: 'engenharia', name: 'Engenharia', attr: 'INT' },
      { id: 'fisica', name: 'Física', attr: 'INT' },
      { id: 'fotografia', name: 'Fotografia', attr: 'AGI' },
      { id: 'historia', name: 'História', attr: 'INT' },
      { id: 'idiomas', name: 'Idiomas', attr: 'INT' },
      { id: 'medicina', name: 'Medicina', attr: 'INT' },
      { id: 'musica', name: 'Música', attr: 'INT' },
      { id: 'navegacao', name: 'Navegação', attr: 'INT' },
      { id: 'psicanálise', name: 'Psicanálise', attr: 'INT' },
      { id: 'religiao', name: 'Religião', attr: 'INT' },
      { id: 'quimica', name: 'Química', attr: 'INT' },
      { id: 'usar_biblioteca', name: 'Usar Biblioteca', attr: 'INT' },
      { id: 'usar_computadores', name: 'Usar Computadores', attr: 'INT' },
    ],
  },
  {
    id: 'interpessoais',
    label: 'Perícias Interpessoais',
    color: 'text-amber-400',
    skills: [
      { id: 'atuacao', name: 'Atuação', attr: 'PRE' },
      { id: 'charme', name: 'Charme', attr: 'PRE' },
      { id: 'diplomacia', name: 'Diplomacia', attr: 'PRE' },
      { id: 'engancao', name: 'Enganção', attr: 'PRE' },
      { id: 'intimidacao', name: 'Intimidação', attr: 'PRE' },
      { id: 'intuicao', name: 'Intuição', attr: 'PRE' },
      { id: 'labia', name: 'Lábia', attr: 'PRE' },
      { id: 'persuasao', name: 'Persuasão', attr: 'PRE' },
    ],
  },
  {
    id: 'gerais',
    label: 'Perícias Gerais',
    color: 'text-slate-300',
    skills: [
      { id: 'culinaria', name: 'Culinária', attr: 'INT' },
      { id: 'dirigir_veiculos', name: 'Dirigir Veículos', attr: 'INT' },
      { id: 'encontrar', name: 'Encontrar', attr: 'INT' },
      { id: 'escutar', name: 'Escutar', attr: 'INT' },
      { id: 'furtividade', name: 'Furtividade', attr: 'AGI' },
      { id: 'lidar_animais', name: 'Lidar com Animais', attr: 'PRE' },
      { id: 'operar_maquinas', name: 'Operar Máquinas', attr: 'INT' },
      { id: 'pilotar_aereos', name: 'Pilotar Aéreos', attr: 'INT' },
      { id: 'primeiros_socorros', name: 'Primeiros Socorros', attr: 'INT' },
      { id: 'rastrear', name: 'Rastrear', attr: 'INT' },
      { id: 'sobrevivencia', name: 'Sobrevivência', attr: 'AGI' },
    ],
  },
]

export const ALL_SKILLS: SkillDef[] = SKILL_CATEGORIES.flatMap(c => c.skills)

export function initSkills(): Record<string, number> {
  return Object.fromEntries(ALL_SKILLS.map(s => [s.id, 0]))
}

import type { Character, Item } from '../types'
import { DEFAULT_CHARACTERS } from '../data/defaultCharacters'

const KEYS = {
  characters: 'hik_characters',
  items: 'hik_items',
  seeded: 'hik_seeded_v1',
}

function parse<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function seedDefaults() {
  if (localStorage.getItem(KEYS.seeded)) return
  const existing = parse<Character>(KEYS.characters)
  if (existing.length === 0) {
    localStorage.setItem(KEYS.characters, JSON.stringify(DEFAULT_CHARACTERS))
  }
  localStorage.setItem(KEYS.seeded, '1')
}

seedDefaults()

export const storage = {
  getCharacters: (): Character[] => parse<Character>(KEYS.characters),
  saveCharacter: (c: Character) => {
    const all = storage.getCharacters().filter(x => x.id !== c.id)
    localStorage.setItem(KEYS.characters, JSON.stringify([...all, c]))
  },
  deleteCharacter: (id: string) => {
    localStorage.setItem(KEYS.characters, JSON.stringify(storage.getCharacters().filter(x => x.id !== id)))
  },
  getItems: (): Item[] => parse<Item>(KEYS.items),
  saveItem: (item: Item) => {
    const all = storage.getItems().filter(x => x.id !== item.id)
    localStorage.setItem(KEYS.items, JSON.stringify([...all, item]))
  },
  deleteItem: (id: string) => {
    localStorage.setItem(KEYS.items, JSON.stringify(storage.getItems().filter(x => x.id !== id)))
  },
  exportJSON: () => {
    const data = { characters: storage.getCharacters(), items: storage.getItems() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hik-data.json'
    a.click()
    URL.revokeObjectURL(url)
  },
  importJSON: (json: string) => {
    const data = JSON.parse(json)
    if (data.characters) localStorage.setItem(KEYS.characters, JSON.stringify(data.characters))
    if (data.items) localStorage.setItem(KEYS.items, JSON.stringify(data.items))
  },
}

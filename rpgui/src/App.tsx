import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CharacterEditor from './pages/CharacterEditor'
import ItemEditor from './pages/ItemEditor'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/characters/new" element={<CharacterEditor />} />
        <Route path="/characters/:id" element={<CharacterEditor />} />
        <Route path="/items/new" element={<ItemEditor />} />
        <Route path="/items/:id" element={<ItemEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

'use client';
import { createContext, useContext, useState } from 'react';
import { defaultProject } from '../lib/options.js';
const DraftContext = createContext(null);
export function DraftProvider({ children }) {
  const [project, setProject] = useState(defaultProject);
  const [drafts, setDrafts] = useState({});
  const [type, setType] = useState('feature');
  return <DraftContext.Provider value={{ project, setProject, drafts, setDrafts, type, setType }}>{children}</DraftContext.Provider>;
}
export function useDrafts() { return useContext(DraftContext); }

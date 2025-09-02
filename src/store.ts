import { create } from 'zustand';
import { OutlinerState, Doc } from './types';

export const useOutlinerStore = create<OutlinerState>((set) => ({
  doc: {
    type: 'doc',
    content: [],
  },
  setDoc: (doc: Doc) => set({ doc }),
}));

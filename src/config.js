import path from 'path';
import os from 'os';

export const CONFIG = {
  baseDir: path.join(os.homedir(), '.wasibase'),
  notesDir: path.join(os.homedir(), '.wasibase', 'notes'),
  tempDir: path.join(os.homedir(), '.wasibase', 'temp'),
  editor: process.env.EDITOR || 'vim'
};

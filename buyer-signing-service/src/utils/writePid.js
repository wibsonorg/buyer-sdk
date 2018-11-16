import fs from 'fs';
import path from 'path';

export default (_pidPath) => {
  const pidPath = path.resolve(_pidPath);
  fs.writeFileSync(pidPath, process.pid);
  process.on('exit', () => fs.unlink(pidPath));
};

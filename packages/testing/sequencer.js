import path from 'path';

export default class CustomSequencer {
  constructor(config) {
    this.config = config;
  }

  async sort(tests) {
    return [...tests].sort((a, b) => {
      const aName = path.basename(a.location.file);
      const bName = path.basename(b.location.file);

      // Extract numbers from the start of the filenames
      const aNum = parseInt(aName.match(/^\d+/)?.[0] || '999', 10);
      const bNum = parseInt(bName.match(/^\d+/)?.[0] || '999', 10);

      if (aNum !== bNum) {
        return aNum - bNum;
      }

      // If numbers match, sort by full path to ensure consistency across directories
      const aPath = a.location.file.toLowerCase();
      const bPath = b.location.file.toLowerCase();
      return aPath.localeCompare(bPath, undefined, { numeric: true, sensitivity: 'base' });
    });
  }
}

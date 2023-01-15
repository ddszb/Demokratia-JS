interface String {
  parseArgs(...args: (string | number)[]): string;
}

String.prototype.parseArgs = function (...args: (string | number)[]): string {
  return this.replace(/{(\d+)}/g, (_, m) => args[m].toString() || '');
};

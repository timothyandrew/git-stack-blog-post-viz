export class Commit {
    branches: string[];
    parent?: Commit;
    sha: number;
    isHead: boolean;
    isBranchTipFor: string[];

    randHex(size): string {
        return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    constructor(parent: Commit | undefined, branches: string[]) {
      this.branches = branches;
      this.isBranchTipFor = [];

      if (parent) {
        this.parent = parent;
        this.sha = parent.sha + 1;
      } else {
        this.sha = 1;
      }
    }

    getBg(): string {
      if (this.branches[0] === 'master') { return '#FBBF24' }
      if (this.branches[0] === 'f1') { return '#F472B6' }
    }

    getFg(): string {
        return '#FFFFFF';
    }

    getBorder(): string {
        return '#000';
    }
}
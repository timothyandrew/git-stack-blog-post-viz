export class Commit {
    branch: string;
    parent?: Commit;
    sha: number;
    isHead: boolean;
    isBranchTip: boolean;

    randHex(size): string {
        return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    constructor(parent: Commit | undefined, branch: string = "master") {
      this.branch = branch;

      if (parent) {
          this.parent = parent;
          this.sha = parent.sha + 1;
      } else {
          this.sha = 1;
      }
    }

    getBg(): string {
        return '#FBBF24';
    }

    getFg(): string {
        return '#FFFFFF';
    }

    getBranchFg(): strint {
      return '#000';
    }

    getBorder(): string {
        return '#000';
    }
}
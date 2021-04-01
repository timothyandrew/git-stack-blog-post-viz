export interface CommitHighlight {
  enabled: boolean;
  label?: string;
}

export class Commit {
    branches: string[];
    parent?: Commit;
    // KLUDGE: For merge commits. Doing this is easier than updating
    // all call sites to use an array for `parent`
    secondParent?: Commit;
    isHead: boolean;
    isBranchTipFor: string[];
    jitter: string;
    highlight?: CommitHighlight;

    hash(s: string): string {
      const chars = Array
          .from(s)
          .map(c => c.charCodeAt(0))
          .reduce((acc, x) => acc + 1000 * x);

      return chars.toString(16);

    }

    constructor(parent: Commit | undefined,
                branches: string[],
                secondParent: Commit | undefined = undefined) {
      this.branches = branches;
      this.secondParent = secondParent;
      this.isBranchTipFor = [];
      this.jitter = "";

      if (parent) {
        this.parent = parent;
      }
    }

    getSha(): string {
      const uniq = this.getRawSha() + this.branches[0];
      return this.hash(uniq).slice(0, 4);
    }

    getRawSha(): string {
      if (this.parent) {
        return this.jitter + (this.parent.getRawSha() + JSON.stringify(this.parent.branches) + (this.secondParent ? this.secondParent.sha : '0')) + JSON.stringify(this.branches);
      } else {
        return '1';
      }
    }

    getBg(): string {
      if (this.branches[0] === 'master') { return '#FBBF24' }
      if (this.branches[0] === 'f1') { return '#34D399' }
      if (this.branches[0] === 'f2') { return '#60A5FA' }
      if (this.branches[0] === 'f3') { return '#F472B6' }
      if (this.branches[0] === 'origin/master') { return '#F59E0B' }
      if (this.branches[0] === 'origin/f1') { return '#059669' }
      if (this.branches[0] === 'origin/f2') { return '#EC4899' }
    }

    getFg(): string {
        return '#FFFFFF';
    }

    getBorder(): string {
        return '#000';
    }
}
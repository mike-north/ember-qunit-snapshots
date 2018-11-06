declare module 'snap-shot-core' {
  interface SnapErr {
    expected: object;
    value: object;
  }
  interface SnapOptions {
    what: string | object;
    file: string;
    raiser?: (err: SnapErr) => void;
    exactSpecName?: string;
    opts?: {
      show?: any;
      dryRun?: any;
      update?: any;
      ci?: any;
    };
  }
  function core(snapOptions: SnapOptions): any;
}

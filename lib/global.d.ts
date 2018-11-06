declare module 'snap-shot-core' {
  interface SnapErr {
    expected: object;
    value: object;
  }
  interface SnapEnvOptions {
    show?: any;
    dryRun?: any;
    update?: any;
    ci?: any;
  }
  interface SnapOptions {
    what: string | object;
    file: string;
    raiser?: (err: SnapErr) => void;
    exactSpecName?: string;
    opts?: SnapEnvOptions;
  }
  function core(snapOptions: SnapOptions): any;
}

declare module 'ci-info' {
  const isCI: boolean;
}

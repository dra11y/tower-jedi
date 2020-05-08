export class UpdateChart {
  static readonly type = '[CHART] UpdateChart';
}

export class UpdateCamera {
    static readonly type = '[CHART] UpdateCamera'

    constructor(public camera: any) { }
}

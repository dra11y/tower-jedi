export class GetTowers {
  static readonly type = '[TOWER] Get';
}

export class FireAtTower {
  static readonly type = '[TOWER] FireAtTower';

  constructor(public id: number) { }
}

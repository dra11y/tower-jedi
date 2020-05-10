export class CheckIfWon {
    static readonly type = '[GAME] CheckIfWon';
}

export class NewGame {
    static readonly type = '[GAME] NewGame';

    constructor(public count: number) { }
}

export class InitGame {
    static readonly type = '[GAME] InitGame';
}

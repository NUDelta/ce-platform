export const CerebroCore = class CerebroCore {
  constructor() {
    this.NOTIFY_ALL = false;
    this.NOTIFY_METHOD = CerebroCore.PUSH;
  }

  static get EMAIL() {
    return 'EMAIL';
  }

  static get PUSH() {
    return 'PUSH';
  }
};

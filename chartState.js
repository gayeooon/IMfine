/**
 * 차트 데이터 상태를 관리하는 클래스
 * 데이터 추가, 업데이트 및 Observer 패턴을 통한 상태 변경 알림 기능을 제공합니다.
 */
class ChartState {
  /** @private {Array<{id: string, value: number}>} 차트 데이터 배열 */
  #chartData;

  /** @private {Array<Function>} 상태 변경 시 호출될 콜백 함수 배열 */
  #subscribers;

  /**
   * ChartState 인스턴스 생성자
   */
  constructor() {
    this.#chartData = [];
    this.#subscribers = [];
  }

  /**
   * 현재 차트 데이터의 복사본을 반환합니다.
   * @returns {Array<{id: string, value: number}>} 차트 데이터 배열의 복사본
   */
  getData() {
    return [...this.#chartData];
  }

  /**
   * 차트 데이터를 새로운 데이터로 업데이트합니다.
   * @param {Array<{id: string, value: number}>} newData 새로운 차트 데이터 배열
   * @throws {Error} ID 중복, 빈 ID, 값이 범위를 벗어나는 경우
   */
  updateData(newData) {
    this.#chartData.length = 0;

    newData.forEach((item) => this.#pushValidItem(item));
    this.#notify();
  }

  /**
   * 새로운 항목을 차트 데이터에 추가합니다.
   * @param {{id: string, value: number}} newItem 추가할 항목
   * @throws {Error} ID 중복, 빈 ID, 값이 범위를 벗어나는 경우
   */
  addItem(newItem) {
    this.#pushValidItem(newItem);
    this.#notify();
  }

  /**
   * 항목의 유효성을 검사하고 유효한 경우 차트 데이터에 추가합니다.
   * @private
   * @param {{id: string, value: number}} newItem 검증 후 추가할 항목
   * @throws {Error} ID 중복, 빈 ID, 값이 범위를 벗어나는 경우
   */
  #pushValidItem(newItem) {
    // ID 중복 검사
    if (this.#chartData.some((item) => item.id === newItem.id)) {
      throw new Error(`ID '${newItem.id}'가 중복입니다.`);
    }

    // ID가 비어있는지 검사
    if (!newItem.id || newItem.id.trim() === '') {
      throw new Error('ID는 비어있을 수 없습니다.');
    }

    // 값이 0보다 작은지 검사
    if (newItem.value > 100) {
      throw new Error('값은 100 이하여야 합니다.');
    }

    // 값이 100보다 큰지 검사
    if (newItem.value < 0) {
      throw new Error('값은 0 이상이어야 합니다.');
    }

    this.#chartData.push(newItem);
  }

  /**
   * 차트 데이터 변경 시 호출될 콜백 함수를 등록합니다.
   * @param {Function} callback 차트 데이터가 변경될 때 호출될 콜백 함수
   */
  subscribe(callback) {
    this.#subscribers.push(callback);
  }

  /**
   * 모든 구독자에게 차트 데이터 변경을 알립니다.
   * @private
   */
  #notify() {
    this.#subscribers.forEach((callback) => callback(this.getData()));
  }
}

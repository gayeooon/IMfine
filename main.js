/**
 * 차트 컴포넌트를 초기화하고 렌더링 함수를 반환합니다.
 * @returns {{render: Function}} render 함수를 포함한 객체
 */
const setupChart = () => {
  const graphBars = document.getElementById('graphBars');
  const graphXAxis = document.getElementById('graphXAxis');

  /**
   * 차트 데이터를 기반으로 그래프를 렌더링합니다.
   * @param {Array<{id: string, value: number}>} data 렌더링할 차트 데이터
   */
  const render = (data) => {
    graphBars.innerHTML = '';
    graphXAxis.innerHTML = '';

    data.forEach((item) => {
      // 막대 생성
      const bar = document.createElement('div');
      bar.className = 'graph__bar';
      bar.style.height = `${item.value}%`;
      graphBars.appendChild(bar);

      // x축 레이블 생성
      const label = document.createElement('span');
      label.className = 'graph__label-x';
      label.textContent = item.id;
      graphXAxis.appendChild(label);
    });
  };

  return { render };
};

/**
 * 값 편집 테이블을 초기화하고 렌더링 함수를 반환합니다.
 * @param {Function} onSubmit 테이블 데이터가 변경되고 적용될 때 호출되는 콜백
 * @returns {{render: Function}} render 함수를 포함한 객체
 */
const setupTable = (onSubmit) => {
  const tableBody = document.getElementById('tableBody');
  const tableForm = document.getElementById('tableForm');

  /**
   * 폼 제출 시 새로운 차트 데이터를 적용합니다.
   * @param {Event} e 이벤트 객체
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const newData = rows.map((row) => {
      const id = row.querySelector('td:first-child').textContent;
      const value = Number(row.querySelector('input').value);
      return { id, value };
    });

    try {
      onSubmit(newData);
    } catch (err) {
      alert(err.message);
    }
  };

  tableForm.addEventListener('submit', handleSubmit);

  /**
   * 차트 데이터를 기반으로 테이블을 렌더링합니다.
   * @param {Array<{id: string, value: number}>} data 렌더링할 차트 데이터
   */
  const render = (data) => {
    tableBody.innerHTML = '';

    data.forEach((item) => {
      // 테이블 행 생성
      const tr = document.createElement('tr');

      // ID 셀
      const tdId = document.createElement('td');
      tdId.textContent = item.id;
      tr.appendChild(tdId);

      // 값 입력 셀
      const tdValue = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.max = '100';
      input.min = '0';
      input.required = true;
      input.value = item.value;
      tdValue.appendChild(input);
      tr.appendChild(tdValue);

      // 삭제 버튼 셀
      const tdDelete = document.createElement('td');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '삭제';
      button.addEventListener('click', () => tr.remove());
      tdDelete.appendChild(button);
      tr.appendChild(tdDelete);

      tableBody.appendChild(tr);
    });
  };

  return { render };
};

/**
 * 값 추가 폼을 초기화합니다.
 * @param {Function} onSubmit 새 항목이 추가될 때 호출되는 콜백
 */
const setupAddForm = (onSubmit) => {
  const addForm = document.getElementById('addForm');

  /**
   * 폼 제출 시 새 항목을 추가합니다.
   * @param {Event} e 이벤트 객체
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const idInput = e.target.querySelector('input[name="id"]');
    const valueInput = e.target.querySelector('input[name="value"]');

    try {
      onSubmit({
        id: idInput.value,
        value: Number(valueInput.value),
      });

      idInput.value = '';
      valueInput.value = '';
    } catch (err) {
      alert(err.message);
    }
  };

  addForm.addEventListener('submit', handleSubmit);
};

/**
 * JSON 편집란을 초기화하고 렌더링 함수를 반환합니다.
 * @param {Function} onSubmit JSON 데이터가 변경되고 적용될 때 호출되는 콜백
 * @returns {{render: Function}} render 함수를 포함한 객체
 */
const setupJsonEditor = (onSubmit) => {
  const jsonForm = document.getElementById('jsonForm');
  const jsonInput = document.getElementById('jsonInput');

  /**
   * 폼 제출 시 JSON 데이터를 파싱하여 적용합니다.
   * @param {Event} e 이벤트 객체
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const parsed = JSON.parse(jsonInput.value);
      onSubmit(parsed);
    } catch (err) {
      alert(err.message);
    }
  };

  jsonForm.addEventListener('submit', handleSubmit);

  /**
   * 차트 데이터를 기반으로 JSON 편집란을 렌더링합니다.
   * @param {Array<{id: string, value: number}>} data 렌더링할 차트 데이터
   */
  const render = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    jsonInput.value = jsonData;

    jsonInput.style.height = `${jsonInput.scrollHeight}px`;
  };

  return { render };
};

/**
 * 문서가 로드되면 애플리케이션을 초기화합니다.
 * ChartState 인스턴스를 생성하고 UI 컴포넌트와 연결합니다.
 */
document.addEventListener('DOMContentLoaded', () => {
  // ChartState 인스턴스 생성
  const chartState = new ChartState();

  // 데이터 조작 함수 정의
  const updateData = (newData) => chartState.updateData(newData);
  const addItem = (newItem) => chartState.addItem(newItem);

  // UI 컴포넌트 초기화
  const chart = setupChart();
  const table = setupTable(updateData);
  const jsonEditor = setupJsonEditor(updateData);
  setupAddForm(addItem);

  // 상태 변경 구독
  chartState.subscribe(chart.render);
  chartState.subscribe(table.render);
  chartState.subscribe(jsonEditor.render);

  // render 트리거
  updateData([]);
});

/**
 * 페이지 이탈 시 경고 알림을 설정합니다.
 */
window.addEventListener('beforeunload', (event) => {
  event.preventDefault();

  // 브라우저 기본 확인 메시지 표시
  return '';
});

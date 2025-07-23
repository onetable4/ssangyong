const TARGET_WORD = "한약"; // 정답 단어
const feedbackContainer = document.getElementById('feedback');
const guessInput = document.getElementById('guess');
const submitBtn = document.getElementById('submitBtn');
const historyContainer = document.getElementById('history');
const successMessage = document.getElementById('successMessage');
const footerContainer = document.getElementById('footer');

// 초성, 중성, 종성 분리
const decomposeHangul = (char) => {
  const BASE_CODE = 44032;
  const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  const JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
  const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

  const code = char.charCodeAt(0) - BASE_CODE;
  const cho = CHO[Math.floor(code / 588)];
  const jung = JUNG[Math.floor((code % 588) / 28)];
  const jong = JONG[code % 28];

  return [cho, jung, jong];
};

// 피드백 생성
const getFeedback = (guess, answer) => {
  return [...guess].map((char, i) => {
    const [gc, gj, gk] = decomposeHangul(char);
    const [ac, aj, ak] = decomposeHangul(answer[i]);

    if (char === answer[i]) return { char, status: "녹용" }; // 정확
    const matchCount = [gc, gj, gk].filter(x => [ac, aj, ak].includes(x)).length;
    if (gc === ac && matchCount >= 2) return { char, status: "버섯" }; // 첫 자음과 모음, 받침이 일치
    if (gc !== ac && matchCount >= 2) return { char, status: "마늘" }; // 자음이나 모음 일치
    if (matchCount === 1) return { char, status: "가지" }; // 자모 중 하나만 일치
    if ([...answer].some(a => decomposeHangul(a).includes(gc) || decomposeHangul(a).includes(gj) || decomposeHangul(a).includes(gk))) return { char, status: "바나나" }; // 다른 곳 일치
    return { char, status: "사과" }; // 일치하지 않음
  });
};

// 제출 시 처리
const handleSubmit = () => {
  const guess = guessInput.value.trim();

  if (guess.length !== 2) {
    alert("두 글자만 입력해 주세요.");
    return;
  }

  // 피드백 생성
  const feedback = getFeedback(guess, TARGET_WORD);

  // 게임 히스토리 표시 (입력값과 피드백)
  const historyDiv = document.createElement('div');
  historyDiv.className = 'flex gap-2 justify-center';  // 한 줄에 2개씩 정렬
  guess.split('').forEach((char, i) => {
    const charDiv = document.createElement('div');
    // 인라인 스타일로 직접 배경색 적용
    charDiv.style.backgroundColor = getBackgroundColor(feedback[i].status);
    charDiv.className = `p-6 text-center text-xl font-bold w-16 h-16 border border-black`;
    charDiv.innerText = char;
    historyDiv.appendChild(charDiv);
  });

  // 피드백을 아래에 함께 표시 (이모지)
  feedback.forEach(f => {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `text-center text-lg mt-2`;
    feedbackDiv.innerText = getEmoji(f.status);
    historyDiv.appendChild(feedbackDiv);
  });

  historyContainer.appendChild(historyDiv); // 히스토리 추가

  // 정답 맞추면 메시지 표시
  if (guess === TARGET_WORD) {
    showSuccessMessage();
    disableSubmitButton();
    addFooterText();
  }

  guessInput.value = ''; // 입력창 비우기
};

// 색상 클래스 지정 (배경색 직접 적용)
const getBackgroundColor = (status) => {
  const colorMap = {
    녹용: '#6C3C0C', // 주황색 (직접 색상 코드 사용)
    버섯: '#FF69B4', // 분홍색
    마늘: '#FAEBD7', // 베이지색 (마늘)
    가지: '#800080', // 보라색
    바나나: '#FFFF00', // 노랑색
    사과: '#FF0000', // 빨강색
  };
  return colorMap[status] || '#D3D3D3'; // 기본 색상 (사과)
};

// 이모지 반환
const getEmoji = (status) => {
  const emojiMap = {
    녹용: '🦌',
    버섯: '🍄',
    마늘: '🧄',
    가지: '🍆',
    바나나: '🍌',
    사과: '🍎',
  };
  return emojiMap[status] || '';
};

// 정답 메시지 띄우기
const showSuccessMessage = () => {
  successMessage.classList.remove('opacity-0', 'pointer-events-none');
  successMessage.classList.add('opacity-100');
  setTimeout(() => {
    successMessage.classList.add('opacity-0', 'pointer-events-none');
  }, 2000);
};

// 제출 버튼 비활성화
const disableSubmitButton = () => {
  submitBtn.disabled = true;
  submitBtn.style.backgroundColor = '#D3D3D3'; // 버튼 색상 변경 (비활성화 상태)
};

// 버튼 클릭 이벤트
submitBtn.addEventListener('click', handleSubmit);

// ==============================================
// ハンバーガーメニュー
// ==============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // メニューが開いているときはスクロールを無効化
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // メニュー内のリンクをクリックしたらメニューを閉じる
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ==============================================
// スムーススクロール
// ==============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==============================================
// ヘッダーのスクロール制御
// ==============================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==============================================
// 固定CTAボタンの表示制御
// ==============================================
const fixedCta = document.getElementById('fixedCta');
let scrollTimeout;
let isScrolling = false;

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const contactSection = document.getElementById('contact');

    // 問い合わせセクションの位置を取得
    const contactTop = contactSection ? contactSection.offsetTop : Infinity;

    // 問い合わせセクションに到達したかチェック
    const isInContactSection = scrollPosition + windowHeight > contactTop;

    // スクロール位置が画面の高さを超えているかチェック
    const shouldBeVisible = scrollPosition > windowHeight * 0.5 && !isInContactSection;

    if (shouldBeVisible) {
        // スクロール中は非表示
        if (!isScrolling) {
            isScrolling = true;
            fixedCta.classList.remove('visible');
            fixedCta.classList.add('scrolling');
        }

        // タイマーをクリア
        clearTimeout(scrollTimeout);

        // スクロールが止まったら表示
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            fixedCta.classList.remove('scrolling');
            fixedCta.classList.add('visible');
        }, 300); // 300ms後に表示
    } else {
        fixedCta.classList.remove('visible');
        fixedCta.classList.remove('scrolling');
    }
});

// ==============================================
// フォームバリデーション
// ==============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // フォームの入力値を取得
        const formData = new FormData(contactForm);
        const inquiryType = formData.get('inquiry-type');
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const address = formData.get('address');
        const privacy = formData.get('privacy');

        // バリデーション
        if (!inquiryType || !name || !phone || !email || !address) {
            alert('必須項目をすべて入力してください。');
            return;
        }

        if (!privacy) {
            alert('プライバシーポリシーに同意してください。');
            return;
        }

        // メールアドレスの形式チェック
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('有効なメールアドレスを入力してください。');
            return;
        }

        // 実際の送信処理はここに実装
        alert('お問い合わせありがとうございます。\n担当者より3営業日以内にご連絡いたします。');
        contactForm.reset();
    });
}

// ==============================================
// スクロールアニメーション（Intersection Observer）
// ==============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象の要素を設定
const animateElements = document.querySelectorAll(
    '.benefit-card, .case-study-card, .voice-card, .empathy-image-item'
);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==============================================
// パララックス効果
// ==============================================
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image img');

    if (heroSection && heroImage) {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;

        // ヒーローセクション内でのみパララックス効果を適用
        if (scrolled < heroHeight) {
            const parallaxSpeed = scrolled * 0.5;
            heroImage.style.transform = `translateY(${parallaxSpeed}px) scale(1.1)`;
        }
    }
});

// ==============================================
// 施工事例カルーセル（無限ループ）
// ==============================================
const caseStudiesTrack = document.querySelector('.case-studies-track');
const caseStudiesCarousel = document.querySelector('.case-studies-carousel');

if (caseStudiesTrack && caseStudiesCarousel) {
    const cards = Array.from(caseStudiesTrack.children);

    // カードを1回だけ複製して2セット作成（シームレスループ用）
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        caseStudiesTrack.appendChild(clone);
    });

    // ホバー時はアニメーション一時停止
    caseStudiesCarousel.addEventListener('mouseenter', () => {
        caseStudiesTrack.style.animationPlayState = 'paused';
    });

    caseStudiesCarousel.addEventListener('mouseleave', () => {
        caseStudiesTrack.style.animationPlayState = 'running';
    });
}

// ==============================================
// ページ読み込み完了後の処理
// ==============================================
window.addEventListener('load', () => {
    // ローディングアニメーションなどがあればここに実装
    console.log('リノベーションLP v2 ロード完了');
});

// ==============================================
// 心理テスト（エゴグラム診断）
// ==============================================
const quizModule = (() => {
    // 質問データ（3段階構成：性格→ライフスタイル→住まい）
    // CP: 厳格な親, NP: 養育的な親, A: 成人, FC: 自由な子供, AC: 順応した子供

    // Phase1: 性格に関する質問（Q1-3から3問）- 各タイプ2問ずつ
    const phase1Questions = [
        { text: "好奇心旺盛で、新しいことに挑戦するのが好きだ", type: "FC" },
        { text: "感動したことは誰かに話したくなる", type: "FC" },
        { text: "物事は計画を立ててから進めるタイプだ", type: "A" },
        { text: "論理的に考えて行動することが多い", type: "A" },
        { text: "周りの人を気遣い、サポートすることが多い", type: "NP" },
        { text: "人の相談に乗ることが多い", type: "NP" },
        { text: "目標を決めたら、最後までやり遂げたい", type: "CP" },
        { text: "自分なりのルールや信念を大切にしている", type: "CP" },
        { text: "周囲の空気を読んで行動することが多い", type: "AC" },
        { text: "人と違う意見を言うのは苦手だ", type: "AC" }
    ];

    // Phase2: ライフスタイルに関する質問（Q4-5から2問）- 各タイプ2問ずつ
    const phase2Questions = [
        { text: "休日は家でゆっくり過ごすより外出したい", type: "FC" },
        { text: "自分だけの趣味の時間を大切にしている", type: "FC" },
        { text: "仕事とプライベートはきっちり分けたい", type: "A" },
        { text: "効率的に家事を済ませたい", type: "A" },
        { text: "友人を家に招くことが好きだ", type: "NP" },
        { text: "家族と過ごす時間を大切にしている", type: "NP" },
        { text: "生活空間は常に整理整頓されていないと落ち着かない", type: "CP" },
        { text: "自分で決めたルーティンを守ることが多い", type: "CP" },
        { text: "家では誰にも邪魔されずリラックスしたい", type: "AC" },
        { text: "一人で静かに過ごす時間が好きだ", type: "AC" }
    ];

    // Phase3: 住まいに関する質問（Q6-8から3問）- 各タイプ2問ずつ
    const phase3Questions = [
        { text: "部屋のインテリアには自分のこだわりを反映させたい", type: "FC" },
        { text: "他の人とは違う、個性的な部屋に住みたい", type: "FC" },
        { text: "シンプルで無駄のない空間が好きだ", type: "A" },
        { text: "収納がしっかりあって、すっきり暮らせる部屋がいい", type: "A" },
        { text: "温かみのある、居心地の良い空間に憧れる", type: "NP" },
        { text: "家族や友人が集まりやすい部屋にしたい", type: "NP" },
        { text: "落ち着いた色合いの空間が好きだ", type: "AC" },
        { text: "周りと調和する、落ち着いた雰囲気の部屋がいい", type: "AC" },
        { text: "高品質で長く使える素材や家具を選びたい", type: "CP" },
        { text: "掃除がしやすく、清潔感を保てる部屋がいい", type: "CP" }
    ];

    // パーソナリティタイプと対応する部屋
    const personalityTypes = {
        FC: {
            name: "自由奔放クリエイタータイプ",
            desc: "あなたは好奇心旺盛で、感情表現が豊かな方です。自分の「好き」を大切にし、遊び心を忘れない創造的なタイプ。そんなあなたには、自由な発想を刺激する空間がぴったりです。",
            room: {
                img: "images/gallery1-7.jpg",
                title: "ナチュラルモダンスタイル",
                desc: "木のぬくもりと開放感が共存する空間。あなたの創造性を刺激し、自由な発想が生まれる部屋です。"
            }
        },
        NP: {
            name: "思いやりあふれるケアギバータイプ",
            desc: "あなたは他者への思いやりが強く、周りを温かく見守る優しい方です。人の成長を喜び、サポートすることに生きがいを感じるタイプ。そんなあなたには、温もりのある癒しの空間がぴったりです。",
            room: {
                img: "images/gallery1-5.jpg",
                title: "シンプル北欧スタイル",
                desc: "白とライトグレーを基調に、木材のアクセントを加えた北欧テイスト。人を招きたくなる温かみのある空間です。"
            }
        },
        A: {
            name: "冷静沈着アナリストタイプ",
            desc: "あなたは論理的思考が得意で、事実に基づいて判断する合理的な方です。計画性があり、冷静に物事を分析できるタイプ。そんなあなたには、機能的で整理された空間がぴったりです。",
            room: {
                img: "images/gallery1-1.jpg",
                title: "シンプルモダン1LDK",
                desc: "無駄を削ぎ落とした美しさ。白とグレーの配色で、集中力を高める洗練された都会的な空間です。"
            }
        },
        CP: {
            name: "完璧主義リーダータイプ",
            desc: "あなたは目標達成への意志が強く、自分にも他人にも高い基準を求める方です。責任感があり、物事をきちんとやり遂げるタイプ。そんなあなたには、洗練された格調高い空間がぴったりです。",
            room: {
                img: "images/gallery1-4.jpg",
                title: "モノトーンモダン",
                desc: "黒と白のコントラストが美しい、シックで落ち着いた空間。大人の余裕と品格を感じさせるデザインです。"
            }
        },
        AC: {
            name: "調和を大切にするハーモナイザータイプ",
            desc: "あなたは周囲との調和を大切にし、場の空気を読むことが得意な方です。控えめながらも芯の強さを持つタイプ。そんなあなたには、落ち着きのある穏やかな空間がぴったりです。",
            room: {
                img: "images/gallery1-2.jpg",
                title: "ホワイト×グレーの洗練空間",
                desc: "モノトーンで統一された上質な空間。間接照明が柔らかな陰影を生み出し、心地よい静けさを演出します。"
            }
        }
    };

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let scores = { CP: 0, NP: 0, A: 0, FC: 0, AC: 0 };
    let quizShown = false;

    // 各フェーズからランダムに選択して8問構成
    function selectRandomQuestions() {
        const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

        // Phase1から3問、Phase2から2問、Phase3から3問を選択
        const selected1 = shuffle(phase1Questions).slice(0, 3);
        const selected2 = shuffle(phase2Questions).slice(0, 2);
        const selected3 = shuffle(phase3Questions).slice(0, 3);

        // 順番通りに結合（性格→ライフスタイル→住まい）
        return [...selected1, ...selected2, ...selected3];
    }

    // スコア計算
    function calculateScore(answer, questionType) {
        if (answer === 'yes') {
            scores[questionType] += 2;
        } else if (answer === 'neutral') {
            scores[questionType] += 1;
        }
        // 'no' は0点
    }

    // 最高得点のタイプを取得
    function getDominantType() {
        let maxScore = -1;
        let dominantType = 'FC';

        for (const [type, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                dominantType = type;
            }
        }
        return dominantType;
    }

    // DOM要素
    const modal = document.getElementById('quizModal');
    const startScreen = document.getElementById('quizStart');
    const questionScreen = document.getElementById('quizQuestion');
    const resultScreen = document.getElementById('quizResult');
    const startBtn = document.getElementById('startQuizBtn');
    const closeBtns = document.querySelectorAll('.quiz-close-btn');
    const answerBtns = document.querySelectorAll('.quiz-answer-btn');
    const backToLpBtn = document.getElementById('backToLpBtn');
    const questionText = document.getElementById('questionText');
    const currentQuestionNum = document.getElementById('currentQuestion');

    // モーダルを開く
    function openQuiz() {
        if (quizShown) return;
        quizShown = true;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // モーダルを閉じる
    function closeQuiz() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        resetQuiz();
    }

    // クイズをリセット
    function resetQuiz() {
        currentQuestionIndex = 0;
        scores = { CP: 0, NP: 0, A: 0, FC: 0, AC: 0 };
        startScreen.style.display = 'block';
        questionScreen.style.display = 'none';
        resultScreen.style.display = 'none';
    }

    // クイズ開始
    function startQuiz() {
        currentQuestions = selectRandomQuestions();
        currentQuestionIndex = 0;
        scores = { CP: 0, NP: 0, A: 0, FC: 0, AC: 0 };

        startScreen.style.display = 'none';
        questionScreen.style.display = 'block';
        showQuestion();
    }

    // 質問を表示
    function showQuestion() {
        const question = currentQuestions[currentQuestionIndex];
        questionText.textContent = question.text;
        currentQuestionNum.textContent = currentQuestionIndex + 1;

        // プログレスバーを更新
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = ((currentQuestionIndex + 1) / 8) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // ランダムにイラストを変更
        const quizIllustration = document.getElementById('quizIllustration');
        if (quizIllustration) {
            const randomNum = Math.floor(Math.random() * 7) + 1;
            quizIllustration.style.backgroundImage = `url('images/psychological test/illustration${randomNum}.png')`;
        }
    }

    // 回答処理
    function handleAnswer(answer) {
        const question = currentQuestions[currentQuestionIndex];
        calculateScore(answer, question.type);

        currentQuestionIndex++;

        if (currentQuestionIndex >= 8) {
            showResult();
        } else {
            showQuestion();
        }
    }

    // 結果を表示
    function showResult() {
        const dominantType = getDominantType();
        const personality = personalityTypes[dominantType];

        questionScreen.style.display = 'none';
        resultScreen.style.display = 'block';

        document.getElementById('resultType').textContent = personality.name;
        document.getElementById('resultTypeDesc').textContent = personality.desc;
        document.getElementById('resultRoomImg').src = personality.room.img;
        document.getElementById('resultRoomTitle').textContent = personality.room.title;
        document.getElementById('resultRoomDesc').textContent = personality.room.desc;
    }

    // イベントリスナー設定
    function init() {
        if (!modal) return;

        startBtn?.addEventListener('click', startQuiz);

        closeBtns.forEach(btn => {
            btn.addEventListener('click', closeQuiz);
        });

        answerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                handleAnswer(btn.dataset.value);
            });
        });

        backToLpBtn?.addEventListener('click', () => {
            closeQuiz();
            // 施工事例セクションにスクロール
            const caseStudySection = document.getElementById('case-study');
            if (caseStudySection) {
                caseStudySection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // 背景クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeQuiz();
            }
        });

        // empathyセクション進入時にクイズを表示
        const empathySection = document.getElementById('empathy');
        if (empathySection) {
            const quizObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !quizShown) {
                        setTimeout(() => {
                            openQuiz();
                        }, 500);
                    }
                });
            }, {
                threshold: 0.3
            });
            quizObserver.observe(empathySection);
        }
    }

    return { init, openQuiz };
})();

// クイズモジュール初期化
document.addEventListener('DOMContentLoaded', () => {
    quizModule.init();
});

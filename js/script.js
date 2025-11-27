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
    // 質問データ（エゴグラムの5つの自我状態に対応）
    // CP: 厳格な親, NP: 養育的な親, A: 成人, FC: 自由な子供, AC: 順応した子供
    const allQuestions = [
        { text: "大笑いすることがある", type: "FC" },
        { text: "自分は好奇心旺盛なタイプだと思う", type: "FC" },
        { text: "後輩や子どもには厳しく接するべきだと思う", type: "CP" },
        { text: "出先で体調が悪いときは、無理せず早く帰る", type: "FC" },
        { text: "お世話になった人に、よくお返しをする", type: "NP" },
        { text: "計画を立てるのが早いほうだ", type: "A" },
        { text: "相手の期待に応えようとする自分がいる", type: "AC" },
        { text: "人前では自分を出せないタイプだ", type: "AC" },
        { text: "目標は達成しなければ意味はないと思う", type: "CP" },
        { text: "他人が成長していくのを見ると嬉しい", type: "NP" },
        { text: "今まで「遠慮して損をしてきた」と思うことが多い", type: "AC" },
        { text: "トラブルが発生しても、冷静に対処する自信がある", type: "A" },
        { text: "人前で大笑いしたり、泣いたりするなど、感情を表に出せない", type: "AC" },
        { text: "根拠のないことは信じないし、事実に基づいて決めるようにしている", type: "A" },
        { text: "人を思いやる気持ちは強いほうだ", type: "NP" },
        { text: "「言い過ぎたかな」と後悔することがよくある", type: "CP" },
        { text: "自分が感動した番組や映画の話をよくする", type: "FC" },
        { text: "ノリがよく、ハメを外すこともある", type: "FC" }
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

    // ランダムに8問選択
    function selectRandomQuestions() {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 8);
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

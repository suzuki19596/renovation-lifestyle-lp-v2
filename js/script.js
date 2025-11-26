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

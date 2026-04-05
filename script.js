document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Engine Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.engine-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = `tab-${btn.dataset.tab}`;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 3. Industry Tabs
    const indTabBtns = document.querySelectorAll('.ind-tab-btn');
    const indTabPanes = document.querySelectorAll('.ind-pane');

    indTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            indTabBtns.forEach(b => b.classList.remove('active'));
            indTabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = `tab-${btn.dataset.tab}`;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 4. Simple Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.querySelector('.main-nav');
    // For a robust implementation, you'd add a 'mobile-active' class on main-nav and style it in CSS.
    // Given the prompt constraints, we ensure the button is at least wired up.
    mobileMenuBtn.addEventListener('click', () => {
        if (mainNav.style.display === 'block') {
            mainNav.style.display = 'none';
        } else {
            mainNav.style.display = 'block';
            mainNav.style.position = 'absolute';
            mainNav.style.top = '100%';
            mainNav.style.left = '0';
            mainNav.style.width = '100%';
            mainNav.style.background = '#fff';
            mainNav.style.padding = '1rem';
            mainNav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            
            // Adjust inner ul
            const ul = mainNav.querySelector('ul');
            ul.style.flexDirection = 'column';
            ul.style.gap = '1rem';
            ul.style.alignItems = 'center';
        }
    });

    // 5. ROI Calculator Logic (Pricing Page)
    const rVis = document.getElementById('roi-visitors');
    if (rVis) {
        const dVis = document.getElementById('val-visit');
        const rCR = document.getElementById('roi-cr');
        const dCR = document.getElementById('val-cr');
        const rAOV = document.getElementById('roi-aov');
        const dAOV = document.getElementById('val-aov');
        const rLift = document.getElementById('roi-lift');

        const rcRev = document.getElementById('rc-revenue');
        const roOrder = document.getElementById('row-orders');
        const roLift = document.getElementById('row-lift');
        const roInc = document.getElementById('row-inc');
        const roTot = document.getElementById('row-total');

        function calculateROI2() {
            const vis = parseInt(rVis.value);
            const cr = parseFloat(rCR.value);
            const aov = parseInt(rAOV.value);
            const lift = parseFloat(rLift.value);

            dVis.textContent = vis.toLocaleString() + " visitors";
            dCR.textContent = cr.toFixed(1) + "%";
            dAOV.textContent = "₹" + aov.toLocaleString();

            const currentOrders = Math.floor(vis * (cr / 100));
            const newCR = cr * (1 + lift);
            const newOrders = Math.floor(vis * (newCR / 100));
            const incrementalOrders = newOrders - currentOrders;
            const additionalRevenue = incrementalOrders * aov;

            rcRev.textContent = "₹" + additionalRevenue.toLocaleString();
            
            roOrder.textContent = `Current monthly orders: ${currentOrders.toLocaleString()}`;
            roLift.textContent = `Expected conversion lift: ${(lift * 100).toFixed(0)}%`;
            roInc.textContent = `Incremental monthly orders: ${incrementalOrders.toLocaleString()}`;
            roTot.textContent = `Additional revenue at AOV ₹${aov.toLocaleString()}: ₹${additionalRevenue.toLocaleString()}`;
        }

        [rVis, rCR, rAOV, rLift].forEach(el => {
            el.addEventListener('input', calculateROI2);
        });
        calculateROI2(); // init
    }

    // 6. FAQ Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const bubbles = document.querySelectorAll('.bubble-pair');
    bubbles.forEach(b => faqObserver.observe(b));

});

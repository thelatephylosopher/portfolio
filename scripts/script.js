
// Section mappings for search
const sectionMapping = {
    // Tech
    'product': 'tech.html#product-dev',
    'product dev': 'tech.html#product-dev',
    'development': 'tech.html#product-dev',
    'ai': 'tech.html#aiml',
    'ml': 'tech.html#aiml',
    'artificial intelligence': 'tech.html#aiml',
    'machine learning': 'tech.html#aiml',
    'data': 'tech.html#datascience',
    'science': 'tech.html#datascience',
    'engineering': 'tech.html#engtech',
    'tech': 'tech.html',

    // Design
    'design': 'design.html',
    'ui': 'design.html',
    'ux': 'design.html',

    // Academics
    'academics': 'academics.html',
    'coursework': 'academics.html#coursework',
    'projects': 'academics.html#projects',
    'publications': 'academics.html#publications',
    'people': 'academics.html#people',
    'mentors': 'academics.html#people',

    // Art
    'art': 'art.html',
    'words': 'art.html#words',
    'music': 'art.html#music',
    'sketches': 'art.html#sketches',
    'photography': 'art.html#photography',

    // General
    'home': 'index.html',
    'about': 'about.html',
    'contact': 'contact.html',
    'cv': 'Riya_Sanket_Kashive_s_Résumé (7).pdf',
    'resume': 'Riya_Sanket_Kashive_s_Résumé (7).pdf'
};

// Cleanup animation on back button (bfcache)
window.addEventListener('pageshow', (event) => {
    const existingExpanders = document.querySelectorAll('.page-exiting-animation');
    existingExpanders.forEach(el => el.remove());
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle Navigation/Click Animations
    const links = document.querySelectorAll('a.clickable-element, .hero-image-tile.clickable-element, .home-nav-tile.clickable-element, .tile.clickable-element, .hero-subtext.clickable-element');

    links.forEach(link => {
        // ... (Animation logic is same, but let's make sure it handles div click properly too for subtext)
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href') || link.getAttribute('onclick')?.match(/window\.location\.href='(.*?)'/)?.[1];
            if (!href || href.startsWith('javascript')) return;

            // Check if it's an anchor link on the current page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                return; // SKIP ANIMATION
            }

            // Normalize href if it was from onclick (basic check)
            if (link.tagName !== 'A' && !href) return;

            if (link.tagName === 'A') e.preventDefault();

            const rectifier = link.getBoundingClientRect();
            const expander = document.createElement('div');
            expander.classList.add('page-exiting-animation'); // ID/Class for cleanup

            const style = window.getComputedStyle(link);
            const borderColor = style.borderColor;

            // Make it a square using the largest dimension to ensure coverage
            const size = Math.max(rectifier.width, rectifier.height);

            expander.style.position = 'fixed';
            expander.style.left = `${rectifier.left + (rectifier.width - size) / 2}px`;
            expander.style.top = `${rectifier.top + (rectifier.height - size) / 2}px`;
            expander.style.width = `${size}px`;
            expander.style.height = `${size}px`;
            expander.style.borderRadius = '50%';

            // Handle color logic
            let color = '#ffa51f';
            if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'rgb(255, 255, 255)' && borderColor !== 'transparent') {
                color = borderColor;
            } else {
                // Try to pick from page theme?
                // Simple fallback
            }
            expander.style.backgroundColor = color;

            expander.style.zIndex = '9999';
            expander.style.transition = 'transform 0.8s ease-in-out';

            document.body.appendChild(expander);
            expander.offsetHeight; // Force reflow

            const maxDim = Math.max(window.innerWidth, window.innerHeight);
            const scale = (maxDim / size) * 2.5;

            expander.style.transform = `scale(${scale})`;

            setTimeout(() => {
                window.location.href = href;
            }, 700);
        });
    });

    // 2. Search Functionality
    const inputs = document.querySelectorAll('.search-bar'); // Use class to catch all inputs
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = input.value.trim().toLowerCase();
                if (!query) return;

                // Priority 1: Exact/Partial Section Match
                // We check if any key in sectionMapping is contained in query or query is contained in key
                // Simple approach: Exact match of keywords

                let targetUrl = null;

                // Check Sections
                for (const [key, url] of Object.entries(sectionMapping)) {
                    if (query.includes(key)) {
                        targetUrl = url;
                        break;
                    }
                }

                // Priority 2: Projects
                if (!targetUrl) {
                    const project = projectsData.find(p => p.name.toLowerCase().includes(query));
                    if (project && project.link && project.link !== 'NaN') {
                        targetUrl = project.link;
                    }
                }

                if (targetUrl) {
                    window.location.href = targetUrl;
                } else {
                    alert('No matching project or section found.');
                }
            }
        });
    });

    // 3. Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Helper - Render Section (kept from before)
window.renderSection = (containerId, filterFn, getDisplayName, getLink, customBg, borderColor) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = projectsData.filter(filterFn);

    items.forEach(item => {
        const linkUrl = getLink(item);
        if (linkUrl === 'NaN' || !linkUrl) return;

        const a = document.createElement('a');
        a.className = 'tile clickable-element';
        a.href = linkUrl;
        if (borderColor) a.style.borderColor = borderColor;

        if (customBg) {
            a.style.backgroundImage = `url('${customBg}')`;
        }

        const span = document.createElement('span');
        span.innerText = getDisplayName(item);
        a.appendChild(span);

        // Re-apply animation listener specifically for these dynamic elements
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const rectifier = a.getBoundingClientRect();
            const expander = document.createElement('div');
            expander.classList.add('page-exiting-animation');
            expander.style.position = 'fixed';
            expander.style.left = `${rectifier.left}px`;
            expander.style.top = `${rectifier.top}px`;
            expander.style.width = `${rectifier.width}px`;
            expander.style.height = `${rectifier.height}px`;
            expander.style.borderRadius = '50%';
            expander.style.backgroundColor = borderColor || '#ffa51f';
            expander.style.zIndex = '9999';
            expander.style.transition = 'transform 0.8s ease-in-out';
            document.body.appendChild(expander);
            expander.offsetHeight;
            const maxDim = Math.max(window.innerWidth, window.innerHeight);
            const scale = (maxDim / rectifier.width) * 2.5;
            expander.style.transform = `scale(${scale})`;
            setTimeout(() => {
                window.location.href = linkUrl;
            }, 700);
        });

        container.appendChild(a);
    });
};

// Menu Toggle
function openmenu() {
    const menu = document.getElementById("sidemenu");
    if (menu) menu.style.right = "0";
}

function closemenu() {
    const menu = document.getElementById("sidemenu");
    if (menu) menu.style.right = "-250px";
}
window.openmenu = openmenu;
window.closemenu = closemenu;

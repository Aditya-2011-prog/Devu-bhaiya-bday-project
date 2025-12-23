
// Logic for interaction and confetti

document.addEventListener('DOMContentLoaded', () => {
    const giftContainer = document.getElementById('gift-container');
    const wishContent = document.getElementById('wish-content');
    const cakeContainer = document.getElementById('cake-container');
    const cakePaths = [
        document.getElementById('cake-path-1'),
        document.getElementById('cake-path-2'),
        document.getElementById('cake-path-3'),
        document.getElementById('cake-path-4')
    ];
    const cakeCandles = document.getElementById('cake-candles');
    const bgMusic = document.getElementById('bg-music');

    // Interaction
    giftContainer.addEventListener('click', () => {
        // Explode gift
        giftContainer.classList.add('exploded');

        // Play Music
        bgMusic.volume = 0.5;
        bgMusic.play().catch(e => console.log('Audio autoplay prevented:', e));

        // Start Cake Animation Sequence
        setTimeout(() => {
            giftContainer.classList.add('hidden');
            cakeContainer.classList.remove('hidden');

            // Draw Cake Layers sequentially
            cakePaths.forEach((path, index) => {
                setTimeout(() => {
                    path.classList.remove('opacity-0');
                    path.classList.add('draw-path');
                }, index * 500); // Stagger by 500ms
            });

            // Show Candles after cake draws
            setTimeout(() => {
                cakeCandles.classList.remove('opacity-0');
            }, 2500);

            // Show Wish Content overlaying cake
            setTimeout(() => {
                wishContent.classList.remove('hidden');
                // Trigger reflow
                void wishContent.offsetWidth;
                wishContent.classList.remove('opacity-0', 'scale-95');
                wishContent.classList.add('opacity-100', 'scale-100');

                // Blur the cake slightly for focus
                cakeContainer.classList.add('blur-sm', 'opacity-80');
            }, 3000);

        }, 600);
    });

    // Confetti System
    initConfetti();
});

function initConfetti() {
    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const flakes = [];
    const maxFlakes = 150;
    const emojis = ['🎈', '🎂', '🍰', '🎉', '🎁', '🕯️'];

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    class Flake {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Slightly smaller emoji range for better performance
            this.size = Math.random() * 15 + 10;
            this.speedY = Math.random() * 1.5 + 0.5; // Slightly faster base speed
            this.swayAmplitude = Math.random() * 2; // Horizontal sway amount
            this.swayFrequency = Math.random() * 0.05 + 0.01; // How fast it sways
            this.swayOffset = Math.random() * Math.PI * 2; // Random starting angle
            this.opacity = Math.random() * 0.5 + 0.5; // Brighter

            // 80% chance to be an emoji
            this.isEmoji = Math.random() > 0.2;
            this.emoji = emojis[Math.floor(Math.random() * emojis.length)];

            if (!this.isEmoji) {
                this.size = Math.random() * 5 + 3;
                const colors = ['#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
        }

        update() {
            this.y += this.speedY;
            // Add sine wave motion for sway
            this.x += Math.sin(this.swayOffset) * 0.5;
            this.swayOffset += this.swayFrequency;

            // Loop smoothly
            if (this.y > height) {
                this.y = -50;
                this.x = Math.random() * width;
            }
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
        }

        draw() {
            if (this.isEmoji) {
                // Ensure font is set once per frame ideally, but per flake is ok if string is constant
                ctx.font = `${this.size}px serif`;
                ctx.globalAlpha = this.opacity;
                ctx.fillText(this.emoji, this.x, this.y);
            } else {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            // Reset Alpha
            ctx.globalAlpha = 1;
        }
    }

    // Init flakes
    for (let i = 0; i < maxFlakes; i++) {
        flakes.push(new Flake());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        flakes.forEach(flake => {
            flake.update();
            flake.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

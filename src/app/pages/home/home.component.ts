import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ClientRequestDto } from 'src/app/model/ClientRequestDto';

interface Bubble {
  id: number;
  size: number;
  left: number;
  bottom: number;
  duration: number;
  delay: number;
}

interface Stat {
  value: string;
  label: string;
}
interface Blog {
  id: number;
  title: string;
  image: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  slug: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  
  @ViewChild('servicesWrapper', { static: false }) wrapper!: ElementRef;

  services = [
    { name: 'Water Filter Installation', icon: 'fas fa-video', link: '/services', ariaLabel: 'Regular cleaning and filter replacements to ensure your system delivers safe, clean, and great-tasting water every day.' },
    { name: 'Filter Maintenance & Servicing', icon: 'fas fa-bullhorn', link: '/services', ariaLabel: 'Regular cleaning and filter replacements to ensure your system delivers safe, clean, and great-tasting water every day.' },
    { name: 'Water Quality Testing', icon: 'fas fa-paint-brush', link: '/services', ariaLabel: 'We run detailed water tests to detect impurities, hardness, and contamination — ensuring you get the right filtration' }
  ];

  works = [
    { title: 'Grand Pittu', category: 'Web Development', image: 'assets/grandpittu.png' },
    { title: 'Finspire Portfolio', category: 'Web Development', image: 'assets/finspire-portfolio.png' },
    { title: 'Kalaisankara Matrimony', category: 'Web Development', image: 'assets/kalaisankara.png' }
  ];

  mouseX = 0;
  mouseY = 0;
  bubbles: Bubble[] = [];
  ripples = [0, 1, 2];

  stats: Stat[] = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '99%', label: 'Pure Water' },
    { value: '24/7', label: 'Support' }
  ];
  blogs: Blog[] = [
    {
      id: 1,
      title: 'Why RO Water Purifiers Are Essential for Every Home',
      image: 'assets/images/blog/blog-1.jpg',
      author: 'Aura Team',
      date: 'November 15, 2025',
      category: 'Water Purification',
      excerpt: 'Discover the importance of RO water purifiers in ensuring safe, clean drinking water for your family. Learn about the technology behind reverse osmosis.',
      slug: 'whole-house-water-filtration'
    },
    {
      id: 2,
      title: '5 Signs Your Water Filter Needs Replacement',
      image: 'assets/images/blog/blog-2.jpg',
      author: 'Aura Team',
      date: 'November 10, 2025',
      category: 'Maintenance',
      excerpt: 'Regular filter replacement is crucial for maintaining water quality. Here are the key signs that indicate its time to change your water filter.',
      slug: 'water-filter-replacement-signs'
    },
    {
      id: 3,
      title: 'Understanding TDS Levels in Drinking Water',
      image: 'assets/images/blog/blog-3.jpg',
      author: 'Aura Team',
      date: 'November 5, 2025',
      category: 'Water Quality',
      excerpt: 'Total Dissolved Solids (TDS) is an important measure of water quality. Learn what TDS levels mean and how they affect your health.',
      slug: 'water-purification-for-businesses'
    }
  ];

  private rotationDegree = 0;
  private radius = 200;
  hoveredService: any = null;
  clients:ClientRequestDto[] = [];

  constructor(private router: Router) { }
  @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    }
  ngOnInit(): void {
    this.clients = [
      { name: 'Grand Pittu', description: 'Web Development', image: 'assets/grandpittu.png' },
      { name: 'Finspire Portfolio', description: 'Web Development', image: 'assets/finspire-portfolio.png' },
      { name: 'Kalaisankara Matrimony', description: 'Web Development', image: 'assets/kalaisankara.png' }
    ];
    this.generateBubbles();
  }

  ngAfterViewInit() {
    this.positionServices();
    this.animate();
    
    // Reposition services on window resize
    window.addEventListener('resize', () => {
      this.positionServices();
    });
  }

  generateBubbles(): void {
    this.bubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      left: Math.random() * 100,
      bottom: -(Math.random() * 100),
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5
    }));
  }
getOrbStyle(index: number): object {
    const configs = [
      { top: '10%', right: '10%', multiplier: 0.02 },
      { bottom: '10%', left: '5%', multiplier: -0.01 }
    ];
    const config = configs[index];
    
    return {
      transform: `translate(${this.mouseX * config.multiplier}px, ${this.mouseY * Math.abs(config.multiplier)}px)`
    };
  }
  positionServices() {
    const wrapperEl = this.wrapper.nativeElement;
    const servicesEls = wrapperEl.querySelectorAll('.service');
    const centerX = wrapperEl.offsetWidth / 2;
    const centerY = wrapperEl.offsetHeight / 2;

    // Adjust radius based on screen size
    const containerWidth = wrapperEl.offsetWidth;
    let adjustedRadius = this.radius;
    
    if (containerWidth <= 280) {
      adjustedRadius = 110; // Very small mobile
    } else if (containerWidth <= 350) {
      adjustedRadius = 140; // Small mobile
    } else if (containerWidth <= 400) {
      adjustedRadius = 160; // Medium mobile
    } else {
      adjustedRadius = this.radius; // Desktop
    }

    servicesEls.forEach((serviceEl: any, index: number) => {
      const angle = (index / servicesEls.length) * 2 * Math.PI;
      const x = centerX + adjustedRadius * Math.cos(angle) - serviceEl.offsetWidth / 2;
      const y = centerY + adjustedRadius * Math.sin(angle) - serviceEl.offsetHeight / 2;
      serviceEl.style.left = `${x}px`;
      serviceEl.style.top = `${y}px`;
    });
  }

  animate() {
    const wrapperEl = this.wrapper.nativeElement;
    const servicesEls = wrapperEl.querySelectorAll('.service');

    const animateFrame = () => {
      // Slower rotation for smoother motion
      this.rotationDegree = (this.rotationDegree + 0.25) % 360;
      wrapperEl.style.transform = `rotate(${this.rotationDegree}deg)`;
      
      // Keep the service cards slightly more upright by adding a small
      // anti-clockwise bias to the counter-rotation
      const uprightBiasDeg = 5; // small anti-clockwise adjustment
      servicesEls.forEach((serviceEl: any) => {
        const hovered = serviceEl.classList.contains('hovered');
        serviceEl.style.transform = `rotate(${-this.rotationDegree - uprightBiasDeg}deg) scale(${hovered ? 1.15 : 1}) rotateX(10deg) rotateY(10deg)`;
      });
      requestAnimationFrame(animateFrame);
    };

    animateFrame();
  }

  navigate(link: string) {
    this.router.navigate([link]);
  }



}

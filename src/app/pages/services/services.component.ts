import { Component, Input, OnInit } from '@angular/core';
interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
@Input() title: string = 'Services';
  @Input() subtitle: string = '';
  @Input() breadcrumbs: { label: string; link?: string }[] = [];

  bubbles: Bubble[] = [];
  ripples = [0, 1, 2];

  ngOnInit(): void {
    this.generateBubbles();
  }

  generateBubbles(): void {
    this.bubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 40 + 15,
      left: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4
    }));
  }
  services = [
    {
      name: '24 x 7 Support',
      icon: 'fas fa-globe',
      description: 'Custom web applications built with modern technologies like Angular, React, and Node.js',
      features: ['Responsive Design', 'Progressive Web Apps', 'E-commerce Solutions', 'CMS Development']
    },
    {
      name: 'Water Quality Testing',
      icon: 'fas fa-mobile-alt',
      description: 'Native and cross-platform mobile applications for iOS and Android',
      features: ['Native iOS/Android', 'React Native', 'Flutter', 'App Store Optimization']
    },
    {
      name: 'Filter Maintenance & Servicing',
      icon: 'fas fa-cloud',
      description: 'Scalable cloud infrastructure and migration services',
      features: ['AWS/Azure/GCP', 'DevOps & CI/CD', 'Microservices', 'Container Orchestration']
    },
    {
      name: 'Water Filter Installation',
      icon: 'fas fa-paint-brush',
      description: 'Professional graphics designs for your business',
      features: ['Logo Design', 'Banner Design', 'Poster Design', 'Business Card Design']
    }
  ];

}

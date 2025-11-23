import { Component } from '@angular/core';
interface Project {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  location: string;
  image: string;
  description: string;
  features: string[];
  slug: string;
}
@Component({
  selector: 'app-recent-projects',
  templateUrl: './recent-projects.component.html',
  styleUrls: ['./recent-projects.component.scss']
})
export class RecentProjectsComponent {
projects: Project[] = [
    {
      id: 1,
      title: 'Complete RO Plant Installation',
      category: 'Commercial',
      categorySlug: 'commercial',
      location: 'Jaffna Teaching Hospital',
      image: 'assets/images/projects/project1.jpg',
      description: 'Installed a high-capacity RO plant serving 500+ beds with 99.9% pure water output.',
      features: ['5000 LPH Capacity', '24/7 Operation', 'Auto-flush System'],
      slug: 'jaffna-hospital-ro-plant'
    },
    {
      id: 2,
      title: 'Residential Water Purification',
      category: 'Residential',
      categorySlug: 'residential',
      location: 'Private Villa, Kilinochchi',
      image: 'assets/images/projects/project2.png',
      description: 'Whole-house water filtration system with UV sterilization and softener unit.',
      features: ['UV + RO System', 'Water Softener', 'Smart Monitoring'],
      slug: 'kilinochchi-villa-purification'
    },
    {
      id: 3,
      title: 'Industrial Water Treatment',
      category: 'Industrial',
      categorySlug: 'industrial',
      location: 'Textile Factory, Vavuniya',
      image: 'assets/images/projects/project3.png',
      description: 'Large-scale water treatment plant for industrial processing and waste water management.',
      features: ['10000 LPH Capacity', 'Waste Treatment', 'Chemical Dosing'],
      slug: 'vavuniya-textile-treatment'
    },
    {
      id: 4,
      title: 'School Campus Water System',
      category: 'Institutional',
      categorySlug: 'institutional',
      location: 'Central College, Mullaitivu',
      image: 'assets/images/projects/project4.png',
      description: 'Multi-point water purification system across campus serving 2000+ students.',
      features: ['Multiple Units', 'Low Maintenance', 'Child-safe Design'],
      slug: 'mullaitivu-school-water'
    },
    {
      id: 5,
      title: 'Hotel Water Management',
      category: 'Commercial',
      categorySlug: 'commercial',
      location: 'Beach Resort, Trincomalee',
      image: 'assets/images/projects/project5.png',
      description: 'Complete water solution including drinking water, pool filtration, and grey water recycling.',
      features: ['Pool Filtration', 'Grey Water Recycling', 'Energy Efficient'],
      slug: 'trincomalee-resort-water'
    },
    {
      id: 6,
      title: 'Restaurant Chain Installation',
      category: 'Commercial',
      categorySlug: 'commercial',
      location: 'Multiple Locations, Northern Province',
      image: 'assets/images/projects/project6.png',
      description: 'Standardized water purification systems installed across 5 restaurant locations.',
      features: ['Compact Design', 'Quick Installation', 'Uniform Quality'],
      slug: 'restaurant-chain-installation'
    }
  ];

  categories: string[] = ['All', 'Commercial', 'Residential', 'Industrial', 'Institutional'];
  activeCategory: string = 'All';
  filteredProjects: Project[] = [];

  ngOnInit(): void {
    this.filteredProjects = this.projects;
  }

  filterProjects(category: string): void {
    this.activeCategory = category;
    if (category === 'All') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(p => p.category === category);
    }
  }
}

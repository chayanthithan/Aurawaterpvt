import { Component } from '@angular/core';
interface Review {
  id: number;
  name: string;
  role: string;
  location: string;
  image: string;
  rating: number;
  review: string;
}
@Component({
  selector: 'app-client-review',
  templateUrl: './client-review.component.html',
  styleUrls: ['./client-review.component.scss']
})
export class ClientReviewComponent {
reviews: Review[] = [
    {
      id: 1,
      name: 'Sanjay Kumar',
      role: 'Homeowner',
      location: 'Kilinochchi',
      image: 'assets/images/reviews/client-1.png',
      rating: 5,
      review: 'Aura Water Management installed an RO system in our home and the difference in water quality is remarkable. The team was professional, punctual, and explained everything clearly. Highly recommended!'
    },
    {
      id: 2,
      name: 'Lakshmi Devi',
      role: 'School Principal',
      location: 'Mullaitivu',
      image: 'assets/images/reviews/client-4.png',
      rating: 5,
      review: 'Aura installed water purifiers across our school campus. The children now have access to safe drinking water. Their team is responsive and the after-sales service is excellent.'
    },
    {
      id: 3,
      name: 'Priya Selvam',
      role: 'Restaurant Owner',
      location: 'Jaffna',
      image: 'assets/images/reviews/client-2.png',
      rating: 5,
      review: 'We needed a commercial water purification system for our restaurant. Aura provided an excellent solution within our budget. Their 24/7 support has been invaluable for our business operations.'
    },
    {
      id: 4,
      name: 'Mohamed Rizwan',
      role: 'Factory Manager',
      location: 'Vavuniya',
      image: 'assets/images/reviews/client-3.png',
      rating: 5,
      review: 'Outstanding service from start to finish. The water testing they conducted helped us understand our needs better. The installation was seamless and the maintenance service is top-notch.'
    },
    {
      id: 5,
      name: 'Lakshmi Devi',
      role: 'School Principal',
      location: 'Mullaitivu',
      image: 'assets/images/reviews/client-4.png',
      rating: 5,
      review: 'Aura installed water purifiers across our school campus. The children now have access to safe drinking water. Their team is responsive and the after-sales service is excellent.'
    },
    {
      id: 6,
      name: 'Suresh Kamar',
      role: 'School Principal',
      location: 'Mullaitivu',
      image: 'assets/images/reviews/client-4.png',
      rating: 5,
      review: 'Aura installed water purifiers across our school campus. The children now have access to safe drinking water. Their team is responsive and the after-sales service is excellent.'
    }
  ];

  currentIndex = 0;
  autoSlideInterval: any;
  visibleCards = 3;

  ngOnInit(): void {
    this.updateVisibleCards();
    this.startAutoSlide();
    window.addEventListener('resize', this.updateVisibleCards.bind(this));
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    window.removeEventListener('resize', this.updateVisibleCards.bind(this));
  }

  updateVisibleCards(): void {
    if (window.innerWidth < 768) {
      this.visibleCards = 1;
    } else if (window.innerWidth < 1024) {
      this.visibleCards = 2;
    } else {
      this.visibleCards = 3;
    }
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    const maxIndex = this.reviews.length - this.visibleCards;
    this.currentIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
  }

  prevSlide(): void {
    const maxIndex = this.reviews.length - this.visibleCards;
    this.currentIndex = this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  getTransform(): string {
    const cardWidth = 100 / this.visibleCards;
    return `translateX(-${this.currentIndex * cardWidth}%)`;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  getDots(): number[] {
    return Array(this.reviews.length - this.visibleCards + 1).fill(0);
  }
}
